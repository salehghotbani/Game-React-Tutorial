import { tx, useLanguage } from '@react-quest/localization';
import { useEffect, useRef, useState } from 'react';
import { CodeRuntime, idleStatus, type RuntimeStatus } from '@react-quest/learning-engine';
import type { Challenge } from '@react-quest/shared';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProjectStorage } from '../store/progressSlice';
import { getDraft } from '../store/progression';

export function ProjectShowcase({ challenge, onClose }: { challenge: Challenge; onClose: () => void }) {
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const progress = useAppSelector(state => state.progress);
  const [source] = useState(() => getDraft(progress, challenge));
  const storageKey = challenge.project?.id ?? challenge.id;
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<RuntimeStatus>(idleStatus);
  const [runtime] = useState(() => new CodeRuntime(setStatus, {
    initialStorage: progress.projectStorage[storageKey] ?? {},
    storage: values => dispatch(saveProjectStorage({ id: storageKey, values }))
  }));
  useEffect(() => {
    const detach = runtime.attach(frame.current!);
    dialog.current?.showModal();
    void runtime.run(source, 'local').catch(() => { /* The runtime displays compilation and execution errors. */ });
    return detach;
  }, [runtime, source]);
  useEffect(() => runtime.setLocale(language), [runtime, language]);
  return <dialog ref={dialog} className="project-showcase" aria-label={tx('ساختهٔ من')} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); } }} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header><div><span>{tx('ساختهٔ من')}</span><h2>{tx(challenge.title)}</h2></div><button autoFocus onClick={onClose}>{tx('بستن نمایش ×')}</button></header>
    <p>{tx('این برنامه با کد ذخیره‌شدهٔ خودت در همین سایت اجرا می‌شود. با آن کار کن؛ این نمایش امتیاز آزمون را تغییر نمی‌دهد.')}</p>
    <div role="status" className={status.phase === 'error' ? 'answer-wrong' : ''}>{tx(status.message)}</div>
    {status.phase === 'error' && <button onClick={() => { void runtime.run(source, 'local').catch(() => {}); }}>{tx('تلاش دوباره')}</button>}
    <iframe ref={frame} title={tx('برنامهٔ ساخته‌شدهٔ من')} sandbox="allow-scripts" />
  </dialog>;
}
