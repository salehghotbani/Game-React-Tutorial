import { tx, useLanguage } from '@react-quest/localization';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { GameScene, PLAYER_CONFIG, getWorldArea, isTypingTarget, type PlayerPosition } from '@react-quest/game';
import { challenges, rooms, isChallengeAvailable } from '@react-quest/challenges';
import { useAppDispatch, useAppSelector } from '../store';
import { resetPlayer, setCameraView, setMode, setPaused, setThemeMode, togglePause } from '../store/gameSlice';
import { assignDaily, recordArcadeScore, selectChallenge, visitRoom } from '../store/progressSlice';
import { dayKey, getProgressTotals, isRoomAvailable } from '../store/progression';
import { useRoomActivities } from '../hooks/useRoomActivities';
import { useServerClock } from '../hooks/useServerClock';
import { AppearanceContext, useAppearance } from '../hooks/useAppearance';
import { ThemePicker } from '../components/ThemePicker';
import { Icon } from '../components/Icon';
import { MiniMap } from '../components/MiniMap';
import { SettingsPanel } from '../components/SettingsPanel';
import { RoomReading, RoomCinema } from '../components/RoomActivities';
import { WorldDock } from '../components/WorldDock';
import { MovementGuide, WorldHud } from '../components/WorldHud';
import { TouchMovement } from '../components/TouchMovement';
import '../room.css';
import '../world.css';
import '../theme.css';

const ComputerMode = lazy(() => import('../components/ComputerMode').then(module => ({ default: module.ComputerMode })));
const LearningHub = lazy(() => import('../components/LearningHub').then(module => ({ default: module.LearningHub })));
const BugHunter = lazy(() => import('@react-quest/arcade').then(module => ({ default: module.BugHunter })));
const GameNetSession = lazy(() => import('../components/GameNetSession').then(module => ({ default: module.GameNetSession })));
const SEATED_MODES = ['computer', 'enteringComputer', 'reading', 'readingOnSofa', 'enteringReading', 'enteringTV', 'watching'];

