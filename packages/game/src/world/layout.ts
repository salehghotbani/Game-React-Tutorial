import type { Vector3Tuple } from '@react-quest/shared';

export type WorldPoint = { x: number; z: number };
export type WorldCollider = { id: string; position: Vector3Tuple; halfExtents: Vector3Tuple };
export type FloorArea = { id: string; x: number; z: number; width: number; depth: number };

export const WORLD_BOUNDS = { minX: -75, maxX: 75, minZ: -55, maxZ: 75 };
export const GAME_NET = { requiredXp: 1000, sessionSeconds: 180 };
export const MEADOW_TREES = [[-35, -8], [43, -19], [-51, 42], [38, 55], [0, -35], [-47, -30], [57, 3], [-60, 9], [61, 57], [-24, 59], [18, -36], [-61, 62]] as const;

export const FLOOR_AREAS: FloorArea[] = [
  { id: 'studio', x: 0, z: 0, width: 10.4, depth: 10.4 },
  { id: 'upstairs', x: 0, z: -8.5, width: 10.4, depth: 7 },
  { id: 'quiet-room', x: -7.6, z: 0, width: 5.2, depth: 10.4 },
  { id: 'yard', x: 0, z: 8.5, width: 20.4, depth: 7 },
  { id: 'street', x: 0, z: 15.5, width: 150, depth: 7 },
  { id: 'game-net', x: -15, z: 7.5, width: 9, depth: 7 },
  { id: 'game-net-apron', x: -15, z: 11.5, width: 9, depth: 1.2 },
  { id: 'east-walk', x: 15.5, z: 8.5, width: 11, depth: 7 },
  { id: 'south-walk', x: 0, z: 23, width: 42, depth: 8 },
  { id: 'country-road', x: 0, z: 36, width: 176, depth: 8 },
  { id: 'road-link', x: 31, z: 25.5, width: 7, depth: 13 },
  { id: 'parking', x: 24, z: 25, width: 6, depth: 12 }
];

export const WORLD_CEILINGS: WorldCollider[] = FLOOR_AREAS
  .filter(area => ['studio', 'upstairs', 'quiet-room', 'game-net'].includes(area.id))
  .map(area => ({ id: `${area.id}-ceiling`, position: [area.x, 3.06, area.z], halfExtents: [area.width / 2, 0.06, area.depth / 2] }));

export const NEIGHBORS = [
  { id: 'child', name: 'نیما · کودک', position: [-2.5, 0, 8] as Vector3Tuple, scale: 0.7, color: '#dc9d65', hair: '#544131', phrases: ['سلام همسایه!', 'بازی کنیم؟'] },
  { id: 'adult', name: 'سارا · همسایه', position: [5.5, 0, 15] as Vector3Tuple, scale: 1, color: '#7696bb', hair: '#423a37', phrases: ['موفق باشی!', 'چه خبر؟'] },
  { id: 'grandmother', name: 'مادربزرگ', position: [-8, 0, 15.5] as Vector3Tuple, scale: 0.93, color: '#ac8bb0', hair: '#d8d4ce', phrases: ['آفرین عزیزم!', 'خسته نباشی!'] },
  { id: 'grandfather', name: 'پدربزرگ', position: [11, 0, 18] as Vector3Tuple, scale: 0.98, color: '#8a9e7d', hair: '#e1ded6', phrases: ['سلام جوان!', 'آرام باش!'] }
] as const;
export type NeighborId = typeof NEIGHBORS[number]['id'];

export const NEIGHBOR_HOUSES = [
  { x: -14, z: 23, width: 8, depth: 6, color: '#d6b294', roof: '#a76f5c' },
  { x: -3, z: 23.5, width: 8, depth: 6, color: '#b5c4ad', roof: '#6e8a83' },
  { x: 9, z: 23.5, width: 8, depth: 6, color: '#d9c9a6', roof: '#a48c70' },
  { x: 16, z: 6.5, width: 7, depth: 5, color: '#b7c8d0', roof: '#748a97' }
];

