import { memo, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { RefObject } from "react";
import { TILE_SIZE, TILE_RADIUS, decorationsForTile } from "./terrain";

// Shared Geometry and Material Caches to eliminate runtime instantiation lag
const roundedBoxGeoCache = new Map<string, THREE.BufferGeometry>();
function getRoundedBoxGeo(
  width: number,
  height: number,
  depth: number,
  radius = 0.05,
  segments = 1
): THREE.BufferGeometry {
  const key = `${width}_${height}_${depth}_${radius}_${segments}`;
  let geo = roundedBoxGeoCache.get(key);
  if (!geo) {
    geo = new RoundedBoxGeometry(width, height, depth, segments, radius);
    roundedBoxGeoCache.set(key, geo);
  }
  return geo;
}

const circleGeoCache = new Map<string, THREE.BufferGeometry>();
function getCircleGeo(radius: number, segments = 16): THREE.BufferGeometry {
  const key = `${radius}_${segments}`;
  let geo = circleGeoCache.get(key);
  if (!geo) {
    geo = new THREE.CircleGeometry(radius, segments);
    circleGeoCache.set(key, geo);
  }
  return geo;
}

const cylinderGeoCache = new Map<string, THREE.BufferGeometry>();
function getCylinderGeo(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments = 8
): THREE.BufferGeometry {
  const key = `${radiusTop}_${radiusBottom}_${height}_${radialSegments}`;
  let geo = cylinderGeoCache.get(key);
  if (!geo) {
    geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    cylinderGeoCache.set(key, geo);
  }
  return geo;
}

const materialCache = new Map<string, THREE.MeshStandardMaterial>();
function getStandardMat(color: string, roughness = 0.7, metalness = 0.0): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}`;
  let mat = materialCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materialCache.set(key, mat);
  }
  return mat;
}

// Shared Tile Ground Geometries & Materials
const basePlaneGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
const stripePlaneGeo = new THREE.PlaneGeometry(TILE_SIZE, 3);
const turfAltMat = getStandardMat("#429347", 0.88);
const turfMainMat = getStandardMat("#3c8640", 0.88);
const stripeAltMat = getStandardMat("#4ba451", 0.88);
const stripeMainMat = getStandardMat("#367c3b", 0.88);

/** Tiered Coniferous Pine Tree */
function BlockPineTree({ x, z }: { x: number; z: number }) {
  const trunkGeo = getRoundedBoxGeo(0.28, 1.1, 0.28, 0.04);
  const trunkMat = getStandardMat("#503522");

  const tier1Geo = getRoundedBoxGeo(1.35, 0.55, 1.35, 0.12);
  const tier1Mat = getStandardMat("#244f29");

  const tier2Geo = getRoundedBoxGeo(1.05, 0.5, 1.05, 0.1);
  const tier2Mat = getStandardMat("#2d6434");

  const tier3Geo = getRoundedBoxGeo(0.7, 0.45, 0.7, 0.08);
  const tier3Mat = getStandardMat("#387a3f");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 0.55, 0]} castShadow />
      <mesh geometry={tier1Geo} material={tier1Mat} position={[0, 1.2, 0]} castShadow />
      <mesh geometry={tier2Geo} material={tier2Mat} position={[0, 1.6, 0]} castShadow />
      <mesh geometry={tier3Geo} material={tier3Mat} position={[0, 1.95, 0]} castShadow />
    </group>
  );
}

/** Broad Leafy Oak Tree */
function BlockOakTree({ x, z }: { x: number; z: number }) {
  const trunkGeo = getRoundedBoxGeo(0.38, 0.95, 0.38, 0.06);
  const trunkMat = getStandardMat("#684729");

  const coreGeo = getRoundedBoxGeo(1.35, 0.85, 1.35, 0.2);
  const coreMat = getStandardMat("#559942");

  const puff1Geo = getRoundedBoxGeo(0.85, 0.65, 0.85, 0.16);
  const puff1Mat = getStandardMat("#64ac4e");

  const puff2Geo = getRoundedBoxGeo(0.8, 0.6, 0.8, 0.15);
  const puff2Mat = getStandardMat("#498539");

  const crownGeo = getRoundedBoxGeo(0.9, 0.55, 0.9, 0.18);
  const crownMat = getStandardMat("#72bb5a");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 0.48, 0]} castShadow />
      <mesh geometry={coreGeo} material={coreMat} position={[0, 1.25, 0]} castShadow />
      <mesh geometry={puff1Geo} material={puff1Mat} position={[-0.35, 1.15, 0.25]} castShadow />
      <mesh geometry={puff2Geo} material={puff2Mat} position={[0.35, 1.3, -0.2]} castShadow />
      <mesh geometry={crownGeo} material={crownMat} position={[0, 1.75, 0]} castShadow />
    </group>
  );
}

/** White-Trunk Birch Tree with Golden-Lime Foliage */
function BlockBirchTree({ x, z }: { x: number; z: number }) {
  const trunkGeo = getRoundedBoxGeo(0.24, 1.3, 0.24, 0.03);
  const trunkMat = getStandardMat("#ede9de");

  const ringGeo = getRoundedBoxGeo(0.26, 0.05, 0.26, 0.01);
  const ringMat = getStandardMat("#2e3230");

  const canopy1Geo = getRoundedBoxGeo(1.05, 0.8, 1.05, 0.16);
  const canopy1Mat = getStandardMat("#86cb48");

  const canopy2Geo = getRoundedBoxGeo(0.75, 0.55, 0.75, 0.14);
  const canopy2Mat = getStandardMat("#9de256");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 0.65, 0]} castShadow />
      <mesh geometry={ringGeo} material={ringMat} position={[0, 0.4, 0]} />
      <mesh geometry={ringGeo} material={ringMat} position={[0, 0.8, 0]} />
      <mesh geometry={canopy1Geo} material={canopy1Mat} position={[0, 1.45, 0]} castShadow />
      <mesh geometry={canopy2Geo} material={canopy2Mat} position={[0, 1.9, 0]} castShadow />
    </group>
  );
}

/** Flowering Cherry Blossom Tree */
function BlockBlossomTree({ x, z }: { x: number; z: number }) {
  const trunkGeo = getRoundedBoxGeo(0.3, 0.9, 0.3, 0.05);
  const trunkMat = getStandardMat("#4a2c1d");

  const puff1Geo = getRoundedBoxGeo(1.25, 0.8, 1.25, 0.2);
  const puff1Mat = getStandardMat("#f5a6b8");

  const puff2Geo = getRoundedBoxGeo(0.8, 0.6, 0.8, 0.15);
  const puff2Mat = getStandardMat("#fcd5de");

  const puff3Geo = getRoundedBoxGeo(0.85, 0.55, 0.85, 0.16);
  const puff3Mat = getStandardMat("#fee2e8");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 0.45, 0]} castShadow />
      <mesh geometry={puff1Geo} material={puff1Mat} position={[0, 1.2, 0]} castShadow />
      <mesh geometry={puff2Geo} material={puff2Mat} position={[0.3, 1.1, 0.2]} castShadow />
      <mesh geometry={puff3Geo} material={puff3Mat} position={[0, 1.7, 0]} castShadow />
    </group>
  );
}

function BlockBush({ x, z }: { x: number; z: number }) {
  const baseGeo = getRoundedBoxGeo(0.65, 0.48, 0.65, 0.12);
  const baseMat = getStandardMat("#4c9641");

  const puffGeo = getRoundedBoxGeo(0.42, 0.35, 0.42, 0.08);
  const puffMat = getStandardMat("#5caa50");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={baseGeo} material={baseMat} position={[0, 0.24, 0]} castShadow />
      <mesh geometry={puffGeo} material={puffMat} position={[0.2, 0.2, -0.15]} castShadow />
    </group>
  );
}

/** Colorful Wildflower Patch */
function FlowerPatch({ x, z }: { x: number; z: number }) {
  const baseGeo = getCircleGeo(0.7, 12);
  const baseMat = getStandardMat("#2d5e2c", 0.9);
  const petalGeo = getCylinderGeo(0.06, 0.06, 0.05, 6);

  return (
    <group position={[x, 0.005, z]}>
      <mesh geometry={baseGeo} material={baseMat} rotation={[-Math.PI / 2, 0, 0]} />
      {/* Yellow buttercup */}
      <mesh geometry={petalGeo} material={getStandardMat("#ffd43f")} position={[-0.2, 0.04, -0.15]} />
      {/* White daisy */}
      <mesh geometry={petalGeo} material={getStandardMat("#ffffff")} position={[0.25, 0.04, 0.1]} />
      {/* Lavender bluebell */}
      <mesh geometry={petalGeo} material={getStandardMat("#9d86e0")} position={[-0.05, 0.04, 0.25]} />
      {/* Coral blossom */}
      <mesh geometry={petalGeo} material={getStandardMat("#ff6b6b")} position={[0.1, 0.04, -0.2]} />
    </group>
  );
}

/** Realistic Turf Divot Marks & Sandy Scars */
function FairwayDivots({ x, z }: { x: number; z: number }) {
  const divot1Geo = getRoundedBoxGeo(0.22, 0.006, 0.45, 0.04);
  const sandMat = getStandardMat("#c2b280", 0.95);
  const divot2Geo = getRoundedBoxGeo(0.18, 0.006, 0.35, 0.03);
  const turfMat = getStandardMat("#1a3d1c", 0.95);
  const divot3Geo = getRoundedBoxGeo(0.14, 0.006, 0.25, 0.03);

  return (
    <group position={[x, 0.004, z]}>
      <mesh geometry={divot1Geo} material={sandMat} position={[-0.2, 0, 0]} />
      <mesh geometry={divot2Geo} material={turfMat} position={[0.15, 0, 0.2]} />
      <mesh geometry={divot3Geo} material={sandMat} position={[0.25, 0, -0.18]} />
    </group>
  );
}

/** Scenic Lake with Arched Wooden Fairway Bridge */
function LakeWithBridge({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  const shoreGeo = getCircleGeo(2.5, 20);
  const shoreMat = getStandardMat("#dfd4a8");
  const waterGeo = getCircleGeo(2.1, 20);
  const waterMat = getStandardMat("#2d779c", 0.12, 0.15);

  const lilyGeo = getCircleGeo(0.24, 10);
  const lilySmallGeo = getCircleGeo(0.2, 10);
  const lilyMat = getStandardMat("#3b8c38");
  const lotusGeo = getCylinderGeo(0.06, 0.06, 0.03, 6);
  const lotusMat = getStandardMat("#f78da7");

  const abutmentGeo = getRoundedBoxGeo(1.5, 0.16, 0.4, 0.03);
  const abutmentMat = getStandardMat("#6f757a");

  const deckGeo = getRoundedBoxGeo(1.3, 0.08, 4.0, 0.02);
  const deckMat = getStandardMat("#82522c", 0.7);

  const plankGeo = getRoundedBoxGeo(1.32, 0.02, 0.06, 0.005);
  const plankMat = getStandardMat("#6e4222");

  const railGeo = getRoundedBoxGeo(0.06, 0.05, 4.0, 0.01);
  const postGeo = getRoundedBoxGeo(0.06, 0.24, 0.06, 0.01);

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh geometry={shoreGeo} material={shoreMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} />
      <mesh geometry={waterGeo} material={waterMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} />

      <mesh geometry={lilyGeo} material={lilyMat} rotation={[-Math.PI / 2, 0, 0]} position={[-0.9, 0.012, 0.8]} />
      <mesh geometry={lotusGeo} material={lotusMat} position={[-0.9, 0.025, 0.8]} />
      <mesh geometry={lilySmallGeo} material={lilyMat} rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.012, -0.7]} />

      {/* Stone Abutments on both shores */}
      <mesh geometry={abutmentGeo} material={abutmentMat} position={[0, 0.08, -1.9]} />
      <mesh geometry={abutmentGeo} material={abutmentMat} position={[0, 0.08, 1.9]} />

      {/* Arched Wooden Bridge Deck */}
      <mesh geometry={deckGeo} material={deckMat} position={[0, 0.18, 0]} castShadow />

      {/* Bridge Planks Cross Grooves */}
      {[-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.6].map((pz, pi) => (
        <mesh key={`plank-${pi}`} geometry={plankGeo} material={plankMat} position={[0, 0.23, pz]} />
      ))}

      {/* Left Side Railing & Upright Posts */}
      <mesh geometry={railGeo} material={deckMat} position={[-0.62, 0.42, 0]} />
      {[-1.6, -0.8, 0, 0.8, 1.6].map((rz, ri) => (
        <mesh key={`post-l-${ri}`} geometry={postGeo} material={plankMat} position={[-0.62, 0.3, rz]} />
      ))}

      {/* Right Side Railing & Upright Posts */}
      <mesh geometry={railGeo} material={deckMat} position={[0.62, 0.42, 0]} />
      {[-1.6, -0.8, 0, 0.8, 1.6].map((rz, ri) => (
        <mesh key={`post-r-${ri}`} geometry={postGeo} material={plankMat} position={[0.62, 0.3, rz]} />
      ))}
    </group>
  );
}

/** Natural Organic Water Hazard with Lily Pads */
function NaturalLake({ x, z }: { x: number; z: number }) {
  const shoreGeo = getCircleGeo(2.2, 20);
  const shoreMat = getStandardMat("#dfd4a8");
  const waterGeo = getCircleGeo(1.8, 20);
  const waterMat = getStandardMat("#2d779c", 0.12, 0.15);
  const pad1Geo = getCircleGeo(0.22, 10);
  const pad2Geo = getCircleGeo(0.18, 10);
  const padMat = getStandardMat("#3b8c38");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={shoreGeo} material={shoreMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} />
      <mesh geometry={waterGeo} material={waterMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} />
      <mesh geometry={pad1Geo} material={padMat} rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.012, 0.4]} />
      <mesh geometry={pad2Geo} material={padMat} rotation={[-Math.PI / 2, 0, 0]} position={[0.6, 0.012, -0.3]} />
    </group>
  );
}

/** Sand Bunker with Wooden Rake */
function BunkerWithRake({ x, z }: { x: number; z: number }) {
  const sandGeo = getCircleGeo(1.6, 18);
  const sandMat = getStandardMat("#e5d7a2", 0.95);
  const handleGeo = getCylinderGeo(0.01, 0.01, 0.7, 6);
  const handleMat = getStandardMat("#7a5530");
  const headGeo = getRoundedBoxGeo(0.02, 0.03, 0.22, 0.005);
  const headMat = getStandardMat("#33373b");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={sandGeo} material={sandMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} />
      <group position={[1.1, 0.04, 0.4]} rotation={[0, 0.4, 0.15]}>
        <mesh geometry={handleGeo} material={handleMat} rotation={[0, 0, Math.PI / 2]} />
        <mesh geometry={headGeo} material={headMat} position={[0.35, 0, 0]} />
      </group>
    </group>
  );
}

/** Wooden Golf Course Rest Bench */
function CourseBench({ x, z, rotationY = 0 }: { x: number; z: number; rotationY?: number }) {
  const legGeo = getRoundedBoxGeo(0.05, 0.25, 0.35, 0.01);
  const legMat = getStandardMat("#22262a");
  const seatGeo = getRoundedBoxGeo(0.95, 0.03, 0.35, 0.008);
  const woodMat = getStandardMat("#8a572c", 0.7);
  const backGeo = getRoundedBoxGeo(0.95, 0.22, 0.03, 0.008);

  return (
    <group position={[x, 0, z]}>
      <group rotation={[0, rotationY, 0]}>
        <mesh geometry={legGeo} material={legMat} position={[-0.4, 0.125, 0]} />
        <mesh geometry={legGeo} material={legMat} position={[0.4, 0.125, 0]} />
        <mesh geometry={seatGeo} material={woodMat} position={[0, 0.25, 0]} castShadow />
        <mesh geometry={backGeo} material={woodMat} position={[0, 0.42, -0.16]} castShadow />
      </group>
    </group>
  );
}

/** 150-Yard Fairway Distance Marker Stake */
function YardageMarker({ x, z }: { x: number; z: number }) {
  const postGeo = getCylinderGeo(0.04, 0.04, 0.7, 8);
  const postMat = getStandardMat("#ffffff");
  const stripeGeo = getCylinderGeo(0.042, 0.042, 0.1, 8);
  const stripeMat = getStandardMat("#1a1c1e");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={postGeo} material={postMat} position={[0, 0.35, 0]} />
      <mesh geometry={stripeGeo} material={stripeMat} position={[0, 0.4, 0]} />
    </group>
  );
}

/** Decorative golf pin: square pennant flag, never triangular. */
function PinFlag({ x, z }: { x: number; z: number }) {
  const outerCircle = getCircleGeo(1.0, 16);
  const outerMat = getStandardMat("#dcd4b4");
  const innerCircle = getCircleGeo(0.75, 16);
  const innerMat = getStandardMat("#4aa042");
  const poleGeo = getCylinderGeo(0.025, 0.025, 1.5, 6);
  const poleMat = getStandardMat("#f0eee8");
  const flagGeo = getRoundedBoxGeo(0.4, 0.26, 0.025, 0.015);
  const flagMat = getStandardMat("#ff5c5c");

  return (
    <group position={[x, 0, z]}>
      <mesh geometry={outerCircle} material={outerMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} />
      <mesh geometry={innerCircle} material={innerMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]} />
      <mesh geometry={poleGeo} material={poleMat} position={[0, 0.75, 0]} />
      <mesh geometry={flagGeo} material={flagMat} position={[0.22, 1.3, 0]} castShadow />
    </group>
  );
}

/** A single ground tile plus its decorations, memoized to prevent re-evaluation */
const Tile = memo(function Tile({ tx, tz }: { tx: number; tz: number }) {
  const items = useMemo(() => decorationsForTile(tx, tz), [tx, tz]);
  const isAlt = (Math.abs(tx) + Math.abs(tz)) % 2 === 0;

  return (
    <group position={[tx * TILE_SIZE, 0, tz * TILE_SIZE]}>
      {/* Fairway Base Turf */}
      <mesh
        geometry={basePlaneGeo}
        material={isAlt ? turfAltMat : turfMainMat}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      />

      {/* Mown Fairway Striping Lines */}
      {[-9, -3, 3, 9].map((sy, si) => (
        <mesh
          key={`stripe-${si}`}
          geometry={stripePlaneGeo}
          material={isAlt ? stripeAltMat : stripeMainMat}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.001, sy]}
          receiveShadow
        />
      ))}

      {items.map((d, i) => {
        const lx = d.x - tx * TILE_SIZE;
        const lz = d.z - tz * TILE_SIZE;
        if (d.kind === "tree_pine") return <BlockPineTree key={i} x={lx} z={lz} />;
        if (d.kind === "tree_oak") return <BlockOakTree key={i} x={lx} z={lz} />;
        if (d.kind === "tree_birch") return <BlockBirchTree key={i} x={lx} z={lz} />;
        if (d.kind === "tree_blossom") return <BlockBlossomTree key={i} x={lx} z={lz} />;
        if (d.kind === "bush") return <BlockBush key={i} x={lx} z={lz} />;
        if (d.kind === "flower_patch") return <FlowerPatch key={i} x={lx} z={lz} />;
        if (d.kind === "divots") return <FairwayDivots key={i} x={lx} z={lz} />;
        if (d.kind === "lake_bridge")
          return <LakeWithBridge key={i} x={lx} z={lz} rotationY={d.rotationY} />;
        if (d.kind === "lake") return <NaturalLake key={i} x={lx} z={lz} />;
        if (d.kind === "bunker") return <BunkerWithRake key={i} x={lx} z={lz} />;
        if (d.kind === "bench")
          return <CourseBench key={i} x={lx} z={lz} rotationY={d.rotationY} />;
        if (d.kind === "yardage_post") return <YardageMarker key={i} x={lx} z={lz} />;
        return <PinFlag key={i} x={lx} z={lz} />;
      })}
    </group>
  );
});

/** Infinite ground: a grid of tiles re-centered on the cart as it drives. */
export default memo(function Course({ target }: { target: RefObject<THREE.Group | null> }) {
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
});
