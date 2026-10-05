import RAPIER from '@dimforge/rapier3d-compat';
import { beforeAll, describe, expect, it } from 'vitest';
import { PHYSICS_TIMESTEP, PLAYER_CONFIG, getRoomColliders } from '../config';

beforeAll(async () => { await RAPIER.init(); });

function simulate(start: [number, number, number], velocity: { x: number; z: number }, steps = 360, greenhouseOpen=false) {
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = PHYSICS_TIMESTEP;
  for (const { position, halfExtents } of getRoomColliders(greenhouseOpen)) {
    world.createCollider(RAPIER.ColliderDesc.cuboid(...halfExtents).setTranslation(...position));
  }
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...start));
  const collider = world.createCollider(RAPIER.ColliderDesc.capsule(PLAYER_CONFIG.capsuleHalfHeight, PLAYER_CONFIG.capsuleRadius), body);
  const controller = world.createCharacterController(PLAYER_CONFIG.collisionOffset);
  controller.setSlideEnabled(true);
  controller.enableSnapToGround(0.15);
  world.step();
  for (let i = 0; i < steps; i++) {
    controller.computeColliderMovement(collider, { x: velocity.x * PHYSICS_TIMESTEP, y: -9.81 * PHYSICS_TIMESTEP, z: velocity.z * PHYSICS_TIMESTEP });
    const corrected = controller.computedMovement();
    const current = body.translation();
    body.setNextKinematicTranslation({ x: current.x + corrected.x, y: current.y + corrected.y, z: current.z + corrected.z });
    world.step();
  }
  const position = { ...body.translation() };
  world.free();
  return position;
}

describe('Rapier player collision against the scene geometry', () => {
  it.each([
    ['north', [1, PLAYER_CONFIG.spawn[1], 2], { x: 0, z: -5 }, 'z', -11.63],
    ['south', [19, PLAYER_CONFIG.spawn[1], 15], { x: 0, z: 5 }, 'z', 26.00],
    ['west', [1, PLAYER_CONFIG.spawn[1], 2], { x: -5, z: 0 }, 'x', -4.63],
    ['east', [1, PLAYER_CONFIG.spawn[1], 2], { x: 5, z: 0 }, 'x', 4.63]
  ] as const)('cannot walk through the %s wall at maximum speed', (_, start, velocity, axis, boundary) => {
    const position = simulate([...start], velocity);
    expect(Math.abs(position[axis])).toBeLessThan(Math.abs(boundary) + 0.03);
    expect(position[axis]).toBeCloseTo(boundary, 1);
    expect(position.y).toBeGreaterThan(0.88);
  });
  it('stops in front of the chair instead of walking through it', () => {
    const position = simulate([-1.5, PLAYER_CONFIG.spawn[1], 0], { x: 0, z: -3.2 });
    expect(position.z).toBeGreaterThan(-1.61);
    expect(position.z).toBeLessThan(-1.5);
  });
  it('stops at the desk', () => {
    const position = simulate([-0.5, PLAYER_CONFIG.spawn[1], -1.5], { x: 0, z: -5 });
    expect(position.z).toBeGreaterThan(-2.82);
    expect(position.z).toBeLessThan(-2.7);
  });
  it('slides along walls during diagonal movement and remains inside a corner', () => {
    // The southeast corner now contains the television cabinet; use the clear southwest corner.
    const position = simulate([-2, PLAYER_CONFIG.spawn[1], 2], { x: -3.53, z: 3.53 });
    expect(position.x).toBeCloseTo(-4.63, 1);
    expect(position.z).toBeCloseTo(4.63, 1);
  });
  it('keeps the capsule grounded while idle', () => {
    const position = simulate([0, PLAYER_CONFIG.spawn[1], 2.2], { x: 0, z: 0 });
    expect(position.x).toBeCloseTo(0);
    expect(position.z).toBeCloseTo(2.2);
    expect(position.y).toBeCloseTo(0.925, 2);
  });
  it('cannot run through a solid wall at the highest sprint speed', () => {
    expect(simulate([1, PLAYER_CONFIG.spawn[1], 2], { x: 9, z: 0 }).x).toBeCloseTo(4.63, 1);
  });
  it('blocks the locked greenhouse and allows crossing the doorway once opened',()=>{
    expect(simulate([0,PLAYER_CONFIG.spawn[1],0],{x:5,z:0}).x).toBeCloseTo(4.63,1);
    const open=simulate([0,PLAYER_CONFIG.spawn[1],0],{x:5,z:0},360,true);
    expect(open.x).toBeGreaterThan(7.2);
    expect(open.x).toBeLessThan(8.7);
    expect(open.y).toBeCloseTo(.925,2);
    expect(simulate([12, PLAYER_CONFIG.spawn[1], 0], { x: -5, z: 0 }).x).toBeGreaterThan(10.4);
  });
  it('crosses the front entrance into the yard and street while remaining grounded', () => {
    const position = simulate([0, PLAYER_CONFIG.spawn[1], 2.2], { x: 0, z: 5 }, 300);
    expect(position.z).toBeGreaterThan(15);
    expect(position.y).toBeCloseTo(0.925, 2);
  });
  it('allows the quiet-room doorway while blocking solid courtyard fences', () => {
    const quietRoom = simulate([0, PLAYER_CONFIG.spawn[1], 3.5], { x: -5, z: 0 });
    expect(quietRoom.x).toBeLessThan(-7);
    expect(quietRoom.y).toBeCloseTo(0.925, 2);
    expect(simulate([5.5, PLAYER_CONFIG.spawn[1], 10], { x: 0, z: 5 }).z).toBeCloseTo(11.53, 1);
  });
});
