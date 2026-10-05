import type { ThemeMode } from '@react-quest/shared';
import { getWorldTime } from './worldTime';

export function worldDaylight(timestamp: number | null, theme: ThemeMode) {
  if (theme === 'light') return 1;
  if (theme === 'dark') return 0;
  return timestamp === null ? 0 : getWorldTime(timestamp).daylight;
}

export function resolveTheme(timestamp: number | null, theme: ThemeMode): 'light' | 'dark' {
  return worldDaylight(timestamp, theme) > 0.2 ? 'light' : 'dark';
}
