import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { KeyState } from "./useKeyboard";

const MAX_SPEED = 7.5;
const ACCEL = 9;
const FRICTION = 6;
const TURN_SPEED = 2.4;
export type CartHandle = THREE.Group;

/** Blocky wheel: outer black square with inner grey square */
function WheelMesh() {
  return (
    <group>
      {/* Outer black square tire */}
      <RoundedBox args={[0.22, 0.54, 0.54]} radius={0.06} castShadow>
        <meshStandardMaterial color="#181a18" roughness={0.8} />
      </RoundedBox>
      {/* Inner grey square rim/hub */}
      <RoundedBox args={[0.24, 0.28, 0.28]} radius={0.03}>
        <meshStandardMaterial color="#8a909a" metalness={0.2} roughness={0.4} />
      </RoundedBox>
    </group>
  );
}

/** Golf bag with fanned-out club set resting in the rear basket */
function GolfBag() {
  return (
    <group position={[0.22, 0.48, -0.82]} rotation={[-0.22, 0.15, 0]}>
      {/* Main Bag Body */}
      <RoundedBox args={[0.3, 0.65, 0.3]} radius={0.08} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#2d5038" roughness={0.7} />
      </RoundedBox>
      {/* Bag leather collar trim */}
      <RoundedBox args={[0.32, 0.08, 0.32]} radius={0.03} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} />
      </RoundedBox>
      {/* Side zippered pocket */}
      <RoundedBox args={[0.12, 0.28, 0.22]} radius={0.03} position={[0.16, 0.24, 0]}>
        <meshStandardMaterial color="#24422e" roughness={0.7} />
      </RoundedBox>
      {/* Carrying strap */}
      <RoundedBox
        args={[0.04, 0.4, 0.06]}
        radius={0.02}
        position={[-0.14, 0.32, 0]}
        rotation={[0, 0, 0.1]}
      >
        <meshStandardMaterial color="#8b5a2b" />
      </RoundedBox>

      {/* Club 1: Driver with red protective head cover */}
      <mesh position={[-0.05, 0.78, 0.02]} rotation={[0.1, 0, -0.15]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#c0c4cc" metalness={0.5} />
      </mesh>
      <RoundedBox
        args={[0.08, 0.07, 0.1]}
        radius={0.02}
        position={[-0.08, 0.96, 0.04]}
        rotation={[0.2, 0.4, 0]}
        castShadow
      >
        <meshStandardMaterial color="#d94f4f" />
      </RoundedBox>

      {/* Club 2: Long Iron */}
      <mesh position={[0.04, 0.76, -0.04]} rotation={[-0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.06, 0.04, 0.08]}
        radius={0.01}
        position={[0.06, 0.92, -0.06]}
        rotation={[-0.3, -0.2, 0.2]}
      >
        <meshStandardMaterial color="#b8bcc4" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Club 3: Wedge */}
      <mesh position={[-0.02, 0.74, -0.06]} rotation={[-0.2, 0, -0.08]}>
        <cylinderGeometry args={[0.008, 0.008, 0.32, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.06, 0.04, 0.08]}
        radius={0.01}
        position={[-0.04, 0.88, -0.09]}
        rotation={[-0.4, 0.1, -0.1]}
      >
        <meshStandardMaterial color="#b8bcc4" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Club 4: Putter */}
      <mesh position={[0.05, 0.71, 0.05]} rotation={[0.15, 0, 0.12]}>
        <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.05, 0.03, 0.09]}
        radius={0.01}
        position={[0.07, 0.83, 0.07]}
        rotation={[0.1, -0.4, 0.1]}
      >
        <meshStandardMaterial color="#303438" />
      </RoundedBox>
    </group>
  );
}

