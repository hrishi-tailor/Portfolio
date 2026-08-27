import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { KeyState } from "./useKeyboard";
import Cart from "./Cart";
import Trail from "./Trail";
import Sign from "./Sign";
import Course from "./Course";
import CameraRig from "./CameraRig";
import { SIGNS } from "./terrain";

const PROXIMITY_RADIUS = 4.5;

export { SIGNS };

export default function Scene({
  keys,
  onActiveSign,
}: {
  keys: MutableRefObject<KeyState>;
  onActiveSign: (id: string | null) => void;
}) {
  const cart = useRef<THREE.Group>(null!);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const lastActive = useRef<string | null>(null);

  useFrame(() => {
    const c = cart.current;
    if (!c) return;
    let closest: string | null = null;
    let closestDist = Infinity;
    for (const sign of SIGNS) {
      const dx = c.position.x - sign.position[0];
      const dz = c.position.z - sign.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < PROXIMITY_RADIUS && dist < closestDist) {
        closest = sign.id;
        closestDist = dist;
      }
    }
    if (closest !== lastActive.current) {
      lastActive.current = closest;
      onActiveSign(closest);
      if (closest) {
        setVisited((prev) => (prev.has(closest!) ? prev : new Set(prev).add(closest!)));
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#8fd3f4"]} />
      <fog attach="fog" args={["#8fd3f4", 30, 95]} />
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Course target={cart} />

      {SIGNS.map((sign) => (
        <Sign key={sign.id} data={sign} active={visited.has(sign.id)} />
      ))}

      <Cart ref={cart} keys={keys} />
      <Trail target={cart} />
      <CameraRig target={cart} />
    </>
  );
}
