import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RefObject } from "react";

const POOL_SIZE = 22;
const MAX_AGE = 0.9; // seconds a trail dot stays visible
const EMIT_INTERVAL = 0.045;

export default function Trail({ target }: { target: RefObject<THREE.Group | null> }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const ages = useRef<number[]>(new Array(POOL_SIZE).fill(Infinity));
  const positions = useRef<THREE.Vector3[]>(
    Array.from({ length: POOL_SIZE }, () => new THREE.Vector3(0, -5, 0))
  );
  const timeSinceEmit = useRef(0);
  const lastEmitPos = useRef<THREE.Vector3 | null>(null);

  useFrame((_, delta) => {
    const t = target.current;
    if (!t) return;

    timeSinceEmit.current += delta;

    // Emit a new trail point periodically, if the cart has actually moved
    if (
      timeSinceEmit.current > EMIT_INTERVAL &&
      (!lastEmitPos.current || lastEmitPos.current.distanceTo(t.position) > 0.15)
    ) {
      timeSinceEmit.current = 0;
      // shift everything back one slot
      for (let i = POOL_SIZE - 1; i > 0; i--) {
        positions.current[i].copy(positions.current[i - 1]);
        ages.current[i] = ages.current[i - 1];
      }
      positions.current[0].copy(t.position);
      positions.current[0].y = 0.02;
      ages.current[0] = 0;
      lastEmitPos.current = t.position.clone();
    }

    for (let i = 0; i < POOL_SIZE; i++) {
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
      const life = 1 - age / MAX_AGE;
      const scale = 0.35 * life + 0.08;
      mesh.scale.setScalar(scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = life * 0.5;
    }
  });

  return (
    <group>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <circleGeometry args={[1, 10]} />
          <meshBasicMaterial color="#fff7d6" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
