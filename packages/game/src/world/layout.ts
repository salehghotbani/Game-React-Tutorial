import type { Vector3Tuple } from '@react-quest/shared';

export type WorldPoint = { x: number; z: number };
export type WorldCollider = { id: string; position: Vector3Tuple; halfExtents: Vector3Tuple };
export type FloorArea = { id: string; x: number; z: number; width: number; depth: number };

export const WORLD_BOUNDS = { minX: -10.4, maxX: 10.4, minZ: -12.3, maxZ: 12.2 };
export const GAME_NET = { requiredXp: 1000, sessionSeconds: 180 };
export const FLOOR_AREAS: FloorArea[] = [
  { id: 'studio', x: 0, z: 0, width: 10.4, depth: 10.4 },
  { id: 'upstairs', x: 0, z: -8.5, width: 10.4, depth: 7 },
  { id: 'quiet-room', x: -7.6, z: 0, width: 5.2, depth: 10.4 },
  { id: 'yard', x: 0, z: 8.5, width: 20.4, depth: 7 },

];

export const WORLD_CEILINGS: WorldCollider[] = FLOOR_AREAS
  .filter(area => ['studio', 'upstairs', 'quiet-room'].includes(area.id))
  .map(area => ({ id: `${area.id}-ceiling`, position: [area.x, 3.06, area.z], halfExtents: [area.width / 2, 0.06, area.depth / 2] }));

const divider = (id: string, position: Vector3Tuple, halfExtents: Vector3Tuple): WorldCollider => ({ id, position, halfExtents });

export const NEIGHBORHOOD_COLLIDERS: WorldCollider[] = [
  ...WORLD_CEILINGS,
  ...FLOOR_AREAS.filter(area => area.id !== 'studio').map(area => divider(`${area.id}-floor`, [area.x, -0.1, area.z], [area.width / 2, 0.1, area.depth / 2])),
  divider('world-west', [-10.4, 1.7, 0], [0.12, 1.7, 12.3]),
  divider('world-east', [10.4, 1.7, 0], [0.12, 1.7, 12.3]),
  divider('world-north', [0, 1.7, -12.3], [10.4, 1.7, 0.12]),
  divider('world-south', [0, 1.7, 12.2], [10.4, 1.7, 0.12]),
  divider('annex-west', [-10.2, 1.5, -3.75], [0.12, 1.5, 1.4]),
  divider('annex-west-long', [-10.2, 1.5, 1.8], [0.12, 1.5, 3.3]),
  divider('annex-north', [-7.6, 1.5, -5.1], [2.6, 1.5, 0.12]),
  divider('quiet-south', [-7.6, 1.5, 5.1], [2.6, 1.5, 0.12]),
  divider('upper-west', [-5.1, 1.5, -8.6], [0.12, 1.5, 3.4]),
  divider('upper-east', [5.1, 1.5, -8.6], [0.12, 1.5, 3.4]),
  divider('upper-north', [0, 1.5, -12.1], [5.2, 1.5, 0.12]),
  divider('upper-divider-back', [0, 1.5, -10.4], [0.1, 1.5, 1.7]),
  divider('upper-divider-front', [0, 1.5, -5.6], [0.1, 1.5, 0.5]),
  divider('kitchen-counter', [-3.8, 0.7, -11.4], [1.1, 0.7, 0.55]),
  divider('kitchen-table', [-2.9, 0.5, -8.7], [0.75, 0.5, 0.7]),
  divider('quiet-bed', [-8.7, 0.45, -2.7], [0.8, 0.45, 1.5]),
  divider('quiet-desk', [-8.9, 0.65, 1.2], [0.65, 0.65, 0.8]),
  divider('yard-wall-left', [-6.55, 1, 12], [3.65, 1, 0.12]),
  divider('yard-wall-right', [6.55, 1, 12], [3.65, 1, 0.12]),
  divider('yard-west', [-10.2, 1, 8.5], [0.12, 1, 3.5]),
  divider('yard-east', [10.2, 1, 8.5], [0.12, 1, 3.5]),
  divider('yard-tree-left', [-6.6, 1, 8.2], [0.45, 1, 0.45]),
  divider('yard-tree-right', [7.6, 1, 8], [0.45, 1, 0.45]),
  divider('yard-bench', [4, 0.5, 9.5], [1.5, 0.5, 0.45]),

];

export function isOnWorldFloor(point: WorldPoint, greenhouseOpen: boolean): boolean {
  if (!greenhouseOpen && point.x > 5.1 && point.x < 10.1 && Math.abs(point.z) < 3.1) return false;
  return point.x >= WORLD_BOUNDS.minX && point.x <= WORLD_BOUNDS.maxX && point.z >= WORLD_BOUNDS.minZ && point.z <= WORLD_BOUNDS.maxZ;
}

export function getWorldArea(point: WorldPoint): string {
  if (point.z > 5) return 'حیاط خانه';
  if (point.x < -5) return 'اتاق آرام';
  if (point.x > 5) return 'گلخانه';
  if (point.z < -5) return point.x < 0 ? 'آشپزخانه' : 'اتاق نشیمن';
  return 'اتاق یادگیری';
}
