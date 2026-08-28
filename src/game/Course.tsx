import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import { TILE_SIZE, TILE_RADIUS, decorationsForTile } from "./terrain";

/** Tiered Coniferous Pine Tree */
function BlockPineTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Dark cedar trunk */}
      <RoundedBox args={[0.28, 1.1, 0.28]} radius={0.04} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#503522" />
      </RoundedBox>
      {/* Bottom canopy tier */}
      <RoundedBox args={[1.35, 0.55, 1.35]} radius={0.12} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color="#244f29" />
      </RoundedBox>
      {/* Middle canopy tier */}
      <RoundedBox args={[1.05, 0.5, 1.05]} radius={0.1} position={[0, 1.6, 0]} castShadow>
        <meshStandardMaterial color="#2d6434" />
      </RoundedBox>
      {/* Top tip tier */}
      <RoundedBox args={[0.7, 0.45, 0.7]} radius={0.08} position={[0, 1.95, 0]} castShadow>
        <meshStandardMaterial color="#387a3f" />
      </RoundedBox>
    </group>
  );
}

/** Broad Leafy Oak Tree */
function BlockOakTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.38, 0.95, 0.38]} radius={0.06} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color="#684729" />
      </RoundedBox>
      {/* Main canopy core */}
      <RoundedBox args={[1.35, 0.85, 1.35]} radius={0.2} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#559942" />
      </RoundedBox>
      {/* Side puff 1 */}
      <RoundedBox args={[0.85, 0.65, 0.85]} radius={0.16} position={[-0.35, 1.15, 0.25]} castShadow>
        <meshStandardMaterial color="#64ac4e" />
      </RoundedBox>
      {/* Side puff 2 */}
      <RoundedBox args={[0.8, 0.6, 0.8]} radius={0.15} position={[0.35, 1.3, -0.2]} castShadow>
        <meshStandardMaterial color="#498539" />
      </RoundedBox>
      {/* Top crown */}
      <RoundedBox args={[0.9, 0.55, 0.9]} radius={0.18} position={[0, 1.75, 0]} castShadow>
        <meshStandardMaterial color="#72bb5a" />
      </RoundedBox>
    </group>
  );
}

/** White-Trunk Birch Tree with Golden-Lime Foliage */
function BlockBirchTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* White birch trunk */}
      <RoundedBox args={[0.24, 1.3, 0.24]} radius={0.03} position={[0, 0.65, 0]} castShadow>
        <meshStandardMaterial color="#ede9de" />
      </RoundedBox>
      {/* Dark trunk rings */}
      <RoundedBox args={[0.26, 0.05, 0.26]} radius={0.01} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#2e3230" />
      </RoundedBox>
      <RoundedBox args={[0.26, 0.05, 0.26]} radius={0.01} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#2e3230" />
      </RoundedBox>
      {/* Golden lime canopy */}
      <RoundedBox args={[1.05, 0.8, 1.05]} radius={0.16} position={[0, 1.45, 0]} castShadow>
        <meshStandardMaterial color="#86cb48" />
      </RoundedBox>
      <RoundedBox args={[0.75, 0.55, 0.75]} radius={0.14} position={[0, 1.9, 0]} castShadow>
        <meshStandardMaterial color="#9de256" />
      </RoundedBox>
    </group>
  );
}

/** Flowering Cherry Blossom Tree */
function BlockBlossomTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.3, 0.9, 0.3]} radius={0.05} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#4a2c1d" />
      </RoundedBox>
      {/* Pastel blossom puffs */}
      <RoundedBox args={[1.25, 0.8, 1.25]} radius={0.2} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color="#f5a6b8" />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.6, 0.8]} radius={0.15} position={[0.3, 1.1, 0.2]} castShadow>
        <meshStandardMaterial color="#fcd5de" />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.55, 0.85]} radius={0.16} position={[0, 1.7, 0]} castShadow>
        <meshStandardMaterial color="#fee2e8" />
      </RoundedBox>
    </group>
  );
}

function BlockBush({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.65, 0.48, 0.65]} radius={0.12} position={[0, 0.24, 0]} castShadow>
        <meshStandardMaterial color="#4c9641" />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.35, 0.42]} radius={0.08} position={[0.2, 0.2, -0.15]} castShadow>
        <meshStandardMaterial color="#5caa50" />
      </RoundedBox>
    </group>
  );
}

/** Colorful Wildflower Patch */
function FlowerPatch({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.005, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 12]} />
        <meshStandardMaterial color="#2d5e2c" roughness={0.9} />
      </mesh>
      {/* Yellow buttercup */}
      <mesh position={[-0.2, 0.04, -0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 6]} />
        <meshStandardMaterial color="#ffd43f" />
      </mesh>
      {/* White daisy */}
      <mesh position={[0.25, 0.04, 0.1]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Lavender bluebell */}
      <mesh position={[-0.05, 0.04, 0.25]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 6]} />
        <meshStandardMaterial color="#9d86e0" />
      </mesh>
      {/* Coral blossom */}
      <mesh position={[0.1, 0.04, -0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 6]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    </group>
  );
}