/** Complete Cart Chassis with RoundedBox body panels, canopy, seats, and windshield */
function CartChassis() {
  return (
    <group>
      {/* Lower chassis / floor pan */}
      <RoundedBox args={[1.35, 0.22, 2.3]} radius={0.06} position={[0, 0.24, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#242825" roughness={0.8} />
      </RoundedBox>

      {/* Front hood & cowl */}
      <RoundedBox args={[1.22, 0.36, 0.9]} radius={0.08} position={[0, 0.48, 0.65]} castShadow receiveShadow>
        <meshStandardMaterial color="#f4f4f2" roughness={0.4} />
      </RoundedBox>

      {/* Front bumper */}
      <RoundedBox args={[1.3, 0.14, 0.18]} radius={0.04} position={[0, 0.22, 1.15]} castShadow>
        <meshStandardMaterial color="#1f2220" />
      </RoundedBox>

      {/* Headlights */}
      <RoundedBox args={[0.2, 0.12, 0.05]} radius={0.02} position={[-0.42, 0.46, 1.11]}>
        <meshStandardMaterial color="#fff4cc" emissive="#ffe680" emissiveIntensity={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.12, 0.05]} radius={0.02} position={[0.42, 0.46, 1.11]}>
        <meshStandardMaterial color="#fff4cc" emissive="#ffe680" emissiveIntensity={0.6} />
      </RoundedBox>

      {/* Rear body panel & bag well */}
      <RoundedBox args={[1.22, 0.38, 0.8]} radius={0.08} position={[0, 0.48, -0.72]} castShadow receiveShadow>
        <meshStandardMaterial color="#f4f4f2" roughness={0.4} />
      </RoundedBox>

      {/* Floorboard mat */}
      <RoundedBox args={[1.16, 0.08, 0.85]} radius={0.03} position={[0, 0.32, 0.02]}>
        <meshStandardMaterial color="#303532" roughness={0.9} />
      </RoundedBox>

      {/* Bench Seat Base */}
      <RoundedBox args={[1.1, 0.18, 0.52]} radius={0.06} position={[0, 0.48, -0.12]} castShadow>
        <meshStandardMaterial color="#5a4535" roughness={0.6} />
      </RoundedBox>

      {/* Bench Seat Backrest */}
      <RoundedBox args={[1.08, 0.26, 0.14]} radius={0.06} position={[0, 0.82, -0.36]} castShadow>
        <meshStandardMaterial color="#5a4535" roughness={0.6} />
      </RoundedBox>

      {/* Windshield lower frame & clear glass */}
      <RoundedBox args={[1.18, 0.04, 0.04]} radius={0.01} position={[0, 0.7, 0.35]}>
        <meshStandardMaterial color="#2b2f2c" />
      </RoundedBox>
      <RoundedBox
        args={[1.16, 0.48, 0.03]}
        radius={0.02}
        position={[0, 0.95, 0.32]}
        rotation={[-0.12, 0, 0]}
      >
        <meshStandardMaterial
          color="#c2e8f8"
          transparent
          opacity={0.4}
          roughness={0.1}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Canopy Posts */}
      {[
        [-0.56, 0.28],
        [0.56, 0.28],
        [-0.56, -0.68],
        [0.56, -0.68],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.12, z]}>
          <cylinderGeometry args={[0.022, 0.022, 0.95, 8]} />
          <meshStandardMaterial color="#2b2f2c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Canopy Roof */}
      <RoundedBox args={[1.48, 0.08, 2.05]} radius={0.05} position={[0, 1.58, -0.15]} castShadow>
        <meshStandardMaterial color="#d94f4f" roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[1.38, 0.03, 1.95]} radius={0.02} position={[0, 1.53, -0.15]}>
        <meshStandardMaterial color="#e0e0dc" />
      </RoundedBox>
    </group>
  );
}

