import { useSyncExternalStore } from 'react';
import { translate, translateText, type Language } from './messages';
export { LANGUAGE_KEY, readLanguage, languageForCountry, translate, messages } from './messages';
export type { Language } from './messages';
export { translateAuthoredCode } from './authoredCode';

let language: Language = 'fa';
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getLanguage = () => language;
export function setLanguage(next: Language) {
  if (language === next) return;
  language = next;
  listeners.forEach(listener => listener());
}
export function useLanguage() { return useSyncExternalStore(subscribe, getLanguage, () => 'fa' as Language); }
export const t = (text: string) => translate(text, language);
export const tx = <T,>(value: T): T => translateText(value, language);
