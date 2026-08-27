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
import { projects } from "../data/content";
import type { SignData } from "./Sign";

const SIGNS: SignData[] = [
  { id: "about", label: "ABOUT ME", position: [-4, 0, -10], rotationY: 0.3, accent: "#ffb000" },
  {
    id: projects[0].id,
    label: projects[0].ticker,
    position: [5, 0, -24],
    rotationY: -0.3,
    accent: "#3ddc84",
  },
  {
    id: projects[1].id,
    label: projects[1].ticker,
    position: [-6, 0, -38],
    rotationY: 0.3,
    accent: "#3ddc84",
  },
  { id: "skills", label: "SKILLS", position: [5, 0, -50], rotationY: -0.3, accent: "#ffb000" },
  { id: "contact", label: "CONTACT", position: [0, 0, -63], rotationY: 0, accent: "#ff9d3d" },
];

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
