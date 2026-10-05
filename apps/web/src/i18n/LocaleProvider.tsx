import { useEffect, useState, type ReactNode } from 'react';
import { LANGUAGE_KEY, languageForCountry, readLanguage, setLanguage, useLanguage, type Language } from '@react-quest/localization';
import { detectCountry } from './detectCountry';
import { LocaleContext, type LanguageSelection } from './localeContext';
import './locale.css';

const fallbackLanguage = (): Language => Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Tehran' || navigator.languages.some(language => /^fa(?:-|$)/i.test(language)) ? 'fa' : 'en';
function savedSelection(): LanguageSelection { try { return readLanguage(localStorage.getItem(LANGUAGE_KEY)) ?? 'auto'; } catch { return 'auto'; } }

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<LanguageSelection>(savedSelection);
  const [country, setCountry] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const language = useLanguage();
  useEffect(() => {
    const controller = new AbortController();
    const complete = (next: Language) => { if (!controller.signal.aborted) { setLanguage(next); setReady(true); } };
    if (selection !== 'auto') complete(selection);
    else {
      void detectCountry(controller.signal).then(result => {
        if (controller.signal.aborted) return;
        setCountry(result);
        complete(languageForCountry(result) ?? fallbackLanguage());
      });
    }
    return () => controller.abort();
  }, [selection]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.title = language === 'fa' ? 'React Quest — یادگیری React' : 'React Quest — Learn React';
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'fa' ? 'React را از صفر در یک محلهٔ سه‌بعدی یاد بگیر، تمرین کن و بساز.' : 'Learn React from scratch in a 3D neighborhood. Read, practice, build and explore.');
  }, [language]);
  const choose = (next: LanguageSelection) => {
    setSelection(next);
    if (next !== 'auto') setLanguage(next);
    try { if (next === 'auto') localStorage.removeItem(LANGUAGE_KEY); else localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Current selection still works without storage. */ }
  };
  return <LocaleContext.Provider value={{ selection, choose, country }}>{ready ? children : <div className="locale-loading"><img src={`${import.meta.env.BASE_URL}site-icon.png`} alt="React Quest" /><p>Loading… / در حال آماده‌سازی…</p></div>}</LocaleContext.Provider>;
}