const Cart = forwardRef<CartHandle, { keys: MutableRefObject<KeyState> }>(
  function Cart({ keys }, ref) {
    const group = useRef<THREE.Group>(null!);
    const speed = useRef(0);

    const driverTorso = useRef<THREE.Group>(null!);
    const driverLean = useRef(0);

    const steeringWheel = useRef<THREE.Group>(null!);
    const steerAngle = useRef(0);

    useImperativeHandle(ref, () => group.current);

    useFrame((_, delta) => {
      const g = group.current;
      if (!g) return;
      const k = keys.current;

      // Accelerate / decelerate
      if (k.forward) speed.current += ACCEL * delta;
      else if (k.back) speed.current -= ACCEL * delta;
      else {
        // Friction toward zero
        const sign = Math.sign(speed.current);
        speed.current -= sign * FRICTION * delta;
        if (Math.sign(speed.current) !== sign) speed.current = 0;
      }
      speed.current = THREE.MathUtils.clamp(speed.current, -MAX_SPEED * 0.5, MAX_SPEED);

      // Turning — scaled by speed
      const turnFactor = THREE.MathUtils.clamp(Math.abs(speed.current) / 2, 0, 1);
      if (k.left) g.rotation.y += TURN_SPEED * delta * turnFactor;
      if (k.right) g.rotation.y -= TURN_SPEED * delta * turnFactor;

      // Move forward along heading
      const forward = new THREE.Vector3(
        Math.sin(g.rotation.y),
        0,
        Math.cos(g.rotation.y)
      );
      g.position.addScaledVector(forward, speed.current * delta);

      // Gentle driving bob
      const t = performance.now() / 1000;
      const bob = Math.abs(speed.current) > 0.1 ? Math.sin(t * 10) * 0.02 : 0;
      g.position.y = bob;

      // 1. Steering wheel rotation with spring-back damping
      const targetSteer = (k.left ? 0.75 : 0) - (k.right ? 0.75 : 0);
      steerAngle.current = THREE.MathUtils.damp(steerAngle.current, targetSteer, 14, delta);
      if (steeringWheel.current) {
        steeringWheel.current.rotation.z = steerAngle.current;
      }

      // 2. Driver torso dynamic lean & turn into steering
      const targetLean = (k.left ? -0.14 : 0) + (k.right ? 0.14 : 0);
      driverLean.current = THREE.MathUtils.damp(driverLean.current, targetLean, 10, delta);
      if (driverTorso.current) {
        driverTorso.current.rotation.z = -driverLean.current;
        driverTorso.current.rotation.y = driverLean.current * 0.6;
      }
    });

    return (
      <group ref={group} position={[0, 0, 4]}>
        {/* Main Cart Structure */}
        <CartChassis />

        {/* 4 Static Blocky Wheels */}
        <group position={[-0.72, 0.27, 0.72]}>
          <WheelMesh />
        </group>
        <group position={[0.72, 0.27, 0.72]}>
          <WheelMesh />
        </group>
        <group position={[-0.72, 0.27, -0.72]}>
          <WheelMesh />
        </group>
        <group position={[0.72, 0.27, -0.72]}>
          <WheelMesh />
        </group>

        {/* Driver Figure in Left Seat */}
        <group position={[-0.28, 0.48, -0.08]}>
          {/* Sitting Legs (Navy Jeans) & White Golf Shoes */}
          <RoundedBox args={[0.16, 0.14, 0.38]} radius={0.04} position={[-0.09, 0.07, 0.2]}>
            <meshStandardMaterial color="#283d5a" />
          </RoundedBox>
          <RoundedBox args={[0.16, 0.14, 0.38]} radius={0.04} position={[0.09, 0.07, 0.2]}>
            <meshStandardMaterial color="#283d5a" />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.28, 0.14]} radius={0.04} position={[-0.09, -0.12, 0.36]}>
            <meshStandardMaterial color="#283d5a" />
          </RoundedBox>
          <RoundedBox args={[0.14, 0.28, 0.14]} radius={0.04} position={[0.09, -0.12, 0.36]}>
            <meshStandardMaterial color="#283d5a" />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.1, 0.2]} radius={0.03} position={[-0.09, -0.22, 0.4]}>
            <meshStandardMaterial color="#f0f0f0" />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.1, 0.2]} radius={0.03} position={[0.09, -0.22, 0.4]}>
            <meshStandardMaterial color="#f0f0f0" />
          </RoundedBox>

          {/* Dynamic Torso (Polo, Head, Golf Cap, Arms reaching to steering wheel) */}
          <group ref={driverTorso} position={[0, 0.14, 0]}>
            {/* Polo shirt body */}
            <RoundedBox args={[0.38, 0.44, 0.26]} radius={0.07} position={[0, 0.22, 0]} castShadow>
              <meshStandardMaterial color="#f8f9fa" />
            </RoundedBox>
            {/* Polo collar band accent */}
            <RoundedBox args={[0.26, 0.06, 0.27]} radius={0.02} position={[0, 0.42, 0]}>
              <meshStandardMaterial color="#3ddc84" />
            </RoundedBox>

            {/* Blocky Head (No face) */}
            <RoundedBox args={[0.28, 0.28, 0.28]} radius={0.05} position={[0, 0.58, 0]} castShadow>
              <meshStandardMaterial color="#f5c6a5" />
            </RoundedBox>

            {/* Golf Cap */}
            <RoundedBox args={[0.3, 0.1, 0.3]} radius={0.04} position={[0, 0.74, 0]} castShadow>
              <meshStandardMaterial color="#f8f9fa" />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.03, 0.16]} radius={0.02} position={[0, 0.71, 0.19]} castShadow>
              <meshStandardMaterial color="#f8f9fa" />
            </RoundedBox>

            {/* Left Arm reaching forward */}
            <RoundedBox
              args={[0.11, 0.24, 0.11]}
              radius={0.03}
              position={[-0.24, 0.24, 0.06]}
              rotation={[0.6, 0, 0.2]}
            >
              <meshStandardMaterial color="#f8f9fa" />
            </RoundedBox>
            <RoundedBox
              args={[0.1, 0.22, 0.1]}
              radius={0.03}
              position={[-0.18, 0.18, 0.24]}
              rotation={[1.1, -0.3, 0.4]}
            >
              <meshStandardMaterial color="#f5c6a5" />
            </RoundedBox>

            {/* Right Arm reaching forward */}
            <RoundedBox
              args={[0.11, 0.24, 0.11]}
              radius={0.03}
              position={[0.24, 0.24, 0.06]}
              rotation={[0.6, 0, -0.2]}
            >
              <meshStandardMaterial color="#f8f9fa" />
            </RoundedBox>
            <RoundedBox
              args={[0.1, 0.22, 0.1]}
              radius={0.03}
              position={[0.18, 0.18, 0.24]}
              rotation={[1.1, 0.3, -0.4]}
            >
              <meshStandardMaterial color="#f5c6a5" />
            </RoundedBox>
          </group>
        </group>

        {/* Steering Assembly in Front of Driver */}
        <group position={[-0.28, 0.48, 0.22]}>
          {/* Steering column shaft */}
          <mesh position={[0, 0.14, -0.06]} rotation={[-0.65, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
            <meshStandardMaterial color="#222623" />
          </mesh>

          {/* Dynamic Rotating Steering Wheel */}
          <group ref={steeringWheel} position={[0, 0.28, -0.18]} rotation={[-0.65, 0, 0]}>
            <RoundedBox args={[0.3, 0.3, 0.04]} radius={0.08}>
              <meshStandardMaterial color="#1f2220" />
            </RoundedBox>
            <RoundedBox args={[0.12, 0.12, 0.05]} radius={0.02}>
              <meshStandardMaterial color="#ffb000" />
            </RoundedBox>
          </group>
        </group>

        {/* Golf Bag with Clubs in the Rear Basket */}
        <GolfBag />
      </group>
    );
  }
);

export default Cart;

