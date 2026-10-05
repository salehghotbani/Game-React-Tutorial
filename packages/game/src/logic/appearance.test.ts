import { describe, expect, it } from 'vitest';
import { resolveTheme, worldDaylight } from './appearance';

describe('user-selected and server-timed appearance', () => {
  const noon = Date.parse('2026-10-04T08:30:00Z');
  const night = Date.parse('2026-10-04T18:30:00Z');
  it('honors explicit light and dark choices at any server time', () => {
    expect(resolveTheme(night, 'light')).toBe('light');
    expect(worldDaylight(night, 'light')).toBe(1);
    expect(resolveTheme(noon, 'dark')).toBe('dark');
    expect(worldDaylight(noon, 'dark')).toBe(0);
  });
  it('uses Tehran day and night from the supplied server timestamp in automatic mode', () => {
    expect(resolveTheme(noon, 'auto')).toBe('light');
    expect(worldDaylight(noon, 'auto')).toBeCloseTo(1);
    expect(resolveTheme(night, 'auto')).toBe('dark');
    expect(resolveTheme(null, 'auto')).toBe('dark');
  });
});
