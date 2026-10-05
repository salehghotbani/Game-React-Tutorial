import type { ThemeMode } from '@react-quest/shared';

export const THEME_OPTIONS: { id: ThemeMode; title: string; description: string; symbol: string }[] = [
  { id: 'light', title: 'روشن', description: 'نور روز و پنجره‌های روشن', symbol: '☀' },
  { id: 'dark', title: 'تاریک', description: 'فضای شب و نور گرم چراغ‌ها', symbol: '☾' },
  { id: 'auto', title: 'با ساعت سرور', description: 'روز روشن، شب تاریک؛ به وقت تهران', symbol: '◷' }
];
