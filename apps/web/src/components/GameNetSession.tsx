import { tx, useLanguage } from '@react-quest/localization';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BugHunter } from '@react-quest/arcade';
import { GAME_NET, canUseGameNet, gameNetSecondsLeft } from '@react-quest/game';

type Props = { xp: number; paused: boolean; bestScore: number; onTogglePause: () => void; onExit: () => void; onFinished: (score: number) => void };

export function GameNetSession({ xp, paused, bestScore, onTogglePause, onExit, onFinished }: Props) {
  useLanguage();
  const [deadline, setDeadline] = useState<number>();
  const [remaining, setRemaining] = useState(GAME_NET.sessionSeconds);
  const [score, setScore] = useState(0);
  const reportedExpiry = useRef(false);
  const start = useCallback(() => setDeadline(performance.now() + GAME_NET.sessionSeconds * 1000), []);

  useEffect(() => {
    if (deadline === undefined) return;
    const tick = () => setRemaining(gameNetSecondsLeft(deadline, performance.now()));
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [deadline]);
  useEffect(() => {
    if (remaining || reportedExpiry.current) return;
    reportedExpiry.current = true;
    onFinished(score);
  }, [remaining, score, onFinished]);

  if (!canUseGameNet(xp)) return <section className="game-net-finished"><h2>{tx(GAME_NET.requiredXp)}{tx(" XP برای گیم‌نت لازم داری.")}</h2><button onClick={onExit}>{tx("بازگشت به محله")}</button></section>;
  if (!remaining) return <section className="game-net-finished" aria-label={tx("پایان نوبت گیم‌نت")}><span>REACT PLAY</span><h2>{tx("نوبت سه‌دقیقه‌ای تمام شد.")}</h2><p>{tx("امتیاز این نوبت: ")}{tx(score)}</p><button onClick={onExit}>{tx("بازگشت به محله")}</button></section>;
  return <div className="game-net-session">
    <BugHunter paused={paused} bestScore={bestScore} onTogglePause={onTogglePause} onExit={onExit} onFinished={onFinished} onStarted={start} onScoreChanged={setScore} allowRestart={false} />
    <div className="game-net-timer" role="timer" aria-label={tx("زمان نوبت گیم‌نت")}><b dir="ltr">{tx(Math.floor(remaining / 60))}:{tx(String(remaining % 60).padStart(2, '0'))}</b><span>{tx(deadline === undefined ? 'گیم‌نت · زمان با شروع بازی آغاز می‌شود' : 'نوبت گیم‌نت · زمان هنگام توقف هم ادامه دارد')}</span></div>
  </div>;
}
