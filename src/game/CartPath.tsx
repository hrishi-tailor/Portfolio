import { memo, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, Text, Billboard } from "@react-three/drei";

/** Control waypoints defining the continuous winding gravel trail passing alongside all 6 golf holes */
const PATH_WAYPOINTS: [number, number, number][] = [
  [0, 0.005, 4.2], // Starts at Cart Spawn Center with smooth flared driveway
  [0, 0.005, 2.0],
  [0, 0.005, 0.0], // Driveway flare smoothly narrows to standard trail width
  [0, 0.005, -2],
  [-0.8, 0.005, -6],
  [-1.6, 0.005, -10], // Passes Hole 1 (About Me at [-5.5, 0, -10])
  [-0.6, 0.005, -16],
  [1.0, 0.005, -20],
  [1.8, 0.005, -24], // Passes Hole 2 (Skills at [6.0, 0, -24])
  [0.8, 0.005, -30],
  [-1.0, 0.005, -34],
  [-1.8, 0.005, -38], // Passes Hole 3 (Project: Tailor Cards at [-6.0, 0, -38])
  [-0.8, 0.005, -44],
  [1.0, 0.005, -48],
  [1.8, 0.005, -52], // Passes Hole 4 (Exp: Founder at [6.0, 0, -52])
  [0.8, 0.005, -58],
  [-1.0, 0.005, -62],
  [-1.8, 0.005, -66], // Passes Hole 5 (Exp: Boswin at [-6.0, 0, -66])
  [-0.8, 0.005, -72],
  [1.0, 0.005, -76],
  [1.8, 0.005, -80], // Passes Hole 6 (Exp: Tutoring at [6.0, 0, -80])
  [0.5, 0.005, -85],
  [0.0, 0.005, -88], // Path turnaround
];

