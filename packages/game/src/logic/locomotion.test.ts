import RAPIER from '@dimforge/rapier3d-compat';
import { beforeAll, describe, expect, it } from 'vitest';
import { CAMERA_CONFIG, PHYSICS_TIMESTEP, PLAYER_CONFIG, getRoomColliders } from '../config';
import { movementSpeed, nextVerticalVelocity } from './locomotion';

beforeAll(async () => { await RAPIER.init(); });

describe('running and grounded jumping', () => {
  it('runs faster while retaining the selected walking speed', () => {
    expect(movementSpeed(3.2, false)).toBe(3.2);
    expect(movementSpeed(3.2, true)).toBeCloseTo(5.76);
    expect(movementSpeed(5, true)).toBe(9);
  });
  it('rejects another jump in mid-air and limits terminal falling speed', () => {
    const launch = nextVerticalVelocity(0, true, true, PHYSICS_TIMESTEP);
    expect(launch).toBe(PLAYER_CONFIG.jumpSpeed);
    expect(nextVerticalVelocity(launch, false, true, PHYSICS_TIMESTEP)).toBeLessThan(launch);
    expect(nextVerticalVelocity(-100, false, false, PHYSICS_TIMESTEP)).toBe(-PLAYER_CONFIG.terminalFallSpeed);
  });
  it.each(['yard', 'low ceiling', 'house'])('jumps and lands safely on the actual floor in the %s', location => {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    world.timestep = PHYSICS_TIMESTEP;
    for (const { position, halfExtents } of getRoomColliders()) world.createCollider(RAPIER.ColliderDesc.cuboid(...halfExtents).setTranslation(...position));
    if (location === 'low ceiling') world.createCollider(RAPIER.ColliderDesc.cuboid(2, 0.1, 2).setTranslation(0, 2.45, 8.5));
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, PLAYER_CONFIG.spawn[1], location === 'house' ? 2.2 : 8.5));
    const collider = world.createCollider(RAPIER.ColliderDesc.capsule(PLAYER_CONFIG.capsuleHalfHeight, PLAYER_CONFIG.capsuleRadius), body);
    const controller = world.createCharacterController(PLAYER_CONFIG.collisionOffset);
    let velocity = 0, grounded = false, maximum = 0;
    world.step();
    for (let step = 0; step < 180; step++) {
      velocity = nextVerticalVelocity(velocity, grounded, step === 20 || step === 30, PHYSICS_TIMESTEP);
      if (velocity > 0) controller.disableSnapToGround(); else controller.enableSnapToGround(0.15);
      const intended = velocity * PHYSICS_TIMESTEP;
      controller.computeColliderMovement(collider, { x: 0, y: intended, z: 0 });
      const movement = controller.computedMovement();
      grounded = controller.computedGrounded();
      if (grounded && velocity < 0 || velocity > 0 && movement.y < intended - 0.001) velocity = 0;
      const position = body.translation();
      body.setNextKinematicTranslation({ ...position, y: position.y + movement.y });
      world.step();
      maximum = Math.max(maximum, body.translation().y);
    }
    expect(maximum).toBeGreaterThan(1.3);
    expect(maximum).toBeLessThan(location === 'low ceiling' ? 1.47 : location === 'house' ? 2.1 : 2.45);
    if (location === 'house') expect(maximum + CAMERA_CONFIG.firstPersonEyeOffset).toBeLessThan(3);
    // Overlapping yard paving/ground colliders can vary Rapier's contact skin by a few millimetres.
    expect(Math.abs(body.translation().y - 0.925)).toBeLessThan(0.01);
    expect(grounded).toBe(true);
    world.free();
  });
});
