import { getRoomColliders, PLAYER_CONFIG } from '../config';
import { isOnWorldFloor, WORLD_BOUNDS, type WorldPoint } from '../world/layout';

export type Point = WorldPoint;
const GRID_STEP = 0.3;
const CLEARANCE = PLAYER_CONFIG.capsuleRadius + 0.07;

/** Navigation and physics share walls and furniture, including locked doorways. */
export function findWalkingPath(start: Point, goal: Point, greenhouseOpen = false, arcadeUnlocked = false): Point[] {
  if (!isOnWorldFloor(goal, greenhouseOpen)) return [];
  const width = Math.ceil((WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX) / GRID_STEP) + 1;
  const depth = Math.ceil((WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ) / GRID_STEP) + 1;
  const standingHeight = PLAYER_CONFIG.spawn[1] + PLAYER_CONFIG.capsuleHalfHeight + PLAYER_CONFIG.capsuleRadius;
  const obstacles = getRoomColliders(greenhouseOpen, arcadeUnlocked).filter(collider => !collider.id.endsWith('floor') && collider.position[1] - collider.halfExtents[1] < standingHeight);
  const cache = new Map<number, boolean>();
  const pointAt = (index: number): Point => ({
    x: WORLD_BOUNDS.minX + (index % width) * GRID_STEP,
    z: WORLD_BOUNDS.minZ + Math.floor(index / width) * GRID_STEP
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
    for (let index = 0; index < width * depth; index++) {
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
