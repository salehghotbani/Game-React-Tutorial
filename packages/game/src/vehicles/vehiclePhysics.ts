import { Capsule, Cuboid, QueryFilterFlags, type World, type Shape, type Vector, type Rotation, type RigidBody } from '@dimforge/rapier3d-compat';
import { PLAYER_CONFIG } from '../config';
import { CAR, exitCandidates, yawRotation, type VehicleState } from './driving';

export function isShapeFree(world: World, shape: Shape, position: Vector, rotation: Rotation, ownBody: RigidBody, groups: number): boolean {
  let free = true;
  world.intersectionsWithShape(position, rotation, shape, () => { free = false; return false; }, QueryFilterFlags.EXCLUDE_SENSORS, groups, undefined, ownBody);
  return free;
}

export function canTurn(world: World, body: RigidBody, yaw: number, groups: number): boolean {
  return isShapeFree(world, new Cuboid(CAR.halfWidth, CAR.halfHeight, CAR.halfLength), body.translation(), yawRotation(yaw), body, groups);
}

export function safeExit(world: World, body: RigidBody, state: VehicleState, groups: number): Vector | undefined {
  const capsule = new Capsule(PLAYER_CONFIG.capsuleHalfHeight, PLAYER_CONFIG.capsuleRadius);
  return exitCandidates(state).find(point => isShapeFree(world, capsule, point, { x: 0, y: 0, z: 0, w: 1 }, body, groups));
}
