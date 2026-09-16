import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { RefObject } from "react";

const STEPS = 20;
const WHEEL_OFFSETS = [
  [-0.43, 0.58],
  [0.43, 0.58],
  [-0.43, -0.58],
  [0.43, -0.58],
] as const;
const WHEEL_COUNT = 4;
const TOTAL_BLOCKS = STEPS * WHEEL_COUNT;
const MAX_AGE = 0.85; // seconds trail stays visible
const EMIT_INTERVAL = 0.04;

const trailGeo = new RoundedBoxGeometry(0.14, 0.02, 0.2, 1, 0.01);
const trailMat = new THREE.MeshStandardMaterial({
  color: "#214224",
  transparent: true,
  opacity: 0.4,
  depthWrite: false,
  roughness: 0.9,
});

export default memo(function Trail({ target }: { target: RefObject<THREE.Group | null> }) {
  const instancedRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ages = useRef<Float32Array>(new Float32Array(TOTAL_BLOCKS).fill(Infinity));
  const posX = useRef<Float32Array>(new Float32Array(TOTAL_BLOCKS).fill(0));
  const posY = useRef<Float32Array>(new Float32Array(TOTAL_BLOCKS).fill(-10));
  const posZ = useRef<Float32Array>(new Float32Array(TOTAL_BLOCKS).fill(0));
  const rotations = useRef<Float32Array>(new Float32Array(TOTAL_BLOCKS).fill(0));
  const timeSinceEmit = useRef(0);
  const lastEmitPos = useRef(new THREE.Vector3(0, -999, 0));

  useFrame((_, delta) => {
    const t = target.current;
    const im = instancedRef.current;
    if (!t || !im) return;

    timeSinceEmit.current += delta;
    const moved = lastEmitPos.current.distanceTo(t.position) > 0.08;

    // Emit new wheel tracks periodically when the cart moves
    if (timeSinceEmit.current > EMIT_INTERVAL && moved) {
      timeSinceEmit.current = 0;

      // Shift existing blocks back by WHEEL_COUNT
      for (let i = TOTAL_BLOCKS - 1; i >= WHEEL_COUNT; i--) {
        posX.current[i] = posX.current[i - WHEEL_COUNT];
        posY.current[i] = posY.current[i - WHEEL_COUNT];
        posZ.current[i] = posZ.current[i - WHEEL_COUNT];
        rotations.current[i] = rotations.current[i - WHEEL_COUNT];
        ages.current[i] = ages.current[i - WHEEL_COUNT];
      }

      const cosY = Math.cos(t.rotation.y);
      const sinY = Math.sin(t.rotation.y);

      for (let w = 0; w < WHEEL_COUNT; w++) {
        const [lx, lz] = WHEEL_OFFSETS[w];
        posX.current[w] = t.position.x + (lx * cosY + lz * sinY);
        posY.current[w] = 0.015;
        posZ.current[w] = t.position.z + (-lx * sinY + lz * cosY);
        rotations.current[w] = t.rotation.y;
        ages.current[w] = 0;
      }

      lastEmitPos.current.copy(t.position);
    }

    let needsUpdate = false;
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      ages.current[i] += delta;
      const age = ages.current[i];
      if (age >= MAX_AGE) {
        dummy.position.set(0, -99, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
        continue;
      }

      const life = 1 - age / MAX_AGE;
      const scale = 0.4 + 0.6 * life;
      dummy.position.set(posX.current[i], posY.current[i], posZ.current[i]);
      dummy.rotation.set(0, rotations.current[i], 0);
      dummy.scale.set(scale, 1, scale);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
      needsUpdate = true;
    }

    if (needsUpdate) {
      im.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedRef}
      args={[trailGeo, trailMat, TOTAL_BLOCKS]}
      frustumCulled={false}
    />
  );
});
