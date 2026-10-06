import { describe, expect, it } from 'vitest';
import { dampAngle, getMovement } from './movement';
import type { MovementInput } from '@react-quest/shared';

const idle: MovementInput = { forward: false, backward: false, left: false, right: false };

describe('camera-relative movement', () => {
  it('stays still without input and cancels opposing keys', () => {
    expect(getMovement(idle, 0.8, 3.2)).toEqual({ x: 0, z: 0 });
    expect(getMovement({ forward: true, backward: true, left: true, right: true }, 0, 3)).toEqual({ x: 0, z: 0 });
  });
  it('maps forward to the camera ground direction', () => {
    const result = getMovement({ ...idle, forward: true }, Math.PI / 2, 3);
    expect(result.x).toBeCloseTo(-3);
    expect(result.z).toBeCloseTo(0);
  });
  it('normalizes diagonals so two keys do not increase speed', () => {
    const result = getMovement({ ...idle, forward: true, right: true }, 0.6, 3.2);
    expect(Math.hypot(result.x, result.z)).toBeCloseTo(3.2);
  });
  it('uses the configured speed', () => {
    expect(getMovement({ ...idle, right: true }, 0, 1.5).x).toBe(1.5);
    expect(getMovement({ ...idle, right: true }, 0, 5).x).toBe(5);
  });
  it('preserves analog speed and rotates it with the camera', () => {
    const result = getMovement({ ...idle, analog: { x: 0, z: -0.4 } }, Math.PI / 2, 5);
    expect(result.x).toBeCloseTo(-2); expect(result.z).toBeCloseTo(0);
  });
  it('caps analog diagonal speed and stops when the joystick returns to center', () => {
    expect(Math.hypot(...Object.values(getMovement({ ...idle, analog: { x: 1, z: 1 } }, 0.3, 3)))).toBeCloseTo(3);
    expect(getMovement({ ...idle, analog: { x: 0, z: 0 } }, 0.3, 3)).toEqual({ x: 0, z: 0 });
    expect(getMovement({ ...idle, analog: { x: NaN, z: 0 } }, 0, 3)).toEqual({ x: 0, z: 0 });
  });
  it('keeps keyboard movement at full speed when a joystick is also active', () => {
    expect(getMovement({ ...idle, right: true, analog: { x: -0.7, z: -0.5 } }, 0, 3)).toEqual({ x: 3, z: 0 });
  });
  it('rotates by the shortest path across the angle seam', () => {
    const result = dampAngle(Math.PI - 0.1, -Math.PI + 0.1, 12, 1 / 60);
    expect(result).toBeGreaterThan(Math.PI - 0.1);
    expect(result).toBeLessThan(Math.PI + 0.1);
  });
  it('has frame-rate-independent damping', () => {
    const oneStep = dampAngle(0, 1, 12, 1 / 30);
    const twoSteps = dampAngle(dampAngle(0, 1, 12, 1 / 60), 1, 12, 1 / 60);
    expect(twoSteps).toBeCloseTo(oneStep);
  });
});