/** Golf Course Clubhouse & Pro Shop Pavilion */
function ClubhousePavilion() {
  return (
    <group position={[-6.2, 0, 4.2]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Main Clubhouse Building Body */}
      <RoundedBox args={[7.2, 2.6, 2.6]} radius={0.1} position={[0, 1.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#ede6d6" roughness={0.7} />
      </RoundedBox>

      {/* Stone Foundation Base */}
      <RoundedBox args={[7.4, 0.4, 2.8]} radius={0.06} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#6a7076" roughness={0.9} />
      </RoundedBox>

      {/* Clubhouse Gable Roof */}
      <group position={[0, 2.7, 0]}>
        <RoundedBox args={[7.6, 0.35, 3.2]} radius={0.08} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#2b4a36" roughness={0.5} />
        </RoundedBox>
        {/* Roof White Fascia Trim */}
        <RoundedBox args={[7.7, 0.12, 3.3]} radius={0.02} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </RoundedBox>
      </group>

      {/* GRAND ROOFTOP "WELCOME TO MY PORTFOLIO" SIGN (Mounted cleanly on roof ridge) */}
      <Billboard position={[0, 3.45, 0]}>
        <RoundedBox args={[5.2, 0.95, 0.08]} radius={0.06} castShadow>
          <meshStandardMaterial color="#1a2f22" roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[5.0, 0.82, 0.09]} radius={0.04} position={[0, 0, 0.005]}>
          <meshStandardMaterial color="#223e2c" roughness={0.6} />
        </RoundedBox>
        <Text
          position={[0, 0.16, 0.06]}
          fontSize={0.24}
          color="#ffb000"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ⛳ WELCOME TO MY PORTFOLIO ⛳
        </Text>
        <Text
          position={[0, -0.16, 0.06]}
          fontSize={0.14}
          color="#3ddc84"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HRISHI TAILOR • WATERLOO MATHEMATICS
        </Text>
      </Billboard>

      {/* Covered Cart Staging Awning Portico */}
      <RoundedBox args={[6.4, 0.15, 2.0]} radius={0.04} position={[0, 2.1, -1.8]} castShadow>
        <meshStandardMaterial color="#2b4a36" roughness={0.5} />
      </RoundedBox>
      {/* Timber Portico Posts */}
      {[-2.9, 2.9].map((px, pi) => (
        <RoundedBox key={`portico-post-${pi}`} args={[0.2, 2.1, 0.2]} radius={0.03} position={[px, 1.05, -2.6]} castShadow>
          <meshStandardMaterial color="#6a4425" roughness={0.7} />
        </RoundedBox>
      ))}

      {/* Double Entrance Glass Doors */}
      <RoundedBox args={[1.4, 1.8, 0.08]} radius={0.02} position={[0, 1.0, -1.32]}>
        <meshStandardMaterial color="#3a2516" />
      </RoundedBox>
      <RoundedBox args={[1.2, 1.6, 0.04]} radius={0.01} position={[0, 1.0, -1.35]}>
        <meshStandardMaterial color="#8ec5dc" roughness={0.2} metalness={0.4} />
      </RoundedBox>
      {/* Side Windows */}
      {[-2.2, 2.2].map((wx, wi) => (
        <RoundedBox key={`win-${wi}`} args={[1.3, 1.1, 0.06]} radius={0.02} position={[wx, 1.3, -1.32]}>
          <meshStandardMaterial color="#8ec5dc" roughness={0.2} metalness={0.4} />
        </RoundedBox>
      ))}

      {/* Overhead "PRO SHOP & 1ST TEE" Signboard */}
      <group position={[0, 2.35, -1.8]}>
        <RoundedBox args={[3.4, 0.45, 0.08]} radius={0.04} castShadow>
          <meshStandardMaterial color="#1a2f22" roughness={0.6} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.18}
          color="#ffb000"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ⛳ PRO SHOP • 1ST TEE
        </Text>
      </group>

      {/* Brass Clubhouse Clock */}
      <mesh position={[0, 2.8, -1.45]}>
        <circleGeometry args={[0.22, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.8, -1.44]}>
        <ringGeometry args={[0.2, 0.24, 20]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Hole #1 Starter Area, Scorecard Map & Ball Washer Console */
function StarterArea() {
  return (
    <group position={[0, 0, 7.8]}>
      {/* Elevated Championship Tee Box Mat */}
      <RoundedBox args={[3.4, 0.02, 2.0]} radius={0.04} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#36863d" roughness={0.85} />
      </RoundedBox>

      {/* Red, White, and Blue Golf Ball Tee Markers */}
      <mesh position={[-0.8, 0.05, 0.4]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#3b6ee8" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0.4]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0.8, 0.05, 0.4]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#e53935" roughness={0.3} />
      </mesh>

      {/* "HOLE 1 • PAR 4" Course Starter Board (Facing towards camera) */}
      <group position={[1.4, 0, -0.5]} rotation={[0, -0.2, 0]}>
        <RoundedBox args={[0.1, 1.4, 0.1]} radius={0.02} position={[0, 0.7, 0]} castShadow>
          <meshStandardMaterial color="#5a381d" />
        </RoundedBox>
        <RoundedBox args={[0.95, 0.65, 0.06]} radius={0.03} position={[0, 1.25, -0.04]} castShadow>
          <meshStandardMaterial color="#2d4a36" />
        </RoundedBox>
        <Text
          position={[0, 1.35, -0.08]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.12}
          color="#ffb000"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HOLE 1
        </Text>
        <Text
          position={[0, 1.16, -0.08]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.085}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          PAR 4 • 410 YDS
        </Text>
      </group>

      {/* Traditional Golf Ball Washer on Timber Post */}
      <group position={[-1.4, 0, -0.5]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[0.08, 1.1, 0.08]} radius={0.015} position={[0, 0.55, 0]} castShadow>
          <meshStandardMaterial color="#5a381d" />
        </RoundedBox>
        <RoundedBox args={[0.2, 0.28, 0.16]} radius={0.03} position={[0, 0.95, 0.06]} castShadow>
          <meshStandardMaterial color="#1f4e2b" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0.12, 1.0, 0.06]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} />
        </mesh>
        <RoundedBox args={[0.08, 0.24, 0.02]} radius={0.005} position={[-0.12, 0.85, 0.06]}>
          <meshStandardMaterial color="#f0eee6" />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Bag Drop Rack & Starter Bench Patio */
function BagDropArea() {
  return (
    <group position={[4.0, 0, 4.2]}>
      {/* Outer Crushed Stone Border Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <ringGeometry args={[1.4, 1.7, 24]} />
        <meshStandardMaterial color="#baa982" roughness={0.96} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Natural Gravel Patio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[1.4, 24]} />
        <meshStandardMaterial color="#e4dbbe" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Wooden Course Rest Bench */}
      <group position={[0, 0.007, 0.2]} rotation={[0, -0.4, 0]}>
        <RoundedBox args={[0.05, 0.24, 0.35]} radius={0.01} position={[-0.4, 0.12, 0]}>
          <meshStandardMaterial color="#22262a" />
        </RoundedBox>
        <RoundedBox args={[0.05, 0.24, 0.35]} radius={0.01} position={[0.4, 0.12, 0]}>
          <meshStandardMaterial color="#22262a" />
        </RoundedBox>
        <RoundedBox args={[0.95, 0.03, 0.35]} radius={0.008} position={[0, 0.24, 0]} castShadow>
          <meshStandardMaterial color="#8a572c" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.95, 0.22, 0.03]} radius={0.008} position={[0, 0.4, -0.16]} castShadow>
          <meshStandardMaterial color="#8a572c" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* Bag Stand with Standing Golf Bags */}
      <group position={[0, 0.007, -0.7]} rotation={[0, -0.2, 0]}>
        <RoundedBox args={[0.7, 0.4, 0.18]} radius={0.02} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#5a381d" />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.45, 0.16]} radius={0.04} position={[-0.2, 0.25, 0]} rotation={[0.1, 0, 0.08]} castShadow>
          <meshStandardMaterial color="#2a456d" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.45, 0.16]} radius={0.04} position={[0.2, 0.25, 0]} rotation={[0.1, 0, -0.08]} castShadow>
          <meshStandardMaterial color="#7a2b2b" roughness={0.7} />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Clean, Non-Overlapping Staging Plaza Unified with Flared Path */
function StagingPlaza() {
  return (
    <group position={[0, 0, 4.2]}>
      {/* 1. Back Half-Circle Crushed Stone Border Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <ringGeometry args={[3.2, 3.6, 24, 1, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#baa982" roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Back Half-Circle Natural Gravel Staging Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[3.2, 24, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#e4dbbe" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Painted Cart Staging Stall Markings */}
      <RoundedBox args={[0.06, 0.002, 2.0]} radius={0.01} position={[-0.6, 0.007, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.002, 2.0]} radius={0.01} position={[0.6, 0.007, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </RoundedBox>

      {/* 4. Corner Stone Planter with Boxwood Shrub */}
      <group position={[-2.4, 0, 2.2]}>
        <RoundedBox args={[0.9, 0.22, 0.45]} radius={0.04} position={[0, 0.11, 0]} castShadow>
          <meshStandardMaterial color="#6a7076" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.28, 0.3]} radius={0.08} position={[0, 0.32, 0]} castShadow>
          <meshStandardMaterial color="#2e6e34" />
        </RoundedBox>
      </group>

      <group position={[2.4, 0, 2.2]}>
        <RoundedBox args={[0.9, 0.22, 0.45]} radius={0.04} position={[0, 0.11, 0]} castShadow>
          <meshStandardMaterial color="#6a7076" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.28, 0.3]} radius={0.08} position={[0, 0.32, 0]} castShadow>
          <meshStandardMaterial color="#2e6e34" />
        </RoundedBox>
      </group>
    </group>
  );
}

