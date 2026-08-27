import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { RefObject } from "react";

const STEPS = 20;
const WHEEL_OFFSETS = [
  [-0.72, 0.72],
  [0.72, 0.72],
  [-0.72, -0.72],
  [0.72, -0.72],
] as const;
const WHEEL_COUNT = 4;
const TOTAL_BLOCKS = STEPS * WHEEL_COUNT;
const MAX_AGE = 0.85; // seconds trail stays visible
const EMIT_INTERVAL = 0.04;

export default function Trail({ target }: { target: RefObject<THREE.Group | null> }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const ages = useRef<number[]>(new Array(TOTAL_BLOCKS).fill(Infinity));
  const positions = useRef<THREE.Vector3[]>(
    Array.from({ length: TOTAL_BLOCKS }, () => new THREE.Vector3(0, -10, 0))
  );
  const rotations = useRef<number[]>(new Array(TOTAL_BLOCKS).fill(0));
  const timeSinceEmit = useRef(0);
  const lastEmitPos = useRef<THREE.Vector3 | null>(null);

  useFrame((_, delta) => {
    const t = target.current;
    if (!t) return;

    timeSinceEmit.current += delta;
    const moved = !lastEmitPos.current || lastEmitPos.current.distanceTo(t.position) > 0.08;

    // Emit a new 4-wheel trail block periodically when the cart moves
    if (timeSinceEmit.current > EMIT_INTERVAL && moved) {
      timeSinceEmit.current = 0;

      // Shift everything back by 4 slots
      for (let i = TOTAL_BLOCKS - 1; i >= WHEEL_COUNT; i--) {
        positions.current[i].copy(positions.current[i - WHEEL_COUNT]);
        rotations.current[i] = rotations.current[i - WHEEL_COUNT];
        ages.current[i] = ages.current[i - WHEEL_COUNT];
      }

      const cosY = Math.cos(t.rotation.y);
      const sinY = Math.sin(t.rotation.y);

      for (let w = 0; w < WHEEL_COUNT; w++) {
        const [lx, lz] = WHEEL_OFFSETS[w];
        const wx = t.position.x + (lx * cosY + lz * sinY);
        const wz = t.position.z + (-lx * sinY + lz * cosY);

        positions.current[w].set(wx, 0.015, wz);
        rotations.current[w] = t.rotation.y;
        ages.current[w] = 0;
      }

      lastEmitPos.current = t.position.clone();
    }

    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      ages.current[i] += delta;
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const age = ages.current[i];
      if (age >= MAX_AGE) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;
      mesh.position.copy(positions.current[i]);
      mesh.rotation.y = rotations.current[i];
      const life = 1 - age / MAX_AGE;
      const scale = 0.4 + 0.6 * life;
      mesh.scale.set(scale, 1, scale);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = life * 0.45;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
        <RoundedBox
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          args={[0.22, 0.02, 0.28]}
          radius={0.01}
          visible={false}
        >
          <meshStandardMaterial
            color="#214224"
            transparent
            opacity={0}
            depthWrite={false}
            roughness={0.9}
          />
        </RoundedBox>
      ))}
    </group>
  );
}
