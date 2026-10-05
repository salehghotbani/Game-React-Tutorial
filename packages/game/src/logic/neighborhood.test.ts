import { describe, expect, it } from 'vitest';
import { canUseGameNet, gameNetSecondsLeft } from './gameNet';
import { getWorldTime } from './worldTime';
import { getWorldArea, isOnWorldFloor } from '../world/layout';

describe('neighborhood rules', () => {
  it('requires earned XP and rejects non-finite totals', () => {
    expect(canUseGameNet(999)).toBe(false);
    expect(canUseGameNet(1000)).toBe(true);
    expect(canUseGameNet(1600)).toBe(true);
    expect(canUseGameNet(Infinity)).toBe(false);
    expect(canUseGameNet(NaN)).toBe(false);
  });
  it('counts a fixed three-minute session through pauses and overdue ticks', () => {
    const startedAt = 5000;
    const deadline = startedAt + 180000;
    expect(gameNetSecondsLeft(deadline, startedAt)).toBe(180);
    expect(gameNetSecondsLeft(deadline, startedAt + 100001)).toBe(80);
    expect(gameNetSecondsLeft(deadline, deadline)).toBe(0);
    expect(gameNetSecondsLeft(deadline, deadline + 60000)).toBe(0);
  });
  it('derives wall-clock hands and day/night from server UTC in Tehran', () => {
    const noon = Date.parse('2026-10-04T08:30:00Z');
    expect(getWorldTime(noon)).toMatchObject({ hour: 12, minute: 0, daylight: 1 });
    expect(getWorldTime(noon).hourAngle).toBeCloseTo(0);
    const midnight = Date.parse('2026-10-03T20:30:00Z');
    expect(getWorldTime(midnight)).toMatchObject({ hour: 0, minute: 0, daylight: 0 });
  });
  it('distinguishes physical areas and rejects unsupported floor destinations', () => {
    expect(getWorldArea({ x: 0, z: 15 })).toBe('کوچهٔ یادگیری');
    expect(getWorldArea({ x: -15, z: 7 })).toBe('گیم‌نت محله');
    expect(isOnWorldFloor({ x: 7, z: 0 }, false)).toBe(false);
    expect(isOnWorldFloor({ x: 7, z: 0 }, true)).toBe(true);
    expect(isOnWorldFloor({ x: 22, z: -10 }, true)).toBe(true);
    expect(isOnWorldFloor({ x: 76, z: -10 }, true)).toBe(false);
    expect(getWorldArea({ x: 0, z: 36 })).toBe('جادهٔ دشت');
    expect(getWorldArea({ x: -32, z: -18 })).toBe('دشت آفتاب');
  });
});
