import type { Vector3Tuple } from '@react-quest/shared';
import { NEIGHBORHOOD_COLLIDERS, type WorldCollider } from './world/layout';

export const PLAYER_CONFIG = {
  spawn: [0, 0.97, 2.2] as Vector3Tuple,
  speed: 3.2,
  sprintMultiplier: 1.8,
  jumpSpeed: 5.2,
  terminalFallSpeed: 24,
  minSpeed: 1.5,
  maxSpeed: 5,
  capsuleHalfHeight: 0.58,
  capsuleRadius: 0.32,
  collisionOffset: 0.025,
  gravity: 9.81,
  rotationDamping: 12
};

export const CAMERA_CONFIG = {
  firstPersonEyeOffset: 0.67,
  offset: [5.7, 7.7, 8.9] as Vector3Tuple,
  framingOffset: [-0.75, 0, -1.2] as Vector3Tuple,
  lookHeight: 0.45,
  followDamping: 5,
  yaw: Math.atan2(4.5, 7),
  fov: 44
};

export const PHYSICS_TIMESTEP = 1 / 60;

export type RoomCollider = WorldCollider;

// Shared by the scene and headless physics tests: visual cutaways retain full walls.
export const ROOM_COLLIDERS: RoomCollider[] = [
  { id: 'floor', position: [0, -0.1, 0], halfExtents: [5.22, 0.1, 5.22] },
  { id: 'wall-north-left', position: [-2.35, 1.7, -5.1], halfExtents: [2.75, 1.7, 0.12] },
  { id: 'wall-north-right', position: [4, 1.7, -5.1], halfExtents: [1.1, 1.7, 0.12] },
  { id: 'wall-south-left', position: [-3.25, 1.7, 5.1], halfExtents: [1.85, 1.7, 0.12] },
  { id: 'wall-south-right', position: [3.25, 1.7, 5.1], halfExtents: [1.85, 1.7, 0.12] },
  { id: 'wall-west-back', position: [-5.1, 1.7, -1.25], halfExtents: [0.12, 1.7, 3.85] },
  { id: 'wall-west-front', position: [-5.1, 1.7, 4.8], halfExtents: [0.12, 1.7, 0.3] },
  { id: 'wall-east', position: [5.1, 1.7, 0], halfExtents: [0.12, 1.7, 5.22] },
  { id: 'desk', position: [-1.5, 0.73, -3.8], halfExtents: [1.6, 0.73, 0.65] },
  { id: 'chair', position: [-1.5, 0.65, -2.4], halfExtents: [0.48, 0.65, 0.48] },
  { id: 'sofa', position: [-3.95, 0.6, 0], halfExtents: [0.72, 0.6, 1.6] },
  { id: 'bookshelf', position: [3.65, 1.15, -4.48], halfExtents: [0.95, 1.15, 0.32] },
  { id: 'plant', position: [3.95, 0.6, 2.65], halfExtents: [0.4, 0.6, 0.4] },
  { id: 'coffee-table', position: [-2.65, 0.24, 0.35], halfExtents: [0.43, 0.24, 0.65] },
  { id: 'television', position: [3.4, 0.38, -11.5], halfExtents: [1.1, 0.38, 0.28] },
  { id: 'lounge-chair', position: [2.5, 0.58, -9.4], halfExtents: [0.46, 0.58, 0.46] },
  { id: 'key-console', position: [1.9, 0.48, -2.9], halfExtents: [0.4, 0.48, 0.33] }
];

export const ROOM_SPOTS = {
  computer: { position: [-1.5, 0, -2.4], approach: { x: -1.5, z: -1.35 } },
  books: { position: [3.65, 0, -4.48], approach: { x: 4.05, z: -3.6 } },
  sofa: { position: [-3.95, 0, 0], approach: { x: -2.6, z: -0.9 } },
  plant: { position: [3.95, 0, 2.65], approach: { x: 3.95, z: 1.65 } },
  television: { position: [2.5, 0, -9.4], approach: { x: 1.4, z: -9 } },
  key: { position: [1.9, 0, -2.9], approach: { x: 0.95, z: -2.9 } },
  door: { position: [4.98, 0, 0], approach: { x: 4.05, z: 0 } },
  greenhouse: { position: [7.25, 0, 0], approach: { x: 7.25, z: 0 } },
  arcade: { position: [3.9, 0, -1.6], approach: { x: 2.85, z: -1.6 } },
  yard: { position: [0, 0, 8.5], approach: { x: 0, z: 8.5 } },
  kitchen: { position: [-2, 0, -7], approach: { x: -2, z: -7 } },
  quietRoom: { position: [-7, 0, 2.5], approach: { x: -7, z: 2.5 } },
} satisfies Record<string, { position: Vector3Tuple; approach: { x: number; z: number } }>;

export type RoomSpotId = keyof typeof ROOM_SPOTS;
export const TV_SEAT = { x: 2.5, y: 0.92, z: -9.4 };
export const TV_HEADING = Math.atan2(3.4 - TV_SEAT.x, -11.5 - TV_SEAT.z);
export const SOFA_SEAT = { x: -3.95, y: 1.10, z: -0.35 };
export const SOFA_HEADING = Math.PI / 2;

const GREENHOUSE_COLLIDERS: RoomCollider[] = [
  { id: 'greenhouse-floor', position: [7.5, -0.1, 0], halfExtents: [2.5, 0.1, 3] },
  { id: 'greenhouse-east', position: [10.1, 1.7, 0], halfExtents: [0.12, 1.7, 3.12] },
  { id: 'greenhouse-north', position: [7.6, 1.7, -3.1], halfExtents: [2.5, 1.7, 0.12] },
  { id: 'greenhouse-south', position: [7.6, 1.7, 3.1], halfExtents: [2.5, 1.7, 0.12] },
  { id: 'greenhouse-planter', position: [9.4, 0.6, 0], halfExtents: [0.4, 0.6, 2.3] },
  { id: 'greenhouse-bench', position: [7.3, 0.45, -2.4], halfExtents: [1, 0.45, 0.35] }
];
const OPEN_DOORWAY_COLLIDERS: RoomCollider[] = [
  { id: 'east-upper', position: [5.1, 1.7, -3.22], halfExtents: [0.12, 1.7, 1.88] },
  { id: 'east-lower', position: [5.1, 1.7, 3.22], halfExtents: [0.12, 1.7, 1.88] },
  { id: 'greenhouse-open-door', position: [6.35, 1.25, -1.32], halfExtents: [1.32, 1.25, 0.07] }
];
const ARCADE_COLLIDER: RoomCollider = {
  id: 'arcade', position: [3.9, 1.2, -1.6], halfExtents: [0.58, 1.2, 0.58]
};

export function getRoomColliders(greenhouseOpen = false, arcadeUnlocked = false): RoomCollider[] {
  const studio = ROOM_COLLIDERS.filter(collider => !greenhouseOpen || collider.id !== 'wall-east');
  return [
    ...studio,
    ...NEIGHBORHOOD_COLLIDERS,
    ...GREENHOUSE_COLLIDERS,
    ...(greenhouseOpen ? OPEN_DOORWAY_COLLIDERS : []),
    ...(arcadeUnlocked ? [ARCADE_COLLIDER] : [])
  ];
}
