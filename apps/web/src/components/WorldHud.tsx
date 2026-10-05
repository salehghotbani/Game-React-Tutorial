import { tx, useLanguage } from '@react-quest/localization';
import type { GameSettings } from '@react-quest/shared';
import { Icon } from './Icon';
import { SiteLogo } from './SiteLogo';
import { LanguageSelect } from '../i18n/LanguageSelect';

type Props = {
  settings: GameSettings;
  xp: number;
  area: string;
  timestamp: number | null;
  clockConnected: boolean;
  onHub: () => void;
  onPause: () => void;
  onSettings: () => void;
  onCamera: () => void;
};
const clockFormats = {
  fa: new Intl.DateTimeFormat('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
  en: new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
};

export function WorldHud({ settings, xp, area, timestamp, clockConnected, onHub, onPause, onSettings, onCamera }: Props) {
  const language = useLanguage();
  return <>
    <div className="world-tools" aria-label={tx("ابزارهای بازی")}>
      <button className="world-tool" aria-label={tx("نقشهٔ دانش ↗")} title={tx("نقشهٔ دانش")} onClick={onHub}><Icon name="room" /></button>
      <button className="world-tool" aria-label={tx(settings.paused ? 'ادامهٔ بازی' : 'توقف بازی')} onClick={onPause}><Icon name={settings.paused ? 'play' : 'pause'} /></button>
      <button className="world-tool" aria-label={tx("تنظیمات")} aria-controls="game-settings" onClick={onSettings}><Icon name="settings" /></button>
      <button className="camera-toggle" aria-label={tx(settings.cameraView === 'firstPerson' ? 'تغییر به سوم‌شخص' : 'تغییر به اول‌شخص')} onClick={onCamera}>{tx(settings.cameraView === 'firstPerson' ? 'اول‌شخص' : 'سوم‌شخص')}<span>⇄</span></button>
      <LanguageSelect compact />
    </div>
    <div className="world-information">
      <SiteLogo />
      <div><b>{tx(area)}</b><small><span data-testid="room-xp">{tx(xp)}</span> XP <span>·</span> <time data-testid="server-clock" data-server-timestamp={timestamp ?? ''} title={tx(clockConnected ? 'ساعت سرور · به وقت تهران' : 'ارتباط ساعت سرور در حال بازیابی')}>{tx(timestamp === null ? 'همگام‌سازی…' : clockFormats[language].format(timestamp))}</time>{!clockConnected && timestamp !== null && <span title={tx("ارتباط ساعت سرور در حال بازیابی")}> ↻</span>}</small></div>
    </div>
  </>;
}

export function MovementGuide({ moved }: { moved: boolean }) {
  useLanguage();
  return <section className={`movement-guide ${moved ? 'faded' : ''}`} aria-label={tx("راهنمای کنترل")} aria-hidden={moved}>
    <div dir="ltr"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div>
    <p>{tx("قدم بزن؛ ")}<kbd>Shift</kbd>{tx(" دویدن · ")}<kbd>Space</kbd>{tx(" پرش · ")}<kbd>E</kbd>{tx(" تعامل · ")}<kbd>Esc</kbd>{tx(" توقف")}<span>{tx("برای چرخاندن دوربین، تصویر را بکش.")}</span></p>
  </section>;
}

export function TouchMovement({ driving = false }: { driving?: boolean }) {
  useLanguage();
  const signal = (direction: string, pressed: boolean) => window.dispatchEvent(new CustomEvent('react-quest-movement', { detail: { direction, pressed } }));
  return <div className="touch-movement" aria-label={tx("حرکت لمسی")}>
    {([{ direction: 'forward', label: driving ? 'گاز' : 'حرکت به جلو', symbol: '↑' }, { direction: 'left', label: driving ? 'فرمان چپ' : 'حرکت به چپ', symbol: '←' }, { direction: 'backward', label: driving ? 'دنده عقب' : 'حرکت به عقب', symbol: '↓' }, { direction: 'right', label: driving ? 'فرمان راست' : 'حرکت به راست', symbol: '→' }, ...(driving ? [{ direction: 'brake', label: 'ترمز', symbol: '■' }] : [{ direction: 'jump', label: 'پرش', symbol: '↟' }, { direction: 'sprint', label: 'دویدن', symbol: '»' }])]).map(button => <button key={button.direction} className={button.direction === 'brake' ? 'jump' : button.direction} aria-label={tx(button.label)}
      onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); signal(button.direction, true); }}
      onPointerUp={() => signal(button.direction, false)} onPointerCancel={() => signal(button.direction, false)} onLostPointerCapture={() => signal(button.direction, false)}>{tx(button.symbol)}</button>)}
  </div>;
}
