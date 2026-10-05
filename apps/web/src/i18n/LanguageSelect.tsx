import { t, useLanguage } from '@react-quest/localization';
import { useLocaleSettings } from './localeContext';

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  useLanguage();
  const { selection, choose, country } = useLocaleSettings();
  return <label className={compact ? 'language-select compact' : 'language-select'}>
    {!compact && <span>{t('زبان سایت')}</span>}
    <select aria-label={t('زبان سایت')} value={selection} onChange={event => { const value = event.target.value; if (value === 'fa' || value === 'en' || value === 'auto') choose(value); }}>
      <option value="auto">{t('خودکار بر اساس کشور')}</option><option value="fa">فارسی</option><option value="en">English</option>
    </select>
    {!compact && <small>{t('ایران: فارسی؛ سایر کشورها: انگلیسی. انتخاب دستی ذخیره می‌شود.')}</small>}
    {!compact && selection === 'auto' && country === null && <small>{t('کشور قابل تشخیص نبود؛ زبان با تنظیمات مرورگر انتخاب شد. می‌توانی دستی تغییرش بدهی.')}</small>}
  </label>;
}