const divider = (id: string, position: Vector3Tuple, halfExtents: Vector3Tuple): WorldCollider => ({ id, position, halfExtents });

export const NEIGHBORHOOD_COLLIDERS: WorldCollider[] = [
  // Moderate physics tiles keep character contact precision stable across the enlarged meadow.
  ...Array.from({ length: 30 }, (_, i) => divider(`meadow-ground-${i}-floor`, [-62.5 + i % 6 * 25, -0.11, -42 + Math.floor(i / 6) * 26], [12.5, 0.1, 13])),
  ...WORLD_CEILINGS,
  ...FLOOR_AREAS.filter(area => area.id !== 'studio').map(area => divider(`${area.id}-floor`, [area.x, -0.1, area.z], [area.width / 2, 0.1, area.depth / 2])),
  divider('world-west', [-75, 2, 10], [0.15, 2, 65]),
  divider('world-east', [75, 2, 10], [0.15, 2, 65]),
  divider('world-north', [0, 2, -55], [75, 2, 0.15]),
  divider('world-south', [0, 2, 75], [75, 2, 0.15]),
  ...MEADOW_TREES.map(([x, z], index) => divider(`meadow-tree-${index}`, [x, 1.5, z], [0.4, 1.5, 0.4])),
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
  divider('net-west', [-19.5, 1.5, 7.5], [0.12, 1.5, 3.5]),
  divider('net-east', [-10.5, 1.5, 7.5], [0.12, 1.5, 3.5]),
  divider('net-north', [-15, 1.5, 4], [4.5, 1.5, 0.12]),
  divider('net-front-left', [-17.8, 1.5, 11], [1.7, 1.5, 0.12]),
  divider('net-front-right', [-12.2, 1.5, 11], [1.7, 1.5, 0.12]),
  divider('net-desks', [-15, 0.8, 5.1], [3.1, 0.8, 0.6]),
  ...[-17.2, -15, -12.8].map(x => divider(`net-chair-${x}`, [x, 0.6, 6.2], [0.35, 0.6, 0.4])),
  ...NEIGHBOR_HOUSES.map((house, index) => divider(`neighbor-house-${index}`, [house.x, 2, house.z], [house.width / 2, 2, house.depth / 2])),
  ...NEIGHBORS.map(person => divider(`neighbor-${person.id}`, [person.position[0], 0.65, person.position[2]], [0.27 * person.scale, 0.65, 0.27 * person.scale]))
];

export function isOnWorldFloor(point: WorldPoint, greenhouseOpen: boolean): boolean {
  if (!greenhouseOpen && point.x > 5.1 && point.x < 10.1 && Math.abs(point.z) < 3.1) return false;
  return point.x >= WORLD_BOUNDS.minX && point.x <= WORLD_BOUNDS.maxX && point.z >= WORLD_BOUNDS.minZ && point.z <= WORLD_BOUNDS.maxZ;
}

export function getWorldArea(point: WorldPoint): string {
  if (point.z >= 32 && point.z <= 40 || point.x >= 27.5 && point.x <= 34.5 && point.z >= 19 && point.z <= 32) return 'جادهٔ دشت';
  if (point.x >= 21 && point.x <= 27 && point.z >= 19 && point.z <= 31) return 'پارکینگ محله';
  if (Math.abs(point.x) > 21 || point.z < -13 || point.z > 27) return 'دشت آفتاب';
  if (point.x < -10.5 && point.z < 11.5 && point.z > 3.5) return 'گیم‌نت محله';
  if (point.z > 12) return 'کوچهٔ یادگیری';
  if (point.z > 5) return 'حیاط خانه';
  if (point.x < -5) return 'اتاق آرام';
  if (point.x > 5) return 'گلخانه';
  if (point.z < -5) return point.x < 0 ? 'آشپزخانه' : 'اتاق نشیمن';
  return 'اتاق یادگیری';
}
