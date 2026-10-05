import { tx, useLanguage } from '@react-quest/localization';
import { useEffect, useRef } from 'react';
import type { ThemeMode } from '@react-quest/shared';
import { THEME_OPTIONS } from './themeOptions';
import { LanguageSelect } from '../i18n/LanguageSelect';

export function ThemePicker({ onChoose }: { onChoose: (theme: ThemeMode) => void }) {
  useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return <dialog className="theme-picker" ref={dialog} aria-labelledby="theme-picker-title" onCancel={event => event.preventDefault()}>
    <span className="theme-picker-eyebrow">REACT QUEST</span>
    <h1 id="theme-picker-title">{tx("محله را با چه نوری ببینی؟")}</h1>
    <p>{tx("ظاهر دلخواهت را انتخاب کن. هر وقت بخواهی از تنظیمات تغییرش می‌دهی.")}</p>
    <LanguageSelect />
    <div className="theme-options">{THEME_OPTIONS.map(option => <button key={option.id} onClick={() => onChoose(option.id)} aria-label={tx(`انتخاب تم ${option.title}`)}>
      <span>{tx(option.symbol)}</span><b>{tx(option.title)}</b><small>{tx(option.description)}</small>
    </button>)}</div>
  </dialog>;
}
