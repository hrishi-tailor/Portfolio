import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { RefObject } from "react";

// Fixed world-space offset — the camera direction never rotates with the cart,
// giving the constant birds-eye/isometric angle Crossy Road uses.
const OFFSET = new THREE.Vector3(11, 16, 11);

export default function CameraRig({ target }: { target: RefObject<THREE.Group | null> }) {
  const camera = useRef<THREE.OrthographicCamera>(null!);

  useFrame((_, delta) => {
    const t = target.current;
    const cam = camera.current;
    if (!t || !cam) return;

    const desired = new THREE.Vector3().copy(t.position).add(OFFSET);
    const lerp = 1 - Math.pow(0.0005, delta);
    cam.position.lerp(desired, lerp);
    cam.lookAt(t.position.x, t.position.y + 0.6, t.position.z);
  });

  return (
    <OrthographicCamera
      ref={camera}
      makeDefault
      zoom={34}
      near={0.1}
      far={200}
      position={[11, 16, 11]}
    />
  );
}