export default memo(function CartPath() {
  const { pathGeo, borderGeo, pebbles } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      PATH_WAYPOINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false,
      "catmullrom",
      0.35
    );

    const segments = 190;

    const pathPositions: number[] = [];
    const pathUVs: number[] = [];
    const pathIndices: number[] = [];

    const borderPositions: number[] = [];
    const borderIndices: number[] = [];

    const pebbleList: {
      position: [number, number, number];
      scale: [number, number, number];
      rotationY: number;
    }[] = [];

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u);
      const norm = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Smooth driveway flare from spawn plaza (width 6.4) down to path ribbon (width 2.4)
      const flareFactor = Math.max(0, 1 - u / 0.08);
      const smoothFlare = flareFactor * flareFactor * (3 - 2 * flareFactor); // cubic smoothstep

      const currentWidth = 2.4 + smoothFlare * 4.0;
      const currentBorderWidth = 2.8 + smoothFlare * 4.4;

      // Path inner gravel vertices
      const pLeft = pt.clone().addScaledVector(norm, currentWidth / 2);
      const pRight = pt.clone().addScaledVector(norm, -currentWidth / 2);

      pathPositions.push(pLeft.x, 0.005, pLeft.z);
      pathPositions.push(pRight.x, 0.005, pRight.z);
      pathUVs.push(0, u * 20);
      pathUVs.push(1, u * 20);

      // Path outer rough crushed stone border
      const bLeft = pt.clone().addScaledVector(norm, currentBorderWidth / 2);
      const bRight = pt.clone().addScaledVector(norm, -currentBorderWidth / 2);
      borderPositions.push(bLeft.x, 0.003, bLeft.z);
      borderPositions.push(bRight.x, 0.003, bRight.z);

      if (i < segments) {
        const base = i * 2;
        pathIndices.push(base, base + 1, base + 2);
        pathIndices.push(base + 1, base + 3, base + 2);

        borderIndices.push(base, base + 1, base + 2);
        borderIndices.push(base + 1, base + 3, base + 2);
      }

      // Natural scattered gravel pebbles along edges (starting past the forecourt flare)
      if (i % 3 === 0 && u > 0.08 && i < segments - 1) {
        const side = i % 2 === 0 ? 1 : -1;
        const edgeOffset = (currentWidth / 2 + 0.15) * side;
        const pebblePos = pt.clone().addScaledVector(norm, edgeOffset);
        pebbleList.push({
          position: [pebblePos.x, 0.015, pebblePos.z],
          scale: [0.14 + (i % 3) * 0.03, 0.06, 0.16 + (i % 2) * 0.04],
          rotationY: (i * 1.7) % (Math.PI * 2),
        });
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pathPositions, 3));
    pGeo.setAttribute("uv", new THREE.Float32BufferAttribute(pathUVs, 2));
    pGeo.setIndex(pathIndices);
    pGeo.computeVertexNormals();

    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute("position", new THREE.Float32BufferAttribute(borderPositions, 3));
    bGeo.setIndex(borderIndices);
    bGeo.computeVertexNormals();

    return { pathGeo: pGeo, borderGeo: bGeo, pebbles: pebbleList };
  }, []);

  return (
    <group>
      {/* 1. Clubhouse Pavilion & Cart Staging Awning */}
      <ClubhousePavilion />

      {/* 2. Hole #1 Starter Area (Scorecard Board, Ball Washer, Tee Box) */}
      <StarterArea />

      {/* 3. Bag Drop & Starter Rest Area */}
      <BagDropArea />

      {/* 4. Organic Rounded Staging Forecourt Plaza with Smooth Blend */}
      <StagingPlaza />

      {/* 5. Outer Crushed Stone Border Sub-layer */}
      <mesh geometry={borderGeo} receiveShadow>
        <meshStandardMaterial color="#baa982" roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* 6. Main Nature Gravel Trail Ribbon */}
      <mesh geometry={pathGeo} receiveShadow>
        <meshStandardMaterial color="#e4dbbe" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* 7. Natural Gravel Rock Pebbles along path edges */}
      {pebbles.map((peb, pi) => (
        <RoundedBox
          key={`pebble-${pi}`}
          args={peb.scale}
          radius={0.02}
          position={peb.position}
          rotation={[0, peb.rotationY, 0]}
        >
          <meshStandardMaterial
            color={pi % 2 === 0 ? "#7e725a" : "#9e9175"}
            roughness={0.95}
          />
        </RoundedBox>
      ))}
    </group>
  );
});
