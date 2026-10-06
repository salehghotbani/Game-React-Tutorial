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
      <div><b>{tx(area)}</b><small><bdi dir="ltr"><span data-testid="room-xp">{tx(xp)}</span> XP</bdi> <span>·</span> <time dir="auto" data-testid="server-clock" data-server-timestamp={timestamp ?? ''} title={tx(clockConnected ? 'ساعت سرور · به وقت تهران' : 'ارتباط ساعت سرور در حال بازیابی')}>{tx(timestamp === null ? 'همگام‌سازی…' : clockFormats[language].format(timestamp))}</time>{!clockConnected && timestamp !== null && <span title={tx("ارتباط ساعت سرور در حال بازیابی")}> ↻</span>}</small></div>
    </div>
  </>;
}

export function MovementGuide({ moved }: { moved: boolean }) {
  useLanguage();
  return <section className={`movement-guide ${moved ? 'faded' : ''}`} aria-label={tx("راهنمای کنترل")} aria-hidden={moved}>
    <div className="desktop-movement-help" dir="ltr"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div>
    <p className="desktop-movement-help">{tx("قدم بزن؛ ")}<kbd>Shift</kbd>{tx(" دویدن · ")}<kbd>Space</kbd>{tx(" پرش · ")}<kbd>E</kbd>{tx(" تعامل · ")}<kbd>Esc</kbd>{tx(" توقف")}<span>{tx("برای چرخاندن دوربین، تصویر را بکش.")}</span></p>
    <p className="touch-movement-help">{tx('برای حرکت، جوی‌استیک را بکش؛ برای چرخاندن دوربین، تصویر را بکش.')}</p>
  </section>;
}
