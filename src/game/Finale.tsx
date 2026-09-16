import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

const FINALE_POS: [number, number, number] = [0, 0.006, -96];
const CONFETTI_COUNT = 90;

const CONFETTI_COLORS = [
  "#ffb000", // Amber
  "#3ddc84", // Green
  "#ff5c5c", // Coral red
  "#4db5ff", // Sky blue
  "#ffffff", // White
  "#ffd700", // Gold
];

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vz: number;
  fallSpeed: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  driftPhase: number;
}

/** Checkered Landing Pad constructed with standard R3F primitives */
function CheckeredLandingPad() {
  const segments = 16;
  const angleStep = (Math.PI * 2) / segments;

  const sectorAngles = useMemo(() => {
    return Array.from({ length: segments }, (_, i) => i * angleStep);
  }, [segments, angleStep]);

  return (
    <group position={FINALE_POS}>
      {/* 1. Outer Golden Curb Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <ringGeometry args={[6.7, 7.1, 48]} />
        <meshStandardMaterial color="#ffb000" roughness={0.35} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Outer Checkered Track (Radius 4.2 to 6.7) */}
      {sectorAngles.map((theta, i) => (
        <mesh
          key={`outer-sector-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.003, 0]}
          receiveShadow
        >
          <ringGeometry args={[4.2, 6.7, 4, 1, theta, angleStep]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#131f17" : "#ede4cf"}
            roughness={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 3. Inner Checkered Track (Radius 2.0 to 4.2) with staggered offset */}
      {sectorAngles.map((theta, i) => (
        <mesh
          key={`inner-sector-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.004, 0]}
          receiveShadow
        >
          <ringGeometry args={[2.0, 4.2, 4, 1, theta, angleStep]} />
          <meshStandardMaterial
            color={i % 2 === 1 ? "#131f17" : "#ede4cf"}
            roughness={0.88}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 4. Center 18th Hole Green */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[2.0, 36]} />
        <meshStandardMaterial color="#29753e" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 5. Championship Cup Hole & Brass Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <circleGeometry args={[0.26, 24]} />
        <meshBasicMaterial color="#080a09" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[0.24, 0.3, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 6. Grand 18th Hole Flagpole & Pennant */}
      <group position={[0, 0, 0]}>
        {/* Brass Flagpole Base */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.2, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Flagpole Shaft */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 3.4, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* Golden Ball Top Finial */}
        <mesh position={[0, 3.55, 0]} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Golden Pennant Flag */}
        <group position={[0.42, 3.1, 0]} rotation={[0, 0, 0]}>
          <RoundedBox args={[0.82, 0.56, 0.04]} radius={0.015} castShadow>
            <meshStandardMaterial color="#ffb000" roughness={0.4} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.026]}
            fontSize={0.26}
            color="#0a0d0b"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            18
          </Text>
          <Text
            position={[0, 0, -0.026]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.26}
            color="#0a0d0b"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            18
          </Text>
        </group>
      </group>

      {/* 7. Perimeter Course Bollards */}
      {Array.from({ length: 8 }, (_, i) => {
        const rad = (i * Math.PI) / 4;
        const bx = Math.cos(rad) * 6.9;
        const bz = Math.sin(rad) * 6.9;
        return (
          <group key={`bollard-${i}`} position={[bx, 0, bz]}>
            <RoundedBox args={[0.22, 0.35, 0.22]} radius={0.04} position={[0, 0.175, 0]} castShadow>
              <meshStandardMaterial color="#50565b" roughness={0.9} />
            </RoundedBox>
            <mesh position={[0, 0.38, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color="#ffb000"
                emissive="#ffb000"
                emissiveIntensity={0.6}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function createInitialParticles(): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const s1 = Math.sin(i * 99.1 + 1.2) * 10000;
    const r1 = s1 - Math.floor(s1);
    const s2 = Math.sin(i * 33.7 + 5.8) * 10000;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 71.3 + 9.4) * 10000;
    const r3 = s3 - Math.floor(s3);
    const s4 = Math.sin(i * 13.9 + 2.1) * 10000;
    const r4 = s4 - Math.floor(s4);

    const angle = r1 * Math.PI * 2;
    // Uniform radial distribution centered directly on FINALE_POS
    const r = Math.sqrt(r2) * 6.2;
    list.push({
      x: FINALE_POS[0] + Math.cos(angle) * r,
      y: 2 + r3 * 10,
      z: FINALE_POS[2] + Math.sin(angle) * r,
      vx: (r4 - 0.5) * 0.4,
      vz: (r1 - 0.5) * 0.4,
      fallSpeed: 1.8 + r2 * 2.2,
      rotX: r3 * Math.PI * 2,
      rotY: r4 * Math.PI * 2,
      rotZ: r1 * Math.PI * 2,
      rotSpeedX: 1.5 + r2 * 3,
      rotSpeedY: 1.5 + r3 * 3,
      rotSpeedZ: 1.2 + r4 * 2.5,
      driftPhase: r1 * Math.PI * 2,
    });
  }
  return list;
}

const STATIC_PARTICLES = createInitialParticles();

/** Performant blocky confetti particle effect centered precisely on the landing pad */
function ConfettiEffect({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useRef<Particle[]>(STATIC_PARTICLES.map((p) => ({ ...p })));

  useEffect(() => {
    if (!meshRef.current) return;
    const colorObj = new THREE.Color();
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const colorHex = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      colorObj.set(colorHex);
      meshRef.current.setColorAt(i, colorObj);
    }
    meshRef.current.instanceColor!.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return;
    const dt = Math.min(delta, 0.05);

    const pList = particles.current;
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const p = pList[i];
      p.y -= p.fallSpeed * dt;
      p.rotX += p.rotSpeedX * dt;
      p.rotY += p.rotSpeedY * dt;
      p.rotZ += p.rotSpeedZ * dt;
      p.driftPhase += dt * 2;

      // Soft sinusoidal drift
      const currentX = p.x + Math.sin(p.driftPhase) * 0.25;
      const currentZ = p.z + Math.cos(p.driftPhase) * 0.25;

      // Wrap back to top, always centered directly on the middle of the circular landing pad
      if (p.y < 0.05) {
        p.y = 9 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 6.2;
        p.x = FINALE_POS[0] + Math.cos(angle) * r;
        p.z = FINALE_POS[2] + Math.sin(angle) * r;
      }

      dummy.position.set(currentX, p.y, currentZ);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, CONFETTI_COUNT]}
      castShadow
    >
      <boxGeometry args={[0.22, 0.22, 0.05]} />
      <meshStandardMaterial roughness={0.4} metalness={0.2} />
    </instancedMesh>
  );
}

export default memo(function Finale({
  active = false,
}: {
  active?: boolean;
}) {
  return (
    <group>
      {/* Visual Checkered Runway & 18th Hole Green */}
      <CheckeredLandingPad />

      {/* Joyful Blocky Confetti Shower centered directly in the middle of the landing pad */}
      <ConfettiEffect active={active} />
    </group>
  );
});
