import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { MutableRefObject, RefObject } from "react";
import type { KeyState } from "./useKeyboard";
import { nearbyObstacles } from "./terrain";

const MAX_SPEED = 7.5;
const ACCEL = 9;
const BRAKE_DECEL = 22;
const FRICTION = 6;
const TURN_SPEED = 2.4;
const CART_RADIUS = 0.55;

export type CartHandle = THREE.Group;

/** Circular low-poly golf cart wheel (black rubber tire, mid-grey rim outline, dark grey core) */
function WheelMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Circular black rubber tire */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
        <meshStandardMaterial color="#181a18" roughness={0.8} />
      </mesh>

      {/* Circular mid-grey rim outline */}
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.142, 24]} />
        <meshStandardMaterial color="#8a909a" metalness={0.25} roughness={0.35} />
      </mesh>

      {/* Dark grey inner rim core */}
      <mesh>
        <cylinderGeometry args={[0.118, 0.118, 0.144, 24]} />
        <meshStandardMaterial color="#282c30" metalness={0.2} roughness={0.55} />
      </mesh>

      {/* Center axle lug cap */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.146, 12]} />
        <meshStandardMaterial color="#181a18" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Scaled low-poly golf bag resting securely against the rear seat bulkhead & bed floor */
function GolfBag() {
  return (
    <group position={[-0.16, 0.24, -0.48]} rotation={[-0.18, 0, 0]}>
      {/* Main Bag Body */}
      <RoundedBox args={[0.22, 0.46, 0.22]} radius={0.06} position={[0, 0.23, 0]} castShadow>
        <meshStandardMaterial color="#2d5038" roughness={0.7} />
      </RoundedBox>
      {/* Leather collar trim */}
      <RoundedBox args={[0.24, 0.05, 0.24]} radius={0.02} position={[0, 0.44, 0]}>
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} />
      </RoundedBox>
      {/* Side zippered pocket */}
      <RoundedBox args={[0.08, 0.18, 0.16]} radius={0.02} position={[0.12, 0.18, 0]}>
        <meshStandardMaterial color="#24422e" roughness={0.7} />
      </RoundedBox>
      {/* Carrying strap */}
      <RoundedBox
        args={[0.03, 0.28, 0.04]}
        radius={0.01}
        position={[-0.1, 0.23, 0]}
        rotation={[0, 0, 0.1]}
      >
        <meshStandardMaterial color="#8b5a2b" />
      </RoundedBox>

      {/* Mounting Bracket / Clamp to Seat Bulkhead */}
      <RoundedBox args={[0.26, 0.03, 0.08]} radius={0.008} position={[0, 0.28, 0.11]}>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.02, 0.03]} radius={0.005} position={[0, 0.285, 0.11]}>
        <meshStandardMaterial color="#8b5a2b" />
      </RoundedBox>

      {/* Club 1: Driver with red protective head cover */}
      <mesh position={[-0.04, 0.58, 0.02]} rotation={[0.1, 0, -0.15]}>
        <cylinderGeometry args={[0.006, 0.006, 0.32, 6]} />
        <meshStandardMaterial color="#c0c4cc" metalness={0.5} />
      </mesh>
      <RoundedBox
        args={[0.06, 0.05, 0.08]}
        radius={0.02}
        position={[-0.06, 0.72, 0.03]}
        rotation={[0.2, 0.4, 0]}
        castShadow
      >
        <meshStandardMaterial color="#d94f4f" />
      </RoundedBox>

      {/* Club 2: Long Iron */}
      <mesh position={[0.03, 0.56, -0.03]} rotation={[-0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.05, 0.03, 0.06]}
        radius={0.01}
        position={[0.05, 0.68, -0.05]}
        rotation={[-0.3, -0.2, 0.2]}
      >
        <meshStandardMaterial color="#b8bcc4" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Club 3: Wedge */}
      <mesh position={[-0.02, 0.54, -0.04]} rotation={[-0.2, 0, -0.08]}>
        <cylinderGeometry args={[0.006, 0.006, 0.25, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.05, 0.03, 0.06]}
        radius={0.01}
        position={[-0.03, 0.65, -0.06]}
        rotation={[-0.4, 0.1, -0.1]}
      >
        <meshStandardMaterial color="#b8bcc4" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Club 4: Putter */}
      <mesh position={[0.04, 0.52, 0.04]} rotation={[0.15, 0, 0.12]}>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
        <meshStandardMaterial color="#d0d4dc" metalness={0.6} />
      </mesh>
      <RoundedBox
        args={[0.04, 0.025, 0.07]}
        radius={0.01}
        position={[0.05, 0.61, 0.05]}
        rotation={[0.1, -0.4, 0.1]}
      >
        <meshStandardMaterial color="#303438" />
      </RoundedBox>
    </group>
  );
}

