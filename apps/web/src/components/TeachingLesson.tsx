import { tx, useLanguage, translateAuthoredCode } from '@react-quest/localization';
import { useEffect, useRef, useState } from 'react';
import { getTeachingLesson } from '@react-quest/challenges';
import { CodeRuntime, idleStatus, type RuntimeStatus } from '@react-quest/learning-engine';
import type { Challenge, TeachingStep } from '@react-quest/shared';
import { useAppDispatch, useAppSelector } from '../store';
import { advanceLesson, startPractice } from '../store/progressSlice';
import { getProgressTotals } from '../store/progression';
import { Icon } from './Icon';
import { SiteLogo } from './SiteLogo';
import { ResizableWorkspace } from './ResizableWorkspace';

export function TeachingExample({ source }: { source: string }) {
  const language = useLanguage();
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<RuntimeStatus>(idleStatus);
  const [started, setStarted] = useState(false);
  const [runtime] = useState(() => new CodeRuntime(setStatus));
  useEffect(() => runtime.attach(frame.current!), [runtime]);
  const run = () => { setStarted(true); void runtime.run(translateAuthoredCode(source, language), 'local').catch(() => { /* Status includes the error. */ }); };
  return <section className="teaching-example" aria-label={tx("مثال آموزشی قابل اجرا")}>
    <div><b>{tx("این نمونه آماده است؛ نتیجه را ببین و با آن کار کن.")}</b><button onClick={run} disabled={status.phase === 'booting' || status.phase === 'compiling'}>{tx("▶ اجرای نمونه")}</button></div>
    {!started && <p>{tx("کد بالا را با دکمهٔ «اجرای نمونه» اجرا کن. این کار تمرین را حل نمی‌کند و امتیازی کم نمی‌کند.")}</p>}
    <iframe ref={frame} title={tx("نمونهٔ آموزشی React")} sandbox="allow-scripts" hidden={!started}/>
    {started && <p role="status" className={status.phase === 'error' ? 'answer-wrong' : ''}>{tx(status.message)}</p>}
  </section>;
}
export function TeachingStepContent({ step }: { step: TeachingStep }) {
  const language = useLanguage();
  return <div className="teaching-step-content">
    {step.paragraphs.map(p => <p key={p}>{tx(p)}</p>)}
    {step.code && <pre dir="ltr">{translateAuthoredCode(step.code, language)}</pre>}
    {step.notes && <dl className="code-explanations">{step.notes.map(note => <div key={note.code}><dt dir="ltr">{note.code}</dt><dd>{tx(note.text)}</dd></div>)}</dl>}
    {step.preview && <TeachingExample key={step.id} source={step.preview}/>}
  </div>;
}
export function TeachingLesson({ challenge, onExit, onHub, onFinish, review, daily }: { challenge: Challenge; onExit: () => void; onHub: () => void; onFinish: () => void; review: boolean; daily: boolean }) {
  useLanguage();
  const lesson = getTeachingLesson(challenge);
  const progress = useAppSelector(s => s.progress), dispatch = useAppDispatch();
  const completed = progress.lessonSteps[challenge.id] ?? 0;
  const [index, setIndex] = useState(review ? 0 : Math.min(completed, lesson.steps.length - 1));
  const step = lesson.steps[index]!;
  const layout = useRef<HTMLElement>(null);
  useEffect(() => {
    layout.current?.scrollTo({top:0});
    layout.current?.querySelector('.lesson-stage')?.scrollIntoView({block:'nearest'});
  }, [index]);
  const last = index === lesson.steps.length - 1;
  const next = () => {
    dispatch(advanceLesson({ id: challenge.id, step: index }));
    if (last) onFinish(); else setIndex(index + 1);
  };
  return <section className="computer-screen teaching-screen" aria-label={tx("محیط آموزش React")} data-lesson={challenge.id}>
    <header className="computer-header"><div className="computer-brand"><SiteLogo /><b dir="ltr">reactquest<span>.</span></b><button className="map-button" onClick={onHub}>{tx("نقشهٔ دانش ↗")}</button></div><div className="learning-stats"><span dir="ltr"><b data-testid="total-xp">{tx(getProgressTotals(progress).xp)}</b> XP</span><button className="back-room" onClick={onExit}>{tx("بازگشت به اتاق ")}<Icon name="arrow" size={17}/></button></div></header>
    <ResizableWorkspace storageKey="teaching" panels={[
      {id:'path',title:'بخش‌های درس',size:260,height:320,minWidth:200,minHeight:180,content:(<aside className="teaching-path"><span className="eyebrow">{tx("اول یاد بگیر، بعد تمرین کن")}</span><h2>{tx(lesson.title)}</h2><p>{tx("درس ← نمونه ← تمرین")}</p><ol>{lesson.steps.map((item, i) => <li key={item.id}><button aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}><span>{tx(i < completed ? '✓' : i + 1)}</span>{tx(item.title)}</button></li>)}</ol><small>{tx("خواندن و مرور درس رایگان است.")}</small></aside>)},
      {id:'lesson',title:'آموزش و مثال',size:850,height:900,minWidth:450,minHeight:350,content:(<article className="teaching-article" ref={layout}>
        <div className="lesson-stage"><span className="active">{tx("۱. یادگیری")}</span><span>{tx("۲. تمرین")}</span>{daily && <span>{tx("درسِ تمرین امروز")}</span>}</div>
        <div className="challenge-heading"><span>{tx("آموزش پیش از تمرین: ")}{tx(challenge.title)}</span><h1>{tx(step.title)}</h1></div>
        <p className="hub-note">{tx("از هر بخش دلخواه شروع کن؛ می‌توانی مستقیم سراغ تمرین بروی.")}</p><button className="hub-primary" onClick={() => { dispatch(startPractice(challenge.id)); onFinish(); }}>{tx("رفتن مستقیم به تمرین ←")}</button><div className="teaching-progress"><span>{tx("بخش ")}{tx(index + 1)}{tx(" از ")}{tx(lesson.steps.length)}</span><progress value={index + 1} max={lesson.steps.length}/></div>
        <TeachingStepContent key={step.id} step={step}/>
        <footer className="teaching-navigation"><button disabled={index === 0} onClick={() => setIndex(index - 1)}>{tx("بخش قبلی →")}</button><button className="hub-primary" data-testid="lesson-next" onClick={next}>{tx(last ? 'ورود به تمرین ←' : 'ادامهٔ درس ←')}</button></footer>
        <a className="teaching-reference" href={lesson.reference} target="_blank" rel="noreferrer">{tx("منبع و مطالعهٔ بیشتر ↗")}</a>
      </article>)}
    ]}/>
  </section>;
}
