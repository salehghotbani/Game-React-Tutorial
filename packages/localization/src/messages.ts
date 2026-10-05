import english from './en.json' with { type: 'json' };

export type Language = 'fa' | 'en';
export const LANGUAGE_KEY = 'react-quest-language-v1';
export const messages: Readonly<Record<string, string>> = english;
const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = Object.entries(messages).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => ({
  expression: new RegExp(`^${key.split(/\{\d+\}/).map(escapePattern).join('([\\s\\S]*?)')}$`), value
}));

/** Canonical authored text is Persian. Code, identifiers and learner input remain unchanged. */
export function translate(text: string, language: Language): string {
  if (language === 'fa' || !/[\u0600-\u06ff]/.test(text)) return text;
  const trimmed = text.trim();
  let translated = messages[trimmed];
  if (translated === undefined) {
    for (const template of templates) {
      const match = template.expression.exec(trimmed);
      if (!match) continue;
      translated = template.value.replace(/\{(\d+)\}/g, (_, index: string) => translate(match[Number(index) + 1] ?? '', language));
      break;
    }
  }
  if (translated === undefined && trimmed.includes('،')) translated = trimmed.split('،').map(part => translate(part.trim(), language)).join(', ');
  return translated === undefined ? text : text.slice(0, text.indexOf(trimmed)) + translated + text.slice(text.indexOf(trimmed) + trimmed.length);
}

/** Localize text children without altering React elements, numbers or code objects. */
export function translateText<T>(value: T, language: Language): T {
  return (typeof value === 'string' ? translate(value, language) : value) as T;
}

export function readLanguage(value: unknown): Language | null {
  return value === 'fa' || value === 'en' ? value : null;
}
export function languageForCountry(country: unknown): Language | null {
  if (typeof country !== 'string' || !/^[A-Z]{2}$/i.test(country) || ['XX', 'ZZ'].includes(country.toUpperCase())) return null;
  return country.toUpperCase() === 'IR' ? 'fa' : 'en';
}
