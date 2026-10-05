import { tx, useLanguage } from '@react-quest/localization';
import { Button } from '@chakra-ui/react';
import { PLAYER_CONFIG } from '@react-quest/game';
import { useAppDispatch, useAppSelector } from '../store';
import { resetPlayer, setMovementSpeed, togglePhysics, setCameraView, setThemeMode } from '../store/gameSlice';
import { Icon } from './Icon';
import { THEME_OPTIONS } from './themeOptions';
import { LanguageSelect } from '../i18n/LanguageSelect';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  useLanguage();
  const settings = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  return (
    <section className="settings-panel panel" aria-label={tx("تنظیمات بازی")} id="game-settings">
      <div className="settings-heading"><h2>{tx("تنظیمات بازی")}</h2><button className="icon-button" aria-label={tx("بستن تنظیمات")} onClick={onClose}><Icon name="close" /></button></div>
      <LanguageSelect />
      <fieldset className="camera-settings"><legend>{tx("زاویهٔ دید")}</legend><label><input type="radio" name="camera-view" checked={settings.cameraView==='firstPerson'} onChange={()=>dispatch(setCameraView('firstPerson'))}/>{tx("اول‌شخص")}</label><label><input type="radio" name="camera-view" checked={settings.cameraView==='thirdPerson'} onChange={()=>dispatch(setCameraView('thirdPerson'))}/>{tx("سوم‌شخص")}</label></fieldset>
      <p className="settings-note">{tx("در هر دو نما، تصویر را با ماوس یا انگشت بکش تا دوربین بچرخد. Space برای پرش و Shift همراه حرکت برای دویدن است.")}</p>
      <fieldset className="theme-settings"><legend>{tx("ظاهر و نور محیط")}</legend>{THEME_OPTIONS.map(option => <label key={option.id}><input type="radio" name="theme-mode" checked={settings.themeMode === option.id} onChange={() => dispatch(setThemeMode(option.id))} />{tx(option.title)}</label>)}</fieldset>
      <label htmlFor="movement-speed" className="setting-label">{tx("سرعت حرکت ")}<b dir="ltr">{tx(settings.movementSpeed.toFixed(1))} m/s</b></label>
      <input id="movement-speed" type="range" min={PLAYER_CONFIG.minSpeed} max={PLAYER_CONFIG.maxSpeed} step="0.1" value={settings.movementSpeed} onChange={(event) => dispatch(setMovementSpeed(Number(event.target.value)))} />
      <div className="range-captions"><span>{tx("آرام")}</span><span>{tx("سریع")}</span></div>
      <label className="debug-toggle"><span>{tx("نمایش محدودهٔ برخورد")}</span><input type="checkbox" checked={settings.showPhysics} onChange={() => dispatch(togglePhysics())} /></label>
      <p className="settings-note">{tx("دیوارها و وسایل مانع حرکت می‌شوند؛ حتی دیوارهای کوتاه‌شده در نمای اتاق.")}</p>
      <Button width="full" variant="outline" size="sm" borderColor="#d6dace" onClick={() => { dispatch(resetPlayer()); onClose(); }}><Icon name="reset" size={16} />{tx("بازگشت به نقطهٔ شروع")}</Button>
    </section>
  );
}
