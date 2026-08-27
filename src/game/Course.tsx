import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import { TILE_SIZE, TILE_RADIUS, hash, decorationsForTile } from "./terrain";

/** A blocky Minecraft-style tree: trunk + stacked rounded canopy cubes. No cones. */
function BlockTree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.35, 0.9, 0.35]} radius={0.06} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#7a5230" />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.75, 1.1]} radius={0.12} position={[0, 1.15, 0]} castShadow>
        <meshStandardMaterial color="#5fae4a" />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.6, 0.8]} radius={0.12} position={[0, 1.75, 0]} castShadow>
        <meshStandardMaterial color="#6fc058" />
      </RoundedBox>
    </group>
  );
}

function BlockBush({ x, z }: { x: number; z: number }) {
  return (
    <RoundedBox args={[0.6, 0.5, 0.6]} radius={0.1} position={[x, 0.25, z]} castShadow>
      <meshStandardMaterial color="#4f9a45" />
    </RoundedBox>
  );
}

/** Decorative golf pin — square pennant flag, never triangular. */
function PinFlag({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.9, 20]} />
        <meshStandardMaterial color="#d8d1a8" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 6]} />
        <meshStandardMaterial color="#e8e6e0" />
      </mesh>
      <RoundedBox args={[0.4, 0.28, 0.03]} radius={0.02} position={[0.22, 1.3, 0]} castShadow>
        <meshStandardMaterial color="#ff5c5c" />
      </RoundedBox>
    </group>
  );
}

function Bunker({ x, z }: { x: number; z: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.015, z]}>
      <circleGeometry args={[1.4, 16]} />
      <meshStandardMaterial color="#e3d29b" />
    </mesh>
  );
}

function Lake({ x, z }: { x: number; z: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, z]}>
      <circleGeometry args={[1.8, 24]} />
      <meshStandardMaterial color="#3b82a6" roughness={0.1} metalness={0.1} />
    </mesh>
  );
}

/** A single ground tile plus its decorations. */
function Tile({ tx, tz }: { tx: number; tz: number }) {
  const items = useMemo(() => decorationsForTile(tx, tz), [tx, tz]);
  const shade = (hash(tx, tz, 99) - 0.5) * 0.04; // subtle checkerboard variation

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[tx * TILE_SIZE, 0, tz * TILE_SIZE]}
        receiveShadow
      >
        <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
        <meshStandardMaterial color={new THREE.Color(0.24 + shade, 0.56 + shade, 0.3 + shade)} />
      </mesh>
      {items.map((d, i) => {
        if (d.kind === "tree") return <BlockTree key={i} x={d.x} z={d.z} />;
        if (d.kind === "bush") return <BlockBush key={i} x={d.x} z={d.z} />;
        if (d.kind === "flag") return <PinFlag key={i} x={d.x} z={d.z} />;
        if (d.kind === "bunker") return <Bunker key={i} x={d.x} z={d.z} />;
        return <Lake key={i} x={d.x} z={d.z} />;
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
