import type { GameMode, Vector3Tuple } from '@react-quest/shared';
import { SOFA_HEADING, SOFA_SEAT, TV_HEADING, TV_SEAT } from '../config';

export type ActivityPose = {
  seat: { x: number; y: number; z: number };
  heading: number;
  camera: Vector3Tuple;
  target: Vector3Tuple;
};

const COMPUTER_POSE: ActivityPose = {
  seat: { x: -1.5, y: 1.04, z: -2.4 }, heading: Math.PI,
  camera: [-1.35, 2.1, -1.75], target: [-1.4, 2.08, -4.06]
};
const TELEVISION_POSE: ActivityPose = {
  seat: TV_SEAT, heading: TV_HEADING,
  camera: [0.8, 3.2, -7.4], target: [3.4, 1.4, -11.5]
};
const READING_POSE: ActivityPose = {
  seat: SOFA_SEAT, heading: SOFA_HEADING,
  camera: [-0.6, 3, 2.4], target: [-3.95, 1.1, -0.35]
};

export function getActivityPose(mode: GameMode): ActivityPose | undefined {
  if (mode === 'enteringComputer' || mode === 'computer') return COMPUTER_POSE;
  if (mode === 'enteringTV' || mode === 'watching') return TELEVISION_POSE;
  if (mode === 'enteringReading' || mode === 'readingOnSofa') return READING_POSE;
}

export function isEnteringActivity(mode: GameMode): boolean {
  return mode === 'enteringComputer' || mode === 'enteringTV' || mode === 'enteringReading';
}
