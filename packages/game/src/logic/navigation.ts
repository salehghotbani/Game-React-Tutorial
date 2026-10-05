import { getRoomColliders, PLAYER_CONFIG } from '../config';
import { isOnWorldFloor, WORLD_BOUNDS, type WorldPoint, type WorldCollider } from '../world/layout';

export type Point = WorldPoint;
const GRID_STEP = 0.3;
const CLEARANCE = PLAYER_CONFIG.capsuleRadius + 0.07;

/** Navigation and physics share walls and furniture, including locked doorways. */
export function findWalkingPath(start: Point, goal: Point, greenhouseOpen = false, arcadeUnlocked = false, extraObstacles: WorldCollider[] = []): Point[] {
  if (![start.x, start.z, goal.x, goal.z].every(Number.isFinite) || !isOnWorldFloor(goal, greenhouseOpen)) return [];
  const standingHeight = PLAYER_CONFIG.spawn[1] + PLAYER_CONFIG.capsuleHalfHeight + PLAYER_CONFIG.capsuleRadius;
  const obstacles = [...getRoomColliders(greenhouseOpen, arcadeUnlocked), ...extraObstacles].filter(collider => !collider.id.endsWith('floor') && collider.position[1] - collider.halfExtents[1] < standingHeight);
  const nearby = searchRoute(start, goal, greenhouseOpen, obstacles, 12);
  // Returning from the meadow can require going around a building to its courtyard entrance.
  return nearby.length ? nearby : searchRoute(start, goal, greenhouseOpen, obstacles, 24);
}

function searchRoute(start: Point, goal: Point, greenhouseOpen: boolean, obstacles: WorldCollider[], margin: number): Point[] {
  // Scope the grid to this journey; enlarging the landscape must not scan the whole world for every destination.
  const minX = Math.max(WORLD_BOUNDS.minX, WORLD_BOUNDS.minX + Math.floor((Math.min(start.x, goal.x) - margin - WORLD_BOUNDS.minX) / GRID_STEP) * GRID_STEP);
  const minZ = Math.max(WORLD_BOUNDS.minZ, WORLD_BOUNDS.minZ + Math.floor((Math.min(start.z, goal.z) - margin - WORLD_BOUNDS.minZ) / GRID_STEP) * GRID_STEP);
  const maxX = Math.min(WORLD_BOUNDS.maxX, Math.max(start.x, goal.x) + margin);
  const maxZ = Math.min(WORLD_BOUNDS.maxZ, Math.max(start.z, goal.z) + margin);
  const width = Math.floor((maxX - minX) / GRID_STEP) + 1;
  const depth = Math.floor((maxZ - minZ) / GRID_STEP) + 1;
  const cache = new Map<number, boolean>();
  const pointAt = (index: number): Point => ({
    x: minX + (index % width) * GRID_STEP,
    z: minZ + Math.floor(index / width) * GRID_STEP
  });

  const blocked = (index: number): boolean => {
    const cached = cache.get(index);
    if (cached !== undefined) return cached;
    const point = pointAt(index);
    const result = !isOnWorldFloor(point, greenhouseOpen) || obstacles.some(collider =>
      Math.abs(point.x - collider.position[0]) < collider.halfExtents[0] + CLEARANCE &&
      Math.abs(point.z - collider.position[2]) < collider.halfExtents[2] + CLEARANCE
    );
    cache.set(index, result);
    return result;
  };

  const nearestCell = (point: Point): number => {
    let best = -1;
    let distance = Infinity;
    const column = Math.round((point.x - minX) / GRID_STEP), row = Math.round((point.z - minZ) / GRID_STEP);
    for (let dz = -4; dz <= 4; dz++) for (let dx = -4; dx <= 4; dx++) {
      const x = column + dx, z = row + dz;
      if (x < 0 || x >= width || z < 0 || z >= depth) continue;
      const index = z * width + x;
      if (blocked(index)) continue;
      const candidate = pointAt(index);
      const candidateDistance = (point.x - candidate.x) ** 2 + (point.z - candidate.z) ** 2;
      if (candidateDistance < distance) { best = index; distance = candidateDistance; }
    }
    return best;
  };

  const source = nearestCell(start);
  const target = nearestCell(goal);
  if (source < 0 || target < 0 || Math.hypot(pointAt(target).x - goal.x, pointAt(target).z - goal.z) > 0.65) return [];

  const queue = [source];
  const previous = new Map<number, number>([[source, -1]]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const index = queue[cursor]!;
    if (index === target) break;
    const column = index % width;
    const row = Math.floor(index / width);
    const adjacent = [
      ...(column > 0 ? [index - 1] : []), ...(column < width - 1 ? [index + 1] : []),
      ...(row > 0 ? [index - width] : []), ...(row < depth - 1 ? [index + width] : [])
    ];
    for (const next of adjacent) {
      if (previous.has(next) || blocked(next)) continue;
      previous.set(next, index);
      queue.push(next);
    }
  }
  if (!previous.has(target)) return [];
  const path: Point[] = [];
  for (let index = target; index !== source; index = previous.get(index)!) path.push(pointAt(index));
  return path.length ? path.reverse() : [pointAt(target)];
}