/** High-contrast, distinctly legible blocky driver figure seated in the driver's seat */
function DriverFigure({ torsoRef }: { torsoRef: RefObject<THREE.Group | null> }) {
  return (
    <group position={[0.19, 0.38, -0.1]}>
      {/* Sitting Legs (Dark Indigo Denim Jeans) & White Golf Shoes */}
      <RoundedBox args={[0.13, 0.1, 0.3]} radius={0.03} position={[-0.07, 0.06, 0.16]}>
        <meshStandardMaterial color="#1e3a8a" />
      </RoundedBox>
      <RoundedBox args={[0.13, 0.1, 0.3]} radius={0.03} position={[0.07, 0.06, 0.16]}>
        <meshStandardMaterial color="#1e3a8a" />
      </RoundedBox>
      <RoundedBox args={[0.11, 0.18, 0.11]} radius={0.03} position={[-0.07, -0.08, 0.28]}>
        <meshStandardMaterial color="#1e3a8a" />
      </RoundedBox>
      <RoundedBox args={[0.11, 0.18, 0.11]} radius={0.03} position={[0.07, -0.08, 0.28]}>
        <meshStandardMaterial color="#1e3a8a" />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.07, 0.16]} radius={0.02} position={[-0.07, -0.16, 0.31]}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.07, 0.16]} radius={0.02} position={[0.07, -0.16, 0.31]}>
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>

      {/* Dynamic Torso (Royal Blue Polo, Warm Skin Head, Forest Green Golf Cap) */}
      <group ref={torsoRef} position={[0, 0.12, 0]}>
        {/* Royal Blue Polo Shirt Body */}
        <RoundedBox args={[0.28, 0.3, 0.2]} radius={0.05} position={[0, 0.16, 0]} castShadow>
          <meshStandardMaterial color="#2563eb" />
        </RoundedBox>
        {/* White Polo Collar Accent */}
        <RoundedBox args={[0.2, 0.04, 0.21]} radius={0.01} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>

        {/* Warm Skin-Tone Head */}
        <RoundedBox args={[0.2, 0.2, 0.2]} radius={0.04} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color="#f5c6a5" />
        </RoundedBox>

        {/* Forest Green Golf Cap & White Visor */}
        <RoundedBox args={[0.22, 0.07, 0.22]} radius={0.03} position={[0, 0.52, 0]} castShadow>
          <meshStandardMaterial color="#1b5e20" />
        </RoundedBox>
        <RoundedBox args={[0.22, 0.02, 0.12]} radius={0.01} position={[0, 0.5, 0.13]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>

        {/* Left Arm gripping steering wheel */}
        <RoundedBox
          args={[0.08, 0.2, 0.08]}
          radius={0.02}
          position={[-0.18, 0.16, 0.04]}
          rotation={[0.6, 0, 0.18]}
        >
          <meshStandardMaterial color="#2563eb" />
        </RoundedBox>
        <RoundedBox
          args={[0.07, 0.18, 0.07]}
          radius={0.02}
          position={[-0.12, 0.13, 0.16]}
          rotation={[1.1, -0.25, 0.35]}
        >
          <meshStandardMaterial color="#f5c6a5" />
        </RoundedBox>

        {/* Right Arm gripping steering wheel */}
        <RoundedBox
          args={[0.08, 0.2, 0.08]}
          radius={0.02}
          position={[0.18, 0.16, 0.04]}
          rotation={[0.6, 0, -0.18]}
        >
          <meshStandardMaterial color="#2563eb" />
        </RoundedBox>
        <RoundedBox
          args={[0.07, 0.18, 0.07]}
          radius={0.02}
          position={[0.12, 0.13, 0.16]}
          rotation={[1.1, 0.25, -0.35]}
        >
          <meshStandardMaterial color="#f5c6a5" />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Complete Unified Golf Cart Body Chassis: with 4 open wheel-well notches */
function CartChassis() {
  return (
    <group>
      {/* 1. Lower Chassis & Underbody (Split into sections so wheels have open notches with no overlapping geometry) */}
      {/* Central spine spanning length between wheels */}
      <RoundedBox args={[0.64, 0.12, 1.88]} radius={0.03} position={[0, 0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e2220" roughness={0.8} />
      </RoundedBox>
      {/* Middle chassis width between front and rear wheels */}
      <RoundedBox args={[0.82, 0.12, 0.68]} radius={0.03} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#1e2220" />
      </RoundedBox>
      {/* Front underbody ahead of front wheels */}
      <RoundedBox args={[0.84, 0.12, 0.14]} radius={0.03} position={[0, 0.18, 0.87]}>
        <meshStandardMaterial color="#1e2220" />
      </RoundedBox>
      {/* Rear underbody behind rear wheels */}
      <RoundedBox args={[0.84, 0.12, 0.14]} radius={0.03} position={[0, 0.18, -0.87]}>
        <meshStandardMaterial color="#1e2220" />
      </RoundedBox>

      {/* Front Axle Bar connecting the front two wheels through the chassis */}
      <mesh position={[0, 0.22, 0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.86, 12]} />
        <meshStandardMaterial color="#282c30" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Front Axle Hub Collars */}
      {[-0.34, 0.34].map((hx, hi) => (
        <mesh key={`front-axle-collar-${hi}`} position={[hx, 0.22, 0.58]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.04, 12]} />
          <meshStandardMaterial color="#181a18" roughness={0.8} />
        </mesh>
      ))}

      {/* Rear Axle Bar connecting the rear two wheels through the chassis */}
      <mesh position={[0, 0.22, -0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, 0.86, 12]} />
        <meshStandardMaterial color="#282c30" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Rear Axle Hub Collars */}
      {[-0.34, 0.34].map((hx, hi) => (
        <mesh key={`rear-axle-collar-${hi}`} position={[hx, 0.22, -0.58]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.04, 12]} />
          <meshStandardMaterial color="#181a18" roughness={0.8} />
        </mesh>
      ))}

      {/* Side Rocker Sill Trims */}
      <RoundedBox args={[0.86, 0.06, 0.64]} radius={0.02} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#1e2220" />
      </RoundedBox>

      {/* Floorboard Mat */}
      <RoundedBox args={[0.76, 0.04, 0.58]} radius={0.02} position={[0, 0.25, 0.02]}>
        <meshStandardMaterial color="#2c3033" roughness={0.9} />
      </RoundedBox>

      {/* 2. Sculpted Front Body with Cutouts for Front Wheels */}
      {/* Central Hood Core (Width 0.64 between front wheel notches) */}
      <RoundedBox args={[0.64, 0.3, 0.7]} radius={0.03} position={[0, 0.34, 0.56]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Front Nose Bulkhead (Full width 0.84 ahead of front wheels) */}
      <RoundedBox args={[0.84, 0.3, 0.12]} radius={0.03} position={[0, 0.34, 0.85]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Rear Firewall Bulkhead (Full width 0.84 behind front wheels) */}
      <RoundedBox args={[0.84, 0.3, 0.14]} radius={0.03} position={[0, 0.34, 0.28]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Unified Flat Hood Top Plate (Seamless, flat creamy white surface spanning full width 0.84 and length 0.70) */}
      <RoundedBox args={[0.84, 0.06, 0.7]} radius={0.02} position={[0, 0.5, 0.56]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Curved Interior Fender Arches for Front Wheels */}
      {[-0.37, 0.37].map((fx, fi) => (
        <group key={`front-curved-fender-${fi}`}>
          {/* Smooth Circular Fender Arch Shell contouring the wheel */}
          <mesh
            position={[fx, 0.22, 0.58]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.255, 0.255, 0.1, 32, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#FFF8DC" side={THREE.DoubleSide} roughness={0.4} />
          </mesh>

          {/* Solid Top-Front Outer Corner Fillet */}
          <RoundedBox
            args={[0.1, 0.08, 0.1]}
            radius={0.02}
            position={[fx, 0.45, 0.77]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
          </RoundedBox>

          {/* Solid Top-Rear Outer Corner Fillet */}
          <RoundedBox
            args={[0.1, 0.08, 0.1]}
            radius={0.02}
            position={[fx, 0.45, 0.39]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
          </RoundedBox>

          {/* Dark Inner Wheel Well Wall Disc */}
          <mesh
            position={[fx > 0 ? 0.322 : -0.322, 0.22, 0.58]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <circleGeometry args={[0.254, 32, 0, Math.PI]} />
            <meshStandardMaterial color="#141816" side={THREE.DoubleSide} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Defined Front Grille Panel */}
      <RoundedBox args={[0.34, 0.16, 0.04]} radius={0.015} position={[0, 0.34, 0.91]}>
        <meshStandardMaterial color="#141816" roughness={0.9} />
      </RoundedBox>
      {/* Grille Horizontal Slatted Louvers */}
      {[-0.04, 0, 0.04].map((gy, gi) => (
        <RoundedBox
          key={`grille-slat-${gi}`}
          args={[0.3, 0.015, 0.02]}
          radius={0.004}
          position={[0, 0.34 + gy, 0.925]}
        >
          <meshStandardMaterial color="#282c2a" />
        </RoundedBox>
      ))}
      {/* Centered Metallic Grille Emblem */}
      <RoundedBox args={[0.06, 0.04, 0.025]} radius={0.008} position={[0, 0.34, 0.93]}>
        <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Separated 3D Headlamp Housings (Bucket + Glowing Lens + Turn Signal) */}
      {[-0.28, 0.28].map((lx, li) => (
        <group key={`headlamp-${li}`} position={[lx, 0.36, 0.9]}>
          <RoundedBox args={[0.16, 0.11, 0.06]} radius={0.025}>
            <meshStandardMaterial color="#1e2220" />
          </RoundedBox>
          <RoundedBox args={[0.1, 0.07, 0.02]} radius={0.015} position={[0, 0, 0.03]}>
            <meshStandardMaterial color="#fff8d0" emissive="#ffe680" emissiveIntensity={0.85} />
          </RoundedBox>
          <RoundedBox
            args={[0.03, 0.07, 0.02]}
            radius={0.005}
            position={[lx > 0 ? 0.065 : -0.065, 0, 0.03]}
          >
            <meshStandardMaterial color="#ff9900" emissive="#ff8800" emissiveIntensity={0.8} />
          </RoundedBox>
        </group>
      ))}

      {/* Slim Front Bumper System */}
      <RoundedBox args={[0.76, 0.05, 0.05]} radius={0.015} position={[0, 0.18, 0.92]} castShadow>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.015, 0.025]} radius={0.004} position={[0, 0.21, 0.92]}>
        <meshStandardMaterial color="#141816" />
      </RoundedBox>

      {/* Middle Body / Seat Base Pedestal */}
      <RoundedBox args={[0.82, 0.24, 0.42]} radius={0.04} position={[0, 0.3, -0.16]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Seat Backrest Bulkhead & Roll-Bar Partition */}
      <RoundedBox args={[0.78, 0.26, 0.06]} radius={0.02} position={[0, 0.52, -0.34]} castShadow>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>

      {/* 3. Luxury Saddle-Tan / Cognac Accent Leather Interior */}
      {/* Driver Seat (Left) */}
      <RoundedBox args={[0.34, 0.12, 0.38]} radius={0.04} position={[-0.19, 0.38, -0.1]} castShadow>
        <meshStandardMaterial color="#ba7036" roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.24, 0.08]} radius={0.04} position={[-0.19, 0.64, -0.28]} castShadow>
        <meshStandardMaterial color="#ba7036" roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.2, 0.015]} radius={0.005} position={[-0.19, 0.64, -0.235]}>
        <meshStandardMaterial color="#9e5924" />
      </RoundedBox>

      {/* Passenger Seat (Right) */}
      <RoundedBox args={[0.34, 0.12, 0.38]} radius={0.04} position={[0.19, 0.38, -0.1]} castShadow>
        <meshStandardMaterial color="#ba7036" roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.24, 0.08]} radius={0.04} position={[0.19, 0.64, -0.28]} castShadow>
        <meshStandardMaterial color="#ba7036" roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.2, 0.015]} radius={0.005} position={[0.19, 0.64, -0.235]}>
        <meshStandardMaterial color="#9e5924" />
      </RoundedBox>

      {/* Compact Dashboard Block */}
      <RoundedBox args={[0.76, 0.14, 0.14]} radius={0.03} position={[0, 0.45, 0.22]}>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.025, 0.1]} radius={0.01} position={[0, 0.525, 0.21]}>
        <meshStandardMaterial color="#1a1d20" />
      </RoundedBox>


      {/* 4. Open Black Rear Utility Bed (Golf Cart Cargo Bed) */}
      <RoundedBox args={[0.68, 0.04, 0.5]} radius={0.015} position={[0, 0.24, -0.62]} receiveShadow>
        <meshStandardMaterial color="#181a18" roughness={0.9} />
      </RoundedBox>
      {[-0.45, -0.57, -0.69, -0.81].map((rz, ri) => (
        <RoundedBox
          key={`bed-rib-${ri}`}
          args={[0.62, 0.015, 0.025]}
          radius={0.005}
          position={[0, 0.265, rz]}
        >
          <meshStandardMaterial color="#242826" />
        </RoundedBox>
      ))}

      {/* Bed Walls (Matching Hood Color #FFF8DC) */}
      <RoundedBox args={[0.68, 0.16, 0.04]} radius={0.01} position={[0, 0.33, -0.37]} castShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.16, 0.5]} radius={0.01} position={[-0.34, 0.32, -0.62]} castShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.16, 0.5]} radius={0.01} position={[0.34, 0.32, -0.62]} castShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      {/* Back Border Plate (Parallel and aligned with the black bottom region) */}
      <RoundedBox args={[0.68, 0.14, 0.04]} radius={0.01} position={[0, 0.31, -0.87]} castShadow>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>

      {/* Bed Rails (Matching Hood Color #FFF8DC) & Flush Rear Bumper */}
      <RoundedBox args={[0.03, 0.025, 0.5]} radius={0.006} position={[-0.34, 0.405, -0.62]}>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.03, 0.025, 0.5]} radius={0.006} position={[0.34, 0.405, -0.62]}>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.025, 0.03]} radius={0.006} position={[0, 0.385, -0.87]}>
        <meshStandardMaterial color="#FFF8DC" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.66, 0.05, 0.045]} radius={0.015} position={[0, 0.18, -0.9]} castShadow>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>

      {/* Rear Taillight Assemblies on rear bed corners */}
      {[-0.34, 0.34].map((tx, ti) => (
        <group key={`taillight-${ti}`} position={[tx, 0.31, -0.89]}>
          <RoundedBox args={[0.06, 0.06, 0.015]} radius={0.006}>
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
          <RoundedBox args={[0.048, 0.045, 0.015]} radius={0.005} position={[0, 0, -0.005]}>
            <meshStandardMaterial color="#ff2a2a" emissive="#ff1515" emissiveIntensity={0.9} />
          </RoundedBox>
          <RoundedBox args={[0.048, 0.014, 0.016]} radius={0.003} position={[0, 0.015, -0.006]}>
            <meshStandardMaterial color="#ff9900" emissive="#ff8800" emissiveIntensity={0.8} />
          </RoundedBox>
        </group>
      ))}

      {/* 5. Raked Windshield & Grounded Canopy Roof (Continuous Rake, 4 Solid Bracing Posts) */}
      {/* Raked Windshield (Seamless joint to roof at y=1.00) */}
      <group position={[0, 0.54, 0.24]} rotation={[-0.16, 0, 0]}>
        <RoundedBox args={[0.72, 0.03, 0.03]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#282c30" />
        </RoundedBox>
        <RoundedBox
          args={[0.68, 0.46, 0.02]}
          radius={0.015}
          position={[0, 0.23, 0]}
        >
          <meshStandardMaterial
            color="#c2e8f8"
            transparent
            opacity={0.35}
            roughness={0.1}
            depthWrite={false}
          />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.02, 0.025]} radius={0.005} position={[0, 0.23, 0]}>
          <meshStandardMaterial color="#282c30" />
        </RoundedBox>
        <RoundedBox args={[0.72, 0.03, 0.03]} radius={0.01} position={[0, 0.46, 0]}>
          <meshStandardMaterial color="#282c30" />
        </RoundedBox>
      </group>

      {/* 4 Sturdy Structural Support Posts (Consistent Solid Thickness) */}
      {/* Front A-Pillars flanking windshield (spaced wide at x=±0.34 for clear driver visibility) */}
      {[-0.34, 0.34].map((px, pi) => (
        <group key={`front-roof-post-${pi}`}>
          <RoundedBox args={[0.085, 0.04, 0.085]} radius={0.015} position={[px, 0.54, 0.24]}>
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
          <RoundedBox
            args={[0.065, 0.48, 0.065]}
            radius={0.015}
            position={[px, 0.77, 0.2]}
            rotation={[-0.16, 0, 0]}
          >
            <meshStandardMaterial color="#282c30" metalness={0.4} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.095, 0.03, 0.095]} radius={0.015} position={[px, 0.99, 0.16]}>
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
        </group>
      ))}

      {/* Rear B-Pillars anchored to seat bulkhead */}
      {[-0.34, 0.34].map((px, pi) => (
        <group key={`rear-roof-post-${pi}`}>
          <RoundedBox args={[0.085, 0.04, 0.085]} radius={0.015} position={[px, 0.52, -0.56]}>
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
          <RoundedBox args={[0.065, 0.48, 0.065]} radius={0.015} position={[px, 0.76, -0.56]}>
            <meshStandardMaterial color="#282c30" metalness={0.4} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.095, 0.03, 0.095]} radius={0.015} position={[px, 0.99, -0.56]}>
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
        </group>
      ))}

      {/* Compact Grounded Canopy Roof (Continuous pitch from windshield, no front overhang past bumper) */}
      <group position={[0, 1.0, -0.29]} rotation={[-0.04, 0, 0]}>
        {/* Tier 1: Underside Fascia Trim (Length 0.98, front edge ends neatly at z=+0.20 over windshield header) */}
        <RoundedBox args={[0.86, 0.025, 0.98]} radius={0.015} position={[0, 0.012, 0]} castShadow>
          <meshStandardMaterial color="#1f2224" roughness={0.5} />
        </RoundedBox>
        {/* Tier 2: Main Solid Roof Slab */}
        <RoundedBox args={[0.84, 0.045, 0.96]} radius={0.025} position={[0, 0.04, 0]} castShadow>
          <meshStandardMaterial color="#282c30" roughness={0.4} />
        </RoundedBox>
        {/* Tier 3: Centered Aerodynamic Roof Crown */}
        <RoundedBox args={[0.66, 0.025, 0.84]} radius={0.02} position={[0, 0.07, 0]}>
          <meshStandardMaterial color="#34393f" roughness={0.35} />
        </RoundedBox>
        {/* Roof Longitudinal Accent Ribs */}
        {[-0.31, 0.31].map((rx, ri) => (
          <RoundedBox
            key={`roof-rib-${ri}`}
            args={[0.025, 0.015, 0.86]}
            radius={0.005}
            position={[rx, 0.07, 0]}
          >
            <meshStandardMaterial color="#1f2224" />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

const Cart = forwardRef<CartHandle, { keys: MutableRefObject<KeyState> }>(
  function Cart({ keys }, ref) {
    const group = useRef<THREE.Group>(null!);
    const speed = useRef(0);

    // Front wheel visual steering refs
    const wheelFL = useRef<THREE.Group>(null!);
    const wheelFR = useRef<THREE.Group>(null!);
    const wheelSteerAngle = useRef(0);

    // Steering wheel rotation ref
    const steeringWheel = useRef<THREE.Group>(null!);
    const steerAngle = useRef(0);

    // Driver torso lean ref
    const driverTorso = useRef<THREE.Group>(null!);
    const driverLean = useRef(0);

    // Reusable scratch vectors to eliminate GC allocation stutter in useFrame
    const forwardVec = useRef(new THREE.Vector3());
    const moveStepVec = useRef(new THREE.Vector3());

    useImperativeHandle(ref, () => group.current);

    useFrame((_, delta) => {
      const g = group.current;
      if (!g) return;
      const k = keys.current;

      const dt = THREE.MathUtils.clamp(delta, 0.001, 0.05);

      // Accelerate / decelerate / active brake
      if (k.forward && k.back) {
        const sign = Math.sign(speed.current);
        const deltaV = BRAKE_DECEL * dt;
        if (Math.abs(speed.current) <= deltaV) {
          speed.current = 0;
        } else {
          speed.current -= sign * deltaV;
        }
      } else if (k.forward) {
        speed.current += ACCEL * dt;
      } else if (k.back) {
        speed.current -= ACCEL * dt;
      } else {
        const sign = Math.sign(speed.current);
        speed.current -= sign * FRICTION * dt;
        if (Math.sign(speed.current) !== sign) speed.current = 0;
      }
      speed.current = THREE.MathUtils.clamp(speed.current, -MAX_SPEED * 0.5, MAX_SPEED);

      // Turning — scaled by speed, with reverse steering physics (S+D reverses right, S+A reverses left)
      const isReversing = speed.current < -0.05 || (k.back && !k.forward);
      const steerSign = isReversing ? -1 : 1;
      const turnFactor = THREE.MathUtils.clamp(Math.abs(speed.current) / 2, 0.4, 1);
      if (k.left) g.rotation.y += steerSign * TURN_SPEED * dt * turnFactor;
      if (k.right) g.rotation.y -= steerSign * TURN_SPEED * dt * turnFactor;

      // 1. Front wheel visual steering pivot (rotates around local Y-axis)
      const targetWheelSteer = (k.left ? 0.45 : 0) - (k.right ? 0.45 : 0);
      wheelSteerAngle.current = THREE.MathUtils.damp(wheelSteerAngle.current, targetWheelSteer, 14, dt);
      if (wheelFL.current) wheelFL.current.rotation.y = wheelSteerAngle.current;
      if (wheelFR.current) wheelFR.current.rotation.y = wheelSteerAngle.current;

      // 2. Dynamic rotating steering wheel with spring-back damping
      const targetSteer = (k.left ? 0.75 : 0) - (k.right ? 0.75 : 0);
      steerAngle.current = THREE.MathUtils.damp(steerAngle.current, targetSteer, 14, dt);
      if (steeringWheel.current) {
        steeringWheel.current.rotation.z = steerAngle.current;
      }

      // 3. Driver torso dynamic lean
      const targetLean = (k.left ? -0.12 : 0) + (k.right ? 0.12 : 0);
      driverLean.current = THREE.MathUtils.damp(driverLean.current, targetLean, 10, dt);
      if (driverTorso.current) {
        driverTorso.current.rotation.z = -driverLean.current;
        driverTorso.current.rotation.y = driverLean.current * 0.6;
      }

      // Move forward along heading with obstacle collision detection
      forwardVec.current.set(Math.sin(g.rotation.y), 0, Math.cos(g.rotation.y));

      if (Math.abs(speed.current) > 0.001) {
        moveStepVec.current.copy(forwardVec.current).multiplyScalar(speed.current * dt);
        const nextX = g.position.x + moveStepVec.current.x;
        const nextZ = g.position.z + moveStepVec.current.z;
        const obstacles = nearbyObstacles(g.position.x, g.position.z);

        const collidesAt = (px: number, pz: number) => {
          for (const obs of obstacles) {
            const dx = px - obs.x;
            const dz = pz - obs.z;
            if (dx * dx + dz * dz < (CART_RADIUS + obs.radius) ** 2) {
              return true;
            }
          }
          return false;
        };

        if (!collidesAt(nextX, nextZ)) {
          g.position.x = nextX;
          g.position.z = nextZ;
        } else if (!collidesAt(nextX, g.position.z)) {
          g.position.x = nextX;
          speed.current -= speed.current * 3 * dt;
        } else if (!collidesAt(g.position.x, nextZ)) {
          g.position.z = nextZ;
          speed.current -= speed.current * 3 * dt;
        } else {
          speed.current = 0;
        }
      }

      // Gentle driving bob with positive floor clearance above pavers and turf
      const t = performance.now() / 1000;
      const bob = Math.abs(speed.current) > 0.1 ? Math.abs(Math.sin(t * 10)) * 0.012 : 0;
      g.position.y = 0.012 + bob;
    });

    return (
      <group ref={group} position={[0, 0, 4]} rotation={[0, Math.PI, 0]}>
        {/* Main Consolidated Cart Structure with Multi-Tier Canopy */}
        <CartChassis />

        {/* 2 Front Steering Nested Wheels (Tucked flush inside sculpted fenders) */}
        <group ref={wheelFL} position={[-0.43, 0.22, 0.58]}>
          <WheelMesh />
        </group>
        <group ref={wheelFR} position={[0.43, 0.22, 0.58]}>
          <WheelMesh />
        </group>

        {/* 2 Rear Fixed Nested Wheels (Tucked flush inside sculpted fenders) */}
        <group position={[-0.43, 0.22, -0.58]}>
          <WheelMesh />
        </group>
        <group position={[0.43, 0.22, -0.58]}>
          <WheelMesh />
        </group>

        {/* Scaled Golf Bag Anchored in the Rear Basket */}
        <GolfBag />

        {/* Driver Figure in Left Seat */}
        <DriverFigure torsoRef={driverTorso} />

        {/* Steering Assembly in Front of Driver */}
        <group position={[0.19, 0.46, 0.2]}>
          {/* Steering column shaft */}
          <mesh position={[0, 0.12, -0.05]} rotation={[-0.65, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
            <meshStandardMaterial color="#222623" />
          </mesh>

          {/* Dynamic Rotating Circular Steering Wheel (Held by driver figure) */}
          <group ref={steeringWheel} position={[0, 0.24, -0.15]} rotation={[-0.65, 0, 0]}>
            {/* Circular outer grip rim */}
            <mesh castShadow>
              <torusGeometry args={[0.105, 0.016, 16, 32]} />
              <meshStandardMaterial color="#22262a" roughness={0.5} />
            </mesh>

            {/* Circular center hub */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.032, 0.032, 0.024, 16]} />
              <meshStandardMaterial color="#282c30" />
            </mesh>

            {/* Amber center horn button */}
            <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.026, 16]} />
              <meshStandardMaterial color="#ffb000" />
            </mesh>

            {/* 3 Metallic silver spokes */}
            {/* Lower vertical spoke */}
            <RoundedBox args={[0.016, 0.08, 0.012]} radius={0.004} position={[0, -0.055, 0]}>
              <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} />
            </RoundedBox>
            {/* Upper left spoke */}
            <RoundedBox
              args={[0.08, 0.016, 0.012]}
              radius={0.004}
              position={[-0.055, 0.02, 0]}
              rotation={[0, 0, -0.3]}
            >
              <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} />
            </RoundedBox>
            {/* Upper right spoke */}
            <RoundedBox
              args={[0.08, 0.016, 0.012]}
              radius={0.004}
              position={[0.055, 0.02, 0]}
              rotation={[0, 0, 0.3]}
            >
              <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} />
            </RoundedBox>
          </group>
        </group>
      </group>
    );
  }
);

export default Cart;