export function GamePage() {
  useLanguage();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.game);
  const progress = useAppSelector(state => state.progress);
  const { xp } = getProgressTotals(progress);
  const room = rooms.find(candidate => candidate.id === progress.selectedRoom)!;
  const clock = useServerClock();
  const theme = useAppearance(clock.timestamp, settings.themeMode);
  const [hubOpen, setHubOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [position, setPosition] = useState<PlayerPosition>({ x: PLAYER_CONFIG.spawn[0], z: PLAYER_CONFIG.spawn[2], heading: Math.PI });
  const activity = useRoomActivities({ position, hubOpen, xp });
  const area = getWorldArea(position);
  const dailyId = progress.dailyAssignments[dayKey()];
  const exploring = settings.mode === 'explore' && !settings.paused && !hubOpen && settings.themeChosen && !settingsOpen;
  const sceneSettings = useMemo(() => ({ ...settings, paused: settings.paused || hubOpen || !settings.themeChosen || settingsOpen }), [settings, hubOpen, settingsOpen]);
  const sceneLife = useMemo(() => ({
    ...activity.rewards, ...activity.life, watering: activity.watering, wateringSpot: activity.wateringSpot,
    activeSpot: activity.activeSpot, onNavigate: activity.onNavigate
  }), [activity.rewards, activity.life, activity.watering, activity.wateringSpot, activity.activeSpot, activity.onNavigate]);

  const onPosition = useCallback((next: PlayerPosition) => setPosition(next), []);
  const onFirstMove = useCallback(() => setHasMoved(true), []);
  const onComputerReady = useCallback(() => dispatch(setMode('computer')), [dispatch]);
  const onTVReady = useCallback(() => dispatch(setMode('watching')), [dispatch]);
  const onReadingReady = useCallback(() => dispatch(setMode('readingOnSofa')), [dispatch]);
  const leaveActivity = useCallback(() => dispatch(setMode('explore')), [dispatch]);
  const onArcadeFinished = useCallback((score: number) => {
    dispatch(recordArcadeScore(score));
    if (settings.mode === 'gameNet') dispatch(setPaused(false));
  }, [dispatch, settings.mode]);
  const toggleCamera = useCallback(() => dispatch(setCameraView(settings.cameraView === 'firstPerson' ? 'thirdPerson' : 'firstPerson')), [dispatch, settings.cameraView]);

  const startLesson = (id: string, daily = false) => {
    if (daily) dispatch(assignDaily());
    dispatch(selectChallenge(id));
    setHubOpen(false);
    dispatch(setMode('computer'));
  };
  const enterRoom = (id: string) => {
    if (!isRoomAvailable(progress, id)) return;
    dispatch(visitRoom(id));
    dispatch(resetPlayer());
    dispatch(setPaused(false));
    setHubOpen(false);
    const targetRoom = rooms.find(candidate => candidate.id === id)!;
    const target = id === 'interview'
      ? challenges.find(challenge => challenge.id === 'interview-memo' && isChallengeAvailable(challenge))
      : challenges.find(challenge => targetRoom.chapters.includes(challenge.chapterId ?? 1) && !progress.completedLessons.includes(challenge.id) && isChallengeAvailable(challenge));
    if (target) dispatch(selectChallenge(target.id));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || event.defaultPrevented) return;
      if (!settings.themeChosen) return;
      if (hubOpen) { if (event.code === 'Escape') setHubOpen(false); return; }
      if (event.code === 'KeyE' && !isTypingTarget(event.target) && exploring && activity.nearest) { activity.nearest.onInteract(); return; }
      if (event.code !== 'Escape') return;
      if (settingsOpen) setSettingsOpen(false);
      else if (SEATED_MODES.includes(settings.mode)) leaveActivity();
      else dispatch(togglePause());
    };
    const onVisibility = () => { if (document.hidden) dispatch(setPaused(true)); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVisibility); };
  }, [dispatch, settingsOpen, settings.mode, settings.themeChosen, exploring, activity.nearest, leaveActivity, hubOpen]);

  return <AppearanceContext.Provider value={theme}><main className="game-page neighborhood-page"
    data-world-blooms={activity.rewards.blooms} data-room-key={activity.life.keyCollected}
    data-greenhouse-open={activity.life.greenhouseOpen} data-game-mode={settings.mode}
    data-camera-view={settings.cameraView} data-world-area={area} data-theme={theme} data-theme-mode={settings.themeMode}>
    <div className="world" aria-label={tx("خانهٔ سه‌بعدی با کنترل WASD")}>
      <GameScene settings={sceneSettings} room={room} life={sceneLife}
        timestamp={clock.timestamp} onPosition={onPosition} arcadeUnlocked={activity.arcadeUnlocked} onFirstMove={onFirstMove}
        onComputerReady={onComputerReady} onTVReady={onTVReady} onReadingReady={onReadingReady} onTravelEnd={activity.onTravelEnd} />
    </div>
    <WorldHud settings={settings} xp={xp} area={area} timestamp={clock.timestamp} clockConnected={clock.connected}
      onHub={() => setHubOpen(true)} onPause={() => dispatch(togglePause())}
      onSettings={() => setSettingsOpen(open => !open)} onCamera={toggleCamera} />
    <MiniMap position={position} greenhouseOpen={activity.life.greenhouseOpen} />
    {exploring && activity.toast && <div className="room-toast" role="status"><span>{tx(activity.toast)}</span><button aria-label={tx('بستن پیام اتاق')} onClick={() => activity.setToast('')}><Icon name="close" size={16} /></button></div>}
    {exploring && <>
      <WorldDock onNavigate={activity.onNavigate} active={activity.activeSpot} drops={activity.rewards.drops}
        cards={activity.rewards.cards} greenhouseOpen={activity.life.greenhouseOpen} keyCollected={activity.life.keyCollected} />
      <MovementGuide moved={hasMoved} />
      <TouchMovement />
      {settings.cameraView === 'firstPerson' && <div className="first-person-crosshair" aria-hidden="true">+</div>}
      {settings.destination && <div className="room-destination">{tx("در حال رفتن به مقصد… ")}<button onClick={activity.onTravelEnd}>{tx("توقف حرکت")}</button></div>}
      {activity.nearest && <button className="interaction-prompt panel" aria-label={tx(activity.nearest.label)} onClick={activity.nearest.onInteract}><kbd>E</kbd><span>{tx("برای تعامل E را بزن")}</span></button>}
    </>}
    {settings.mode === 'enteringComputer' && <div className="entering-computer" role="status">{tx("در حال نشستن پشت کامپیوتر…")}</div>}
    {settings.mode === 'enteringTV' && <div className="entering-computer" role="status">{tx("در حال نشستن پای تلویزیون…")}</div>}
    {settings.mode === 'enteringReading' && <div className="entering-computer" role="status">{tx("در حال نشستن روی مبل…")}</div>}
    {(settings.mode === 'reading' || settings.mode === 'readingOnSofa') && <RoomReading onClose={leaveActivity} />}
    {settings.mode === 'watching' && <RoomCinema onClose={leaveActivity} />}
    {settings.mode === 'computer' && <Suspense fallback={<div className="activity-loading">{tx("در حال آماده‌سازی میز یادگیری…")}</div>}><ComputerMode onExit={leaveActivity} onHub={() => setHubOpen(true)} dailyId={dailyId} /></Suspense>}
    {settings.mode === 'arcade' && <Suspense fallback={<div className="activity-loading">{tx("در حال روشن‌کردن آرکید…")}</div>}><BugHunter paused={settings.paused} bestScore={progress.arcadeBestScore} onTogglePause={() => dispatch(togglePause())} onExit={leaveActivity} onFinished={onArcadeFinished} /></Suspense>}
    {settings.mode === 'gameNet' && <Suspense fallback={<div className="activity-loading">{tx("در حال آماده‌سازی گیم‌نت…")}</div>}><GameNetSession xp={xp} paused={settings.paused} bestScore={progress.arcadeBestScore} onTogglePause={() => dispatch(togglePause())} onExit={leaveActivity} onFinished={onArcadeFinished} /></Suspense>}
    {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    {!settings.themeChosen && <ThemePicker onChoose={mode => dispatch(setThemeMode(mode))} />}
    {hubOpen && <Suspense fallback={<div className="activity-loading">{tx("در حال آماده‌سازی درس‌ها…")}</div>}><LearningHub onClose={() => setHubOpen(false)} onSelect={startLesson} onVisit={enterRoom} /></Suspense>}
    {settings.paused && <div className="pause-overlay"><section className="pause-card panel">
      <span className="pause-symbol"><Icon name="pause" size={30} /></span><h2>{tx("یک نفس تازه کن.")}</h2><p>{tx("خانه همین‌جا منتظرت می‌ماند.")}</p>
      <button className="world-resume" onClick={() => { dispatch(setPaused(false)); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }}>{tx("ادامهٔ ماجراجویی")}</button>
      <span className="pause-shortcut">{tx("یا کلید Esc را بزن")}</span>
    </section></div>}
  </main></AppearanceContext.Provider>;
}
