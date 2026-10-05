import english from './en.json' with { type: 'json' };
import type { Language } from './messages';

const examples = Object.entries(english)
  .filter(([source]) => /^(?:export |import |function |const |return |<\w|<\/>|setNumber\(|useEffect\(|fetch\()/.test(source) && /[\u0600-\u06ff]/.test(source))
  .sort(([first], [second]) => second.length - first.length);

/** Only call for our authored starter/example code, never for a learner's saved draft. */
export function translateAuthoredCode(source: string, language: Language): string {
  if (language === 'fa') return source;
  let translated = source;
  for (const [original, english] of examples) translated = translated.replaceAll(original, english);
  return translated;
}
