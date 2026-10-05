import { tx, useLanguage } from '@react-quest/localization';
import { useEffect, useState } from 'react';
import { answerBug, createArcadeState, GAME_DURATION, selectBug, startArcade, tickArcade } from './engine';
import { bugQuestions } from './questions';

type Props = { paused: boolean; bestScore: number; onTogglePause: () => void; onExit: () => void; onFinished: (score: number) => void; onStarted?: () => void; onScoreChanged?: (score: number) => void; allowRestart?: boolean };

export function BugHunter({ paused, bestScore, onTogglePause, onExit, onFinished, onStarted, onScoreChanged, allowRestart = true }: Props) {
  useLanguage();
  const [game, setGame] = useState(createArcadeState);
  useEffect(() => {
    if (paused) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (now: number) => {
      const delta = (now - previous) / 1000;
      if (delta >= 0.05) { previous = now; setGame((state) => tickArcade(state, Math.min(delta, 0.25))); }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [paused]);
  useEffect(() => { if (game.phase === 'finished') onFinished(game.score); }, [game.phase, game.score, onFinished]);
  useEffect(() => { onScoreChanged?.(game.score); }, [game.score, onScoreChanged]);
  const start = () => { setGame(startArcade()); onStarted?.(); };
  const question = bugQuestions[game.questionIndex % bugQuestions.length]!;
  const seconds = Math.ceil(game.remaining);
  return (
    <section className="arcade-screen" aria-label={tx("بازی Bug Hunter")}>
      <header className="arcade-header"><div><span className="arcade-eyebrow">REACT QUEST ARCADE</span><h1 dir="ltr">BUG<span>HUNTER</span></h1></div><div className="arcade-header-actions"><button onClick={onTogglePause}>{tx(paused ? 'ادامه' : 'توقف')}</button><button onClick={onExit}>{tx("بازگشت به اتاق ←")}</button></div></header>
      <div className="arcade-layout">
        <aside className="arcade-info"><span className="arcade-eyebrow">MISSION BRIEF</span><h2>{tx("از سرور محافظت کن.")}</h2><p>{tx("باگ‌ها به سرور نزدیک می‌شوند. روی هر باگ کلیک کن و با پاسخ درست، نابودش کن.")}</p><div className="arcade-stat"><span>{tx("امتیاز")}</span><b data-testid="arcade-score">{tx(game.score)}</b></div><div className="arcade-stat"><span>{tx("بهترین رکورد")}</span><b>{tx(bestScore)}</b></div><div className="arcade-stat"><span>{tx("سلامت سرور")}</span><b aria-label={tx(`${game.health} جان`)} className="server-health">{tx('♥'.repeat(game.health))}{tx('♡'.repeat(3 - game.health))}</b></div><div className="arcade-stat"><span>{tx("زمان باقی‌مانده")}</span><b dir="ltr">{tx(Math.floor(seconds / 60))}:{tx(String(seconds % 60).padStart(2, '0'))}</b></div><div className="arcade-time-track"><i style={{ width: `${game.remaining / GAME_DURATION * 100}%` }} /></div><p className="arcade-note">{tx("زمان هنگام سؤال یا توقف بازی ثابت می‌ماند. پاسخ اشتباه، باگ را سریع‌تر می‌کند.")}</p></aside>
        <div className="bug-field" data-testid="bug-field">
          <div className="field-grid" /><div className="field-label" dir="ltr">INCOMING TRAFFIC // SECTOR 01</div>
          {game.bugs.map((bug) => <button key={bug.id} className="bug-target" data-testid="bug-target" style={{ left: `${bug.x * 100}%`, top: `${8 + bug.y * 72}%` }} aria-label={tx(`انتخاب باگ ${bug.id}`)} onClick={() => setGame((state) => selectBug(state, bug.id))}><svg viewBox="0 0 36 36" aria-hidden="true"><path d="m9 10-5-4m23 4 5-4M8 17H2m26 0h6M8 25l-5 5m25-5 5 5" stroke="currentColor" strokeWidth="3" /><rect x="9" y="9" width="18" height="23" rx="8" fill="currentColor" /><circle cx="18" cy="7" r="6" fill="currentColor" /><path d="M18 12v16" stroke="#173f35" strokeWidth="2" /></svg></button>)}
          <div className="server-box"><div className="server-lights"><i /><i /><i /></div><strong dir="ltr">REACT CORE</strong><span>{tx("سرور تو")}</span></div>
          {game.feedback && game.phase === 'playing' && <div className="arcade-feedback" role="status">{tx(game.feedback)}</div>}
          {game.phase === 'ready' && <div className="arcade-curtain"><div className="arcade-start"><span className="arcade-eyebrow">YOUR FIRST ARCADE GAME</span><h2>{tx("وقت شکار باگ است.")}</h2><p>{tx("۳ دقیقه. ۳ جان. یک سرور برای نجات.")}</p><button className="arcade-primary" onClick={start}>{tx("شروع بازی")}</button><span>{tx("روی باگ‌ها کلیک کن؛ نیازی به حرکت بازیکن نیست.")}</span></div></div>}
          {game.phase === 'question' && <div className="arcade-curtain"><section className="bug-question"><span className="arcade-eyebrow">BUG DETECTED</span><h2>{tx(question.prompt)}</h2><pre dir="ltr">{question.code}</pre><div className="question-options">{question.options.map((option, index) => <button key={option} data-testid={`answer-${index}`} onClick={() => setGame((state) => answerBug(state, index))}><b>{tx(String.fromCharCode(65 + index))}</b><span dir="auto">{tx(option)}</span></button>)}</div></section></div>}
          {game.phase === 'finished' && <div className="arcade-curtain"><div className="arcade-start"><span className="arcade-eyebrow">RUN COMPLETE</span><h2>{tx(game.health > 0 ? 'سرور نجات پیدا کرد!' : 'سرور به تعمیر نیاز دارد.')}</h2><p>{tx(game.kills)}{tx(" باگ نابود کردی.")}</p><strong className="arcade-final-score">{tx(game.score)}</strong>{allowRestart && <button className="arcade-primary" onClick={start}>{tx("یک دور دیگر")}</button>}<button onClick={onExit}>{tx("بازگشت به اتاق")}</button></div></div>}
        </div>
      </div>
    </section>
  );
}
