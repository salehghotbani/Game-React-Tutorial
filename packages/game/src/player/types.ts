import type { RefObject } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';

export type PlayerBodyRef = RefObject<RapierRigidBody | null>;
export type PlayerMotion = { speed: number; heading: number; airborne: boolean; running: boolean };
export type PlayerPosition = { x: number; z: number; heading: number; y?: number; cameraYaw?: number };
