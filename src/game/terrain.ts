import { projects } from "../data/content";
import type { SignData } from "./Sign";

export const SIGNS: SignData[] = [
  { id: "about", label: "ABOUT ME", position: [-4, 0, -10], rotationY: 0.3, accent: "#ffb000" },
  {
    id: projects[0].id,
    label: projects[0].ticker,
    position: [5, 0, -24],
    rotationY: -0.3,
    accent: "#3ddc84",
  },
  {
    id: projects[1].id,
    label: projects[1].ticker,
    position: [-6, 0, -38],
    rotationY: 0.3,
    accent: "#3ddc84",
  },
  { id: "skills", label: "SKILLS", position: [5, 0, -50], rotationY: -0.3, accent: "#ffb000" },
  { id: "contact", label: "CONTACT", position: [0, 0, -63], rotationY: 0, accent: "#ff9d3d" },
];

export const TILE_SIZE = 24;
export const TILE_RADIUS = 3;

/** Deterministic hash so the same tile always scatters the same trees/bushes/flags/bunkers. */
export function hash(x: number, z: number, salt: number): number {
  const s = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

export type DecorationKind = "tree" | "bush" | "flag" | "bunker" | "lake";

export type Decoration = {
  x: number;
  z: number;
  kind: DecorationKind;
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

  // Add 5 deterministic objects per tile
  for (let i = 0; i < 5; i++) {
    const rx = hash(tx, tz, i * 3 + 1);
    const rz = hash(tx, tz, i * 3 + 2);
    const rk = hash(tx, tz, i * 3 + 3);
    const localX = (rx - 0.5) * TILE_SIZE;
    const localZ = (rz - 0.5) * TILE_SIZE;

    // Keep middle fairway lane clear along main sign path (tx === 0)
    if (tx === 0 && Math.abs(localX) < 4.5) continue;

    let kind: DecorationKind = "tree";
    if (rk < 0.45) kind = "tree";
    else if (rk < 0.72) kind = "bush";
    else if (rk < 0.84) kind = "flag";
    else if (rk < 0.94) kind = "bunker";
    else kind = "lake";

    items.push({
      x: originX + localX,
      z: originZ + localZ,
      kind,
      radius: kind === "lake" ? 1.8 : kind === "bunker" ? 1.4 : undefined,
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

  // Check 3x3 surrounding tiles
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const tx = cx + dx;
      const tz = cz + dz;
      const decos = decorationsForTile(tx, tz);
      for (const d of decos) {
        if (d.kind === "tree") {
          obstacles.push({ x: d.x, z: d.z, radius: 0.5, kind: "tree" });
        } else if (d.kind === "bush") {
          obstacles.push({ x: d.x, z: d.z, radius: 0.45, kind: "bush" });
        } else if (d.kind === "lake") {
          obstacles.push({ x: d.x, z: d.z, radius: 1.6, kind: "lake" });
        }
      }
    }
  }

  // Include sign posts as physical obstacles
  for (const sign of SIGNS) {
    obstacles.push({
      x: sign.position[0],
      z: sign.position[2],
      radius: 0.55,
      kind: "sign",
    });
  }

  return obstacles;
}
