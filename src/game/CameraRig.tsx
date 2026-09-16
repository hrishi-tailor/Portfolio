import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import type { RefObject } from "react";

// Fixed world-space offset: the camera direction never rotates with the cart,
// giving the constant birds-eye/isometric angle Crossy Road uses.
const OFFSET = new THREE.Vector3(11, 16, 11);

export default memo(function CameraRig({
  target,
  finaleActive = false,
}: {
  target: RefObject<THREE.Group | null>;
  finaleActive?: boolean;
}) {
  const camera = useRef<THREE.OrthographicCamera>(null!);
  const desiredPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const orbitRadius = Math.hypot(OFFSET.x, OFFSET.z);
  const orbitAngle = useRef(Math.atan2(OFFSET.z, OFFSET.x));

  useFrame((_, delta) => {
    const t = target.current;
    const cam = camera.current;
    if (!t || !cam) return;

    const dt = THREE.MathUtils.clamp(delta, 0.001, 0.05);

    if (finaleActive) {
      // Slowly pan around the cart to showcase the celebration and confetti
      orbitAngle.current += dt * 0.22;
      const ox = Math.cos(orbitAngle.current) * orbitRadius;
      const oz = Math.sin(orbitAngle.current) * orbitRadius;
      desiredPos.current.set(t.position.x + ox, t.position.y + OFFSET.y, t.position.z + oz);
    } else {
      desiredPos.current.set(t.position.x + OFFSET.x, t.position.y + OFFSET.y, t.position.z + OFFSET.z);
    }

    const dampSpeed = finaleActive ? 4 : 10;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, desiredPos.current.x, dampSpeed, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, desiredPos.current.y, 8, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, desiredPos.current.z, dampSpeed, dt);

    lookTarget.current.set(t.position.x, t.position.y + 0.6, t.position.z);
    cam.lookAt(lookTarget.current);
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
});
