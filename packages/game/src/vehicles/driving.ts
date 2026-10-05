import type { MovementInput } from '@react-quest/shared';
import { WORLD_BOUNDS, type WorldCollider } from '../world/layout';

export const CAR = { requiredXp: 2000, halfWidth: 0.87, halfLength: 1.9, halfHeight: 0.72, centerHeight: 0.76, maxSpeed: 12, reverseSpeed: 4, driverEye: [-0.38, 0.5, 0.06] as const };
export type VehicleState = { x: number; y: number; z: number; yaw: number; speed: number };
export const initialVehicleState = (): VehicleState => ({ x: 24, y: CAR.centerHeight, z: 25, yaw: Math.PI, speed: 0 });
export const canDrive = (xp: number) => Number.isFinite(xp) && xp >= CAR.requiredXp;
export const yawRotation = (yaw: number) => ({ x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) });

export function stepDriving(state: VehicleState, input: MovementInput & { brake: boolean }, seconds: number): VehicleState {
  if (!Object.values(state).every(Number.isFinite)) return initialVehicleState();
  if (!Number.isFinite(seconds) || seconds <= 0) return { ...state };
  const dt = Math.min(seconds, 0.05);
  const throttle = Number(input.forward) - Number(input.backward);
  let speed = state.speed;
  if (input.brake || !throttle) {
    const amount = (input.brake ? 18 : 2.4) * dt;
    speed = Math.sign(speed) * Math.max(0, Math.abs(speed) - amount);
  } else {
    const acceleration = Math.sign(speed) && Math.sign(speed) !== throttle ? 12 : 5;
    speed = Math.max(-CAR.reverseSpeed, Math.min(CAR.maxSpeed, speed + throttle * acceleration * dt));
  }
  const steering = Number(input.left) - Number(input.right);
  const yaw = state.yaw + steering * Math.sign(speed) * Math.min(Math.abs(speed) / 4, 1) * 1.25 * dt;
  return { ...state, yaw, speed, x: state.x - Math.sin(yaw) * speed * dt, z: state.z - Math.cos(yaw) * speed * dt };
}

export function vehicleObstacle(state: VehicleState): WorldCollider {
  const c = Math.abs(Math.cos(state.yaw)), s = Math.abs(Math.sin(state.yaw));
  return { id: 'parked-car', position: [state.x, state.y, state.z], halfExtents: [c * CAR.halfWidth + s * CAR.halfLength, CAR.halfHeight, s * CAR.halfWidth + c * CAR.halfLength] };
}

export function exitCandidates(state: VehicleState): { x: number; y: number; z: number }[] {
  return [[-1.65, 0], [1.65, 0], [0, 2.6], [0, -2.6]].map(([x = 0, z = 0]) => ({
    x: state.x + x * Math.cos(state.yaw) + z * Math.sin(state.yaw),
    y: 0.97,
    z: state.z - x * Math.sin(state.yaw) + z * Math.cos(state.yaw)
  })).filter(point => point.x > WORLD_BOUNDS.minX + 0.6 && point.x < WORLD_BOUNDS.maxX - 0.6 && point.z > WORLD_BOUNDS.minZ + 0.6 && point.z < WORLD_BOUNDS.maxZ - 0.6);
}

export function trafficPosition(x: number, direction: number, speed: number, seconds: number): number {
  if (![x, direction, speed, seconds].every(Number.isFinite)) return Number.isFinite(x) ? x : 0;
  const next = x + direction * speed * Math.min(Math.max(seconds, 0), 0.05);
  return next > 87 ? -87 : next < -87 ? 87 : next;
}
