import { createContext, useEffect } from 'react';
import { resolveTheme } from '@react-quest/game';
import type { ThemeMode } from '@react-quest/shared';

export const AppearanceContext = createContext<'light' | 'dark'>('dark');

export function useAppearance(timestamp: number | null, mode: ThemeMode) {
  const theme = resolveTheme(timestamp, mode);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  return theme;
}