/** Realistic Turf Divot Marks & Sandy Scars */
function FairwayDivots({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.004, z]}>
      <RoundedBox args={[0.22, 0.006, 0.45]} radius={0.04} position={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#c2b280" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.006, 0.35]} radius={0.03} position={[0.15, 0, 0.2]}>
        <meshStandardMaterial color="#1a3d1c" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.006, 0.25]} radius={0.03} position={[0.25, 0, -0.18]}>
        <meshStandardMaterial color="#c2b280" roughness={0.95} />
      </RoundedBox>
    </group>
  );
}

/** Scenic Lake with Arched Wooden Fairway Bridge */
function LakeWithBridge({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Sandy shoreline bank */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[2.5, 28]} />
        <meshStandardMaterial color="#dfd4a8" />
      </mesh>
      {/* Reflective Azure Water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[2.1, 28]} />
        <meshStandardMaterial color="#2d779c" roughness={0.12} metalness={0.15} />
      </mesh>
      {/* Water Lily Pads with pink lotus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.9, 0.012, 0.8]}>
        <circleGeometry args={[0.24, 12]} />
        <meshStandardMaterial color="#3b8c38" />
      </mesh>
      <mesh position={[-0.9, 0.025, 0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 6]} />
        <meshStandardMaterial color="#f78da7" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.012, -0.7]}>
        <circleGeometry args={[0.2, 12]} />
        <meshStandardMaterial color="#3b8c38" />
      </mesh>

      {/* Arched Wooden Bridge Spanning Across the Lake */}
      <group position={[0, 0, 0]}>
        {/* Stone Abutments on both shores */}
        <RoundedBox args={[1.5, 0.16, 0.4]} radius={0.03} position={[0, 0.08, -1.9]}>
          <meshStandardMaterial color="#6f757a" />
        </RoundedBox>
        <RoundedBox args={[1.5, 0.16, 0.4]} radius={0.03} position={[0, 0.08, 1.9]}>
          <meshStandardMaterial color="#6f757a" />
        </RoundedBox>

        {/* Arched Wooden Bridge Deck */}
        <RoundedBox args={[1.3, 0.08, 4.0]} radius={0.02} position={[0, 0.18, 0]} castShadow>
          <meshStandardMaterial color="#82522c" roughness={0.7} />
        </RoundedBox>

        {/* Bridge Planks Cross Grooves */}
        {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.6].map((pz, pi) => (
          <RoundedBox
            key={`plank-${pi}`}
            args={[1.32, 0.02, 0.06]}
            radius={0.005}
            position={[0, 0.23, pz]}
          >
            <meshStandardMaterial color="#6e4222" />
          </RoundedBox>
        ))}

        {/* Left Side Railing & Upright Posts */}
        <RoundedBox args={[0.06, 0.05, 4.0]} radius={0.01} position={[-0.62, 0.42, 0]}>
          <meshStandardMaterial color="#82522c" />
        </RoundedBox>
        {[-1.6, -0.8, 0, 0.8, 1.6].map((rz, ri) => (
          <RoundedBox
            key={`post-l-${ri}`}
            args={[0.06, 0.24, 0.06]}
            radius={0.01}
            position={[-0.62, 0.3, rz]}
          >
            <meshStandardMaterial color="#6e4222" />
          </RoundedBox>
        ))}

        {/* Right Side Railing & Upright Posts */}
        <RoundedBox args={[0.06, 0.05, 4.0]} radius={0.01} position={[0.62, 0.42, 0]}>
          <meshStandardMaterial color="#82522c" />
        </RoundedBox>
        {[-1.6, -0.8, 0, 0.8, 1.6].map((rz, ri) => (
          <RoundedBox
            key={`post-r-${ri}`}
            args={[0.06, 0.24, 0.06]}
            radius={0.01}
            position={[0.62, 0.3, rz]}
          >
            <meshStandardMaterial color="#6e4222" />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

/** Natural Organic Water Hazard with Lily Pads */
function NaturalLake({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Sandy shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshStandardMaterial color="#dfd4a8" />
      </mesh>
      {/* Water pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial color="#2d779c" roughness={0.12} metalness={0.15} />
      </mesh>
      {/* Lily pads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.012, 0.4]}>
        <circleGeometry args={[0.22, 10]} />
        <meshStandardMaterial color="#3b8c38" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, 0.012, -0.3]}>
        <circleGeometry args={[0.18, 10]} />
        <meshStandardMaterial color="#3b8c38" />
      </mesh>
    </group>
  );
}

/** Sand Bunker with Wooden Rake */
function BunkerWithRake({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[1.6, 20]} />
        <meshStandardMaterial color="#e5d7a2" roughness={0.95} />
      </mesh>
      {/* Miniature Sand Rake resting on edge */}
      <group position={[1.1, 0.04, 0.4]} rotation={[0, 0.4, 0.15]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.7, 6]} />
          <meshStandardMaterial color="#7a5530" />
        </mesh>
        <RoundedBox args={[0.02, 0.03, 0.22]} radius={0.005} position={[0.35, 0, 0]}>
          <meshStandardMaterial color="#33373b" />
        </RoundedBox>
      </group>
    </group>
  );
}

/** Wooden Golf Course Rest Bench */
function CourseBench({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Cast iron legs */}
      <RoundedBox args={[0.05, 0.25, 0.35]} radius={0.01} position={[-0.4, 0.125, 0]}>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>
      <RoundedBox args={[0.05, 0.25, 0.35]} radius={0.01} position={[0.4, 0.125, 0]}>
        <meshStandardMaterial color="#22262a" />
      </RoundedBox>
      {/* Wooden slats seat */}
      <RoundedBox args={[0.95, 0.03, 0.35]} radius={0.008} position={[0, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#8a572c" roughness={0.7} />
      </RoundedBox>
      {/* Wooden backrest */}
      <RoundedBox args={[0.95, 0.22, 0.03]} radius={0.008} position={[0, 0.42, -0.16]} castShadow>
        <meshStandardMaterial color="#8a572c" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}

/** 150-Yard Fairway Distance Marker Stake */
function YardageMarker({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Black indicator stripes */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.1, 8]} />
        <meshStandardMaterial color="#1a1c1e" />
      </mesh>
    </group>
  );
}

/** Decorative golf pin — square pennant flag, never triangular. */
function PinFlag({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <circleGeometry args={[1.0, 20]} />
        <meshStandardMaterial color="#dcd4b4" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}>
        <circleGeometry args={[0.75, 20]} />
        <meshStandardMaterial color="#4aa042" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.5, 6]} />
        <meshStandardMaterial color="#f0eee8" />
      </mesh>
      <RoundedBox args={[0.4, 0.26, 0.025]} radius={0.015} position={[0.22, 1.3, 0]} castShadow>
        <meshStandardMaterial color="#ff5c5c" />
      </RoundedBox>
    </group>
  );
}

/** A single ground tile plus its decorations. */
function Tile({ tx, tz }: { tx: number; tz: number }) {
  const items = useMemo(() => decorationsForTile(tx, tz), [tx, tz]);
  const isAlt = (Math.abs(tx) + Math.abs(tz)) % 2 === 0;

  return (
    <group position={[tx * TILE_SIZE, 0, tz * TILE_SIZE]}>
      {/* Authentic Golf Fairway Base Turf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
        <meshStandardMaterial color={isAlt ? "#429347" : "#3c8640"} roughness={0.88} />
      </mesh>

      {/* Mown Fairway Striping Lines */}
      {[-9, -3, 3, 9].map((sy, si) => (
        <mesh
          key={`stripe-${si}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.001, sy]}
          receiveShadow
        >
          <planeGeometry args={[TILE_SIZE, 3]} />
          <meshStandardMaterial color={isAlt ? "#4ba451" : "#367c3b"} roughness={0.88} />
        </mesh>
      ))}

      {items.map((d, i) => {
        if (d.kind === "tree_pine") return <BlockPineTree key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "tree_oak") return <BlockOakTree key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "tree_birch") return <BlockBirchTree key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "tree_blossom") return <BlockBlossomTree key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "bush") return <BlockBush key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "flower_patch") return <FlowerPatch key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "divots") return <FairwayDivots key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "lake_bridge")
          return <LakeWithBridge key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} rotationY={d.rotationY} />;
        if (d.kind === "lake") return <NaturalLake key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "bunker") return <BunkerWithRake key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        if (d.kind === "bench")
          return <CourseBench key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} rotationY={d.rotationY} />;
        if (d.kind === "yardage_post") return <YardageMarker key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
        return <PinFlag key={i} x={d.x - tx * TILE_SIZE} z={d.z - tz * TILE_SIZE} />;
      })}
    </group>
  );
}

/** Infinite-feeling ground: a grid of tiles that re-centers on the cart as it drives. */
export default function Course({ target }: { target: RefObject<THREE.Group | null> }) {
  const [center, setCenter] = useState({ cx: 0, cz: 0 });

  useFrame(() => {
    const t = target.current;
    if (!t) return;
    const cx = Math.round(t.position.x / TILE_SIZE);
    const cz = Math.round(t.position.z / TILE_SIZE);
    if (cx !== center.cx || cz !== center.cz) setCenter({ cx, cz });
  });

  const list: { tx: number; tz: number }[] = [];
  for (let dx = -TILE_RADIUS; dx <= TILE_RADIUS; dx++) {
    for (let dz = -TILE_RADIUS; dz <= TILE_RADIUS; dz++) {
      list.push({ tx: center.cx + dx, tz: center.cz + dz });
    }
  }

  return (
    <group>
      {list.map(({ tx, tz }) => (
        <Tile key={`${tx}_${tz}`} tx={tx} tz={tz} />
      ))}
    </group>
  );
}
