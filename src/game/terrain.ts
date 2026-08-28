import { projects } from "../data/content";
import type { SignData } from "./Sign";

export const SIGNS: SignData[] = [
  { id: "about", label: "ABOUT ME", position: [-5.5, 0, -10], rotationY: 0.35, accent: "#ffb000" },
  {
    id: projects[0].id,
    label: projects[0].ticker,
    position: [6.0, 0, -24],
    rotationY: -0.35,
    accent: "#3ddc84",
  },
  {
    id: projects[1].id,
    label: projects[1].ticker,
    position: [-6.5, 0, -38],
    rotationY: 0.35,
    accent: "#3ddc84",
  },
  { id: "skills", label: "SKILLS", position: [6.0, 0, -50], rotationY: -0.35, accent: "#ffb000" },
  { id: "contact", label: "CONTACT", position: [-4.0, 0, -64], rotationY: 0.2, accent: "#ff9d3d" },
];

export const TILE_SIZE = 24;
export const TILE_RADIUS = 2; // 5x5 grid = 25 tiles for high frame rate

/** Deterministic hash so the same tile always scatters the same trees/bushes/flags/bunkers. */
export function hash(x: number, z: number, salt: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

export type DecorationKind =
  | "tree_pine"
  | "tree_oak"
  | "tree_birch"
  | "tree_blossom"
  | "bush"
  | "flower_patch"
  | "divots"
  | "lake_bridge"
  | "lake"
  | "bunker"
  | "bench"
  | "yardage_post"
  | "flag";

export type Decoration = {
  x: number;
  z: number;
  kind: DecorationKind;
  rotationY?: number;
  radius?: number;
};

export type Obstacle = {
  x: number;
  z: number;
  radius: number;
  kind: string;
};

/** Deterministic decorations for a given tile coordinate (tx, tz). */
export function decorationsForTile(tx: number, tz: number): Decoration[] {
  const items: Decoration[] = [];
  const originX = tx * TILE_SIZE;
  const originZ = tz * TILE_SIZE;

  // 6 deterministic objects per tile for clean, fast rendering
  for (let i = 0; i < 6; i++) {
    const rx = hash(tx, tz, i * 4 + 1);
    const rz = hash(tx, tz, i * 4 + 2);
    const rk = hash(tx, tz, i * 4 + 3);
    const rr = hash(tx, tz, i * 4 + 4);

    const localX = (rx - 0.5) * TILE_SIZE;
    const localZ = (rz - 0.5) * TILE_SIZE;
    const globalZ = originZ + localZ;

    // Keep fairway corridor clear along main sign path (tx === 0)
    if (tx === 0 && Math.abs(localX) < 8.0 && globalZ > -72 && globalZ < 12) {
      if (rk < 0.3) {
        items.push({
          x: originX + localX,
          z: originZ + localZ,
          kind: rk < 0.15 ? "divots" : "flower_patch",
          rotationY: rr * Math.PI * 2,
        });
      }
      continue;
    }

    let kind: DecorationKind = "tree_oak";
    if (rk < 0.16) kind = "tree_pine";
    else if (rk < 0.32) kind = "tree_oak";
    else if (rk < 0.44) kind = "tree_birch";
    else if (rk < 0.52) kind = "tree_blossom";
    else if (rk < 0.64) kind = "bush";
    else if (rk < 0.72) kind = "flower_patch";
    else if (rk < 0.78) kind = "divots";
    else if (rk < 0.86) kind = "lake_bridge";
    else if (rk < 0.92) kind = "lake";
    else if (rk < 0.96) kind = "bunker";
    else kind = "bench";

    items.push({
      x: originX + localX,
      z: originZ + localZ,
      kind,
      rotationY: rr * Math.PI * 2,
      radius:
        kind === "lake" || kind === "lake_bridge"
          ? 2.2
          : kind === "bunker"
            ? 1.5
            : undefined,
    });
  }
  return items;
}

/**
 * Returns physical obstacles in the immediate neighborhood of (cartX, cartZ)
 * for collision calculation in Cart.tsx.
 */
export function nearbyObstacles(cartX: number, cartZ: number): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const cx = Math.round(cartX / TILE_SIZE);
  const cz = Math.round(cartZ / TILE_SIZE);
  const maxDistSq = 64; // only check obstacles within 8 units

  // Check 3x3 surrounding tiles
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const tx = cx + dx;
      const tz = cz + dz;
      const decos = decorationsForTile(tx, tz);
      for (const d of decos) {
        const diffX = d.x - cartX;
        const diffZ = d.z - cartZ;
        if (diffX * diffX + diffZ * diffZ > maxDistSq) continue;

        if (
          d.kind === "tree_pine" ||
          d.kind === "tree_oak" ||
          d.kind === "tree_birch" ||
          d.kind === "tree_blossom"
        ) {
          obstacles.push({ x: d.x, z: d.z, radius: 0.55, kind: "tree" });
        } else if (d.kind === "bush") {
          obstacles.push({ x: d.x, z: d.z, radius: 0.45, kind: "bush" });
        } else if (d.kind === "bench" || d.kind === "yardage_post") {
          obstacles.push({ x: d.x, z: d.z, radius: 0.4, kind: d.kind });
        } else if (d.kind === "lake") {
          obstacles.push({ x: d.x, z: d.z, radius: 1.8, kind: "lake" });
        }
      }
    }
  }

  // Include sign posts as physical obstacles
  for (const sign of SIGNS) {
    const diffX = sign.position[0] - cartX;
    const diffZ = sign.position[2] - cartZ;
    if (diffX * diffX + diffZ * diffZ <= maxDistSq) {
      obstacles.push({
        x: sign.position[0],
        z: sign.position[2],
        radius: 0.55,
        kind: "sign",
      });
    }
  }

  // Include Clubhouse building boundary on left (x <= -4.2, z in [0.5, 7.5])
  if (cartX < -2.0 && cartZ > -1.0 && cartZ < 9.0) {
    for (let bz = 0.8; bz <= 7.2; bz += 1.4) {
      obstacles.push({ x: -4.5, z: bz, radius: 0.8, kind: "building" });
    }
  }

  // Starter tee box boundary behind spawn (z >= 6.8)
  if (cartZ > 4.5 && cartZ < 10.0) {
    for (let bx = -1.8; bx <= 1.8; bx += 1.2) {
      obstacles.push({ x: bx, z: 7.2, radius: 0.6, kind: "starter_console" });
    }
  }

  return obstacles;
}
