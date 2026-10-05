import { createContext, useContext } from 'react';
import type { Language } from '@react-quest/localization';

export type LanguageSelection = Language | 'auto';
type LocaleSettings = { selection: LanguageSelection; choose: (language: LanguageSelection) => void; country: string | null };
export const LocaleContext = createContext<LocaleSettings>({ selection: 'auto', choose: () => {}, country: null });
export const useLocaleSettings = () => useContext(LocaleContext);
