import { WORLD_BOUNDS } from './layout';

const PEAKS = [[-125, -105, 56, 31], [-72, -138, 48, 27], [18, -144, 65, 32], [106, -118, 58, 29], [144, -32, 52, 28], [134, 98, 64, 34], [42, 142, 47, 30], [-62, 140, 59, 32], [-140, 66, 52, 28], [-151, -13, 39, 26]] as const;

/** Keep the entire physical meadow flat; mountains rise beyond its walkable boundary. */
export function terrainHeight(x: number, z: number): number {
  const outside = Math.max(WORLD_BOUNDS.minX - 8 - x, x - WORLD_BOUNDS.maxX - 8, WORLD_BOUNDS.minZ - 8 - z, z - WORLD_BOUNDS.maxZ - 8, 0);
  const blend = Math.min(1, outside / 20) ** 2;
  let height = 0;
  for (const [px, pz, peak, spread] of PEAKS) height += peak * Math.exp(-((x - px) ** 2 + (z - pz) ** 2) / (2 * spread ** 2));
  const ridges = 1 + Math.sin(x * 0.19 + z * 0.11) * 0.07 + Math.sin(x * 0.43 - z * 0.29) * 0.04;
  return -0.08 + height * ridges * blend;
}

export function isMeadowPlanting(x: number, z: number): boolean {
  return !(Math.abs(x) < 23 && z > -15 && z < 30) && !(z > 11.7 && z < 19.3) && !(z > 31.7 && z < 40.3) && !(x > 21 && x < 35 && z > 18 && z < 32);
}
