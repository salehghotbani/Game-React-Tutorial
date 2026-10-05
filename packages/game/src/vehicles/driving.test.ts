import { describe, expect, it } from 'vitest';
import { CAR, canDrive, initialVehicleState, stepDriving, exitCandidates, trafficPosition } from './driving';
import { findCarApproach } from './vehicleNavigation';
import { terrainHeight, isMeadowPlanting } from '../world/terrain';

const input = { forward: false, backward: false, left: false, right: false, brake: false };
describe('driving and expanded landscape', () => {
  it('unlocks at 2000 earned XP and rejects invalid totals', () => {
    for (const xp of [1999, -1, NaN, Infinity]) expect(canDrive(xp)).toBe(false);
    expect(canDrive(2000)).toBe(true); expect(canDrive(3500)).toBe(true);
  });
  it('accelerates and limits forward/reverse speed independently of walking settings', () => {
    let car = initialVehicleState();
    for (let i = 0; i < 300; i++) car = stepDriving(car, { ...input, forward: true }, 1 / 60);
    expect(car.speed).toBe(CAR.maxSpeed); expect(car.z).toBeGreaterThan(55);
    for (let i = 0; i < 300; i++) car = stepDriving(car, { ...input, backward: true }, 1 / 60);
    expect(car.speed).toBe(-CAR.reverseSpeed);
  });
  it('brakes to rest, steers only in motion and reverses steering direction', () => {
    const parked = initialVehicleState();
    expect(stepDriving(parked, { ...input, left: true }, 1 / 60).yaw).toBe(parked.yaw);
    expect(stepDriving({ ...parked, speed: 5 }, { ...input, forward: true, left: true }, 1 / 60).yaw).toBeGreaterThan(parked.yaw);
    expect(stepDriving({ ...parked, speed: -3 }, { ...input, backward: true, left: true }, 1 / 60).yaw).toBeLessThan(parked.yaw);
    let car = { ...parked, speed: 12 };
    for (let i = 0; i < 45; i++) car = stepDriving(car, { ...input, brake: true }, 1 / 60);
    expect(car.speed).toBe(0);
  });
  it('does not integrate a background stall or invalid time into a teleport', () => {
    const car = { ...initialVehicleState(), speed: 12 };
    expect(Math.hypot(stepDriving(car, input, 60).x - car.x, stepDriving(car, input, 60).z - car.z)).toBeLessThan(0.61);
    expect(stepDriving(car, input, NaN)).toEqual(car);
    expect(stepDriving({ ...car, x: NaN }, input, 0.02)).toEqual(initialVehicleState());
  });
  it('offers reachable car doors and keeps exits inside the physical world', () => {
    const car = initialVehicleState();
    const approach = findCarApproach({ x: 0, z: 2.2 }, car, false, false);
    expect(approach).toBeDefined();
    expect(Math.hypot(approach!.x - car.x, approach!.z - car.z)).toBeLessThan(2);
    for (const point of exitCandidates({ ...car, x: 74, z: 74 })) { expect(point.x).toBeLessThan(74.4); expect(point.z).toBeLessThan(74.4); }
  });
  it('keeps the walkable field level and planting clear of both roads', () => {
    for (const [x, z] of [[0, 0], [74, 74], [-74, -54], [24, 25]]) expect(terrainHeight(x!, z!)).toBe(-0.08);
    expect(terrainHeight(-125, -105)).toBeGreaterThan(40);
    expect(isMeadowPlanting(45, 15)).toBe(false); expect(isMeadowPlanting(-50, 36)).toBe(false);
    expect(isMeadowPlanting(-45, -20)).toBe(true);
  });
  it('wraps traffic beyond playable limits in both directions', () => {
    expect(trafficPosition(86.99, 1, 7, 1 / 60)).toBe(-87);
    expect(trafficPosition(-86.99, -1, 7, 1 / 60)).toBe(87);
    expect(trafficPosition(10, 1, 7, 0)).toBe(10);
  });
});
