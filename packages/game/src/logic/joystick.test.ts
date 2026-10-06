import { describe, expect, it } from 'vitest';
import { getJoystickState } from './joystick';

describe('touch joystick', () => {
  it('stays still in the dead zone while following the thumb visually', () => {
    expect(getJoystickState(0, 0, 44)).toEqual({ x: 0, z: 0, offsetX: 0, offsetY: 0 });
    const small = getJoystickState(3, -2, 44);
    expect(small.x).toBe(0); expect(small.z).toBe(-0);
    expect(small.offsetX).toBeCloseTo(3); expect(small.offsetY).toBeCloseTo(-2);
  });
  it('resolves screen directions independently of the language', () => {
    expect(getJoystickState(0, -44, 44).z).toBe(-1);
    expect(getJoystickState(0, 44, 44).z).toBe(1);
    expect(getJoystickState(-44, 0, 44).x).toBe(-1);
    expect(getJoystickState(44, 0, 44).x).toBe(1);
  });
  it('scales speed continuously after the dead zone', () => {
    expect(getJoystickState(0, -22, 44).z).toBeCloseTo(-0.38 / 0.88);
    expect(Math.abs(getJoystickState(0, -30, 44).z)).toBeGreaterThan(Math.abs(getJoystickState(0, -22, 44).z));
  });
  it('clamps travel and speed to a circle even outside the captured control', () => {
    const diagonal = getJoystickState(300, -300, 44);
    expect(Math.hypot(diagonal.x, diagonal.z)).toBeCloseTo(1);
    expect(Math.hypot(diagonal.offsetX, diagonal.offsetY)).toBeCloseTo(44);
    expect(diagonal.x).toBeCloseTo(-diagonal.z);
  });
  it('rejects unusable geometry and coordinates', () => {
    for (const [x, y, radius] of [[Infinity, 1, 44], [1, NaN, 44], [1, 2, 0], [1, 2, -1], [1, 2, Infinity]]) {
      expect(getJoystickState(x!, y!, radius!)).toEqual({ x: 0, z: 0, offsetX: 0, offsetY: 0 });
    }
  });
});
