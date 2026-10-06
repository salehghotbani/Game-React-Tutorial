import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { getJoystickState } from '@react-quest/game';
import { tx, useLanguage } from '@react-quest/localization';

const idle = getJoystickState(0, 0, 1);
const signal = (direction: 'jump' | 'sprint', pressed: boolean) => window.dispatchEvent(new CustomEvent('react-quest-movement', { detail: { direction, pressed } }));
const move = (x: number, z: number) => window.dispatchEvent(new CustomEvent('react-quest-joystick', { detail: { x, z } }));

function TouchAction({ direction, label }: { direction: 'jump' | 'sprint'; label: string }) {
  const language = useLanguage();
  const pointer = useRef<number | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const clear = () => {
      const id = pointer.current;
      pointer.current = null;
      signal(direction, false);
      setPressed(false);
      if (id !== null && button.current?.hasPointerCapture(id)) button.current.releasePointerCapture(id);
    };
    window.addEventListener('blur', clear);
    window.addEventListener('resize', clear);
    document.addEventListener('visibilitychange', clear);
    return () => { clear(); window.removeEventListener('blur', clear); window.removeEventListener('resize', clear); document.removeEventListener('visibilitychange', clear); };
  }, [direction]);
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    signal(direction, false);
    setPressed(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <button ref={button} type="button" className={`touch-action ${direction}`} aria-label={tx(label)} aria-pressed={pressed}
    onPointerDown={event => {
      if (event.button !== 0 || pointer.current !== null) return;
      event.preventDefault(); pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId);
      signal(direction, true); setPressed(true);
    }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
    onKeyDown={event => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) { event.preventDefault(); signal(direction, true); setPressed(true); } }}
    onKeyUp={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); signal(direction, false); setPressed(false); } }}
    onBlur={() => { signal(direction, false); setPressed(false); }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'jump' ? <><path d="m6 8 6-5 6 5M12 3v12M5 20h14" /><path d="m8 16 4 4 4-4" /></> : <><circle cx="15" cy="4" r="2" /><path d="m10 10 4-3 3 5 4 1M14 7l-3 8 4 6M11 15l-5 5M3 8h4M2 12h4" /></>}
    </svg><span dir={language === 'fa' ? 'rtl' : 'ltr'}>{tx(label)}</span>
  </button>;
}

export function TouchMovement() {
  useLanguage();
  const instructions = useId();
  const pointer = useRef<number | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [stick, setStick] = useState(idle);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const clear = () => {
      const id = pointer.current;
      pointer.current = null;
      move(0, 0); setStick(idle); setActive(false);
      if (id !== null && button.current?.hasPointerCapture(id)) button.current.releasePointerCapture(id);
    };
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    const media = window.matchMedia('(max-width: 760px), (pointer: coarse)');
    const resize = () => clear();
    media.addEventListener('change', clear);
    window.addEventListener('resize', resize);
    return () => {
      clear(); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', clear);
      media.removeEventListener('change', clear); window.removeEventListener('resize', resize);
    };
  }, []);
  const update = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = getJoystickState(event.clientX - bounds.left - bounds.width / 2, event.clientY - bounds.top - bounds.height / 2, bounds.width / 3);
    setStick(next); move(next.x, next.z);
  };
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerId !== pointer.current) return;
    pointer.current = null; move(0, 0); setStick(idle); setActive(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="touch-movement" role="group" aria-label={tx('حرکت لمسی')} dir="ltr">
    <button ref={button} type="button" className={`touch-joystick ${active ? 'active' : ''}`} aria-label={tx('جوی‌استیک حرکت')} aria-describedby={instructions}
      onPointerDown={event => {
        if (event.button !== 0 || pointer.current !== null) return;
        event.preventDefault(); pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); setActive(true); update(event);
      }} onPointerMove={event => { if (pointer.current === event.pointerId) update(event); }}
      onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
      <span className="joystick-ring" aria-hidden="true" />
      <span className="joystick-thumb" aria-hidden="true" style={{ transform: `translate(-50%, -50%) translate(${stick.offsetX}px, ${stick.offsetY}px)` }} />
    </button>
    <span id={instructions} className="joystick-instructions">{tx('برای حرکت، دایره را بکش؛ هرچه بیشتر بکشی، سریع‌تر حرکت می‌کنی. کلیدهای جهت‌دار هم کار می‌کنند.')}</span>
    <div className="touch-actions"><TouchAction direction="sprint" label="دویدن" /><TouchAction direction="jump" label="پرش" /></div>
  </div>;
}
