import { beforeAll, describe, expect, it } from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import { getRoomColliders, PHYSICS_TIMESTEP } from '../config';
import { CAR, initialVehicleState, stepDriving, yawRotation } from './driving';
import { canTurn, safeExit } from './vehiclePhysics';

const groups = (1 << 2) << 16 | (1 << 0 | 1 << 1 | 1 << 3);
beforeAll(async () => { await RAPIER.init(); });

function setup(x = 24, z = 25, yaw = Math.PI) {
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  for (const c of getRoomColliders(false, false)) world.createCollider(RAPIER.ColliderDesc.cuboid(...c.halfExtents).setTranslation(...c.position)
    .setCollisionGroups(c.id.startsWith('world-') ? (1 << 3) << 16 | (1 << 0 | 1 << 2) : (1 << 0) << 16 | 0xffff));
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(x, CAR.centerHeight, z).setRotation(yawRotation(yaw)));
  const collider = world.createCollider(RAPIER.ColliderDesc.cuboid(CAR.halfWidth, CAR.halfHeight, CAR.halfLength).setCollisionGroups(groups), body);
  const controller = world.createCharacterController(0.025); controller.setSlideEnabled(true);
  world.step();
  return { world, body, collider, controller };
}

describe('actual Rapier vehicle collisions', () => {
  it('crosses parking, road and meadow while remaining grounded, and stops at the far world boundary', () => {
    const { world, body, collider, controller } = setup();
    let state = initialVehicleState();
    let lowest = Infinity;
    for (let i = 0; i < 550; i++) {
      state = stepDriving(state, { forward: true, backward: false, left: false, right: false, brake: false }, PHYSICS_TIMESTEP);
      controller.computeColliderMovement(collider, { x: 0, y: -0.04, z: state.speed * PHYSICS_TIMESTEP }, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, groups);
      const delta = controller.computedMovement(), p = body.translation();
      body.setNextKinematicTranslation({ x: p.x + delta.x, y: p.y + delta.y, z: p.z + delta.z }); world.step();
      lowest = Math.min(lowest, body.translation().y);
    }
    expect(body.translation().z).toBeGreaterThan(72.5); expect(body.translation().z).toBeLessThan(73.1);
    expect(lowest).toBeGreaterThan(0.71);
    world.free();
  });
  it('stops against a house and rejects a turn that would swing into its wall', () => {
    const { world, body, collider, controller } = setup(9, 18, Math.PI);
    for (let i = 0; i < 150; i++) {
      controller.computeColliderMovement(collider, { x: 0, y: -0.04, z: 0.1 }, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, groups);
      const d = controller.computedMovement(), p = body.translation();
      body.setNextKinematicTranslation({ x: p.x + d.x, y: p.y + d.y, z: p.z + d.z }); world.step();
    }
    expect(body.translation().z).toBeLessThan(18.62);
    body.setTranslation({ x: 14.25, y: CAR.centerHeight, z: 23.5 }, true); world.step();
    expect(canTurn(world, body, Math.PI / 2, groups)).toBe(false);
    world.free();
  });
  it('selects a clear exit, rejects surrounded parking, and honors solid traffic', () => {
    const { world, body } = setup();
    const state = initialVehicleState();
    expect(safeExit(world, body, state, groups)).toBeDefined();
    const traffic = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(22.35, 1, 25));
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 1, 1).setCollisionGroups((1 << 1) << 16 | (1 << 0 | 1 << 2)), traffic); world.step();
    expect(safeExit(world, body, state, groups)?.x).not.toBeCloseTo(22.35);
    for (const p of [{ x: 25.65, z: 25 }, { x: 24, z: 22.4 }, { x: 24, z: 27.6 }]) world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 1.5, 0.5).setTranslation(p.x, 1.5, p.z));
    world.step();
    expect(safeExit(world, body, state, groups)).toBeUndefined();
    world.free();
  });
  it('stops passing traffic for a pedestrian and resumes when the lane clears', () => {
    const { world, body, collider, controller } = setup(-20, 38, -Math.PI / 2);
    const trafficGroups = (1 << 1) << 16 | (1 << 0 | 1 << 1 | 1 << 2);
    collider.setCollisionGroups(trafficGroups);
    const pedestrian = world.createCollider(RAPIER.ColliderDesc.capsule(0.58, 0.32).setTranslation(-10, 0.97, 38));
    const boundaryGroups = (1 << 3) << 16 | (1 << 0 | 1 << 2);
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.15, 2, 65).setTranslation(0, 2, 10).setCollisionGroups(boundaryGroups));
    const advance = () => {
      for (let i = 0; i < 250; i++) {
        controller.computeColliderMovement(collider, { x: 0.1, y: 0, z: 0 }, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, trafficGroups);
        const d = controller.computedMovement(), p = body.translation();
        body.setNextKinematicTranslation({ x: p.x + d.x, y: p.y, z: p.z }); world.step();
      }
    };
    world.step(); advance();
    expect(body.translation().x).toBeGreaterThan(-12.5); expect(body.translation().x).toBeLessThan(-12.2);
    world.removeCollider(pedestrian, true); advance();
    expect(body.translation().x).toBeGreaterThan(5);
    world.free();
  });
});
