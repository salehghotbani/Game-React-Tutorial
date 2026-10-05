import { tx, useLanguage } from '@react-quest/localization';
import { Fragment, useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import { defaultPanelLayout, fitPanelSizes, resizePanelPair, restorePanelLayout, WORKSPACE_KEY, type PanelLayout, type PanelMinimum, type PanelSpec } from './workspaceLayout';
import './workspace.css';

export type WorkspacePanel = PanelSpec & { title: string; content: ReactNode };
const media = '(max-width: 1099px)';
const subscribe = (update: () => void) => { const query = window.matchMedia(media); query.addEventListener('change', update); return () => query.removeEventListener('change', update); };
const getVertical = () => window.matchMedia(media).matches;
const gutter = 10;
type Drag = { first: string; second: string; start: number; sizes: Record<string, number>; available: number; minimums: PanelMinimum[]; vertical: boolean; element: HTMLDivElement; pointer: number };

export function ResizableWorkspace({ panels, storageKey, className = '' }: { panels: WorkspacePanel[]; storageKey: string; className?: string }) {
  const language = useLanguage();
  const key = `${WORKSPACE_KEY}:${storageKey}`, uid = useId();
  const [layout, setLayout] = useState<PanelLayout>(() => {
    try { const saved = localStorage.getItem(key); return restorePanelLayout(saved && saved.length < 10000 ? JSON.parse(saved) : null, panels); } catch { return defaultPanelLayout(panels); }
  });
  const vertical = useSyncExternalStore(subscribe, getVertical, () => false);
  const viewport = useRef<HTMLDivElement>(null);
  const reopen = useRef<Record<string, HTMLButtonElement | null>>({});
  const drag = useRef<Drag | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState({width:1200, height:700});
  useEffect(() => {
    const element = viewport.current!;
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element);
      setBounds({width:element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), height:element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)});
    });
    observer.observe(element); return () => observer.disconnect();
  }, []);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify({version:1, ...layout})); } catch { /* Layout still works without storage. */ } }, [key, layout]);
  useEffect(() => {
    const stop = () => { const current = drag.current; drag.current = undefined; setDragging(false); if (current?.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer); };
    window.addEventListener('blur', stop); return () => window.removeEventListener('blur', stop);
  }, []);
  const visible = panels.filter(p => !layout.hidden.includes(p.id));
  const field = vertical ? 'rows' : 'columns';
  const height = Math.max(bounds.height, visible.reduce((sum, p) => sum + p.height, 0));
  const available = Math.max(1, (vertical ? height : bounds.width) - Math.max(0, visible.length - 1) * gutter - visible.length * 2);
  const minimums = visible.map(p => ({id:p.id, minimum:vertical ? p.minHeight : p.minWidth}));
  const pixels = fitPanelSizes(layout[field], minimums, available);
  const close = (id: string) => { setLayout(value => ({...value, hidden:[...value.hidden, id]})); requestAnimationFrame(() => reopen.current[id]?.focus()); };
  const toggle = (id: string) => setLayout(value => ({...value, hidden:value.hidden.includes(id) ? value.hidden.filter(x => x !== id) : [...value.hidden, id]}));
  const start = (event: PointerEvent<HTMLDivElement>, first: string, second: string) => {
    if (event.button !== 0) return;
    event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {first,second,start:vertical ? event.clientY : event.clientX,sizes:layout[field],available,minimums,vertical,element:event.currentTarget,pointer:event.pointerId};
    setDragging(true);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current; if (!current || event.pointerId !== current.pointer) return;
    const delta = current.vertical ? event.clientY - current.start : (event.clientX - current.start) * (language === 'fa' ? -1 : 1);
    setLayout(value => ({...value, [current.vertical ? 'rows' : 'columns']:resizePanelPair(current.sizes,current.minimums,current.first,current.second,delta,current.available)}));
  };
  const end = () => { drag.current = undefined; setDragging(false); };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>, first: string, second: string) => {
    if (event.key === 'Escape' && drag.current) {
      event.preventDefault(); event.stopPropagation();
      const current = drag.current;
      setLayout(value => ({...value, [current.vertical ? 'rows' : 'columns']:current.sizes}));
      end(); if (current.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer);
      return;
    }
    if (event.key === 'Enter') { event.preventDefault(); close(first); return; }
    const amount = event.shiftKey ? 50 : 20;
    const horizontalDelta = event.key === 'ArrowRight' ? amount : event.key === 'ArrowLeft' ? -amount : 0;
    const delta = event.key === 'Home' ? -available : event.key === 'End' ? available : vertical ? event.key === 'ArrowDown' ? amount : event.key === 'ArrowUp' ? -amount : 0 : horizontalDelta * (language === 'fa' ? -1 : 1);
    if (!delta) return;
    event.preventDefault();
    setLayout(value => ({...value, [field]:resizePanelPair(value[field],minimums,first,second,delta,available)}));
  };
  return <div className={`panel-workspace ${vertical ? 'vertical' : 'horizontal'} ${className} ${dragging ? 'is-resizing' : ''}`}>
    <div className="workspace-toolbar" aria-label={tx("کنترل پنجره‌ها")}><b>{tx("پنجره‌ها")}</b><div className="panel-toggles">{panels.map(panel => {
      const open = !layout.hidden.includes(panel.id);
      return <button key={panel.id} ref={element => {reopen.current[panel.id] = element;}} className={open ? 'open' : 'closed'} disabled={dragging} aria-pressed={open} aria-label={tx(open ? `پنجرهٔ ${panel.title}` : `باز کردن پنجرهٔ ${panel.title}`)} onClick={() => toggle(panel.id)}><span aria-hidden="true">{tx(open ? '▣' : '+')}</span>{tx(open ? panel.title : `باز کردن ${panel.title}`)}</button>;
    })}</div><button className="restore-layout" disabled={dragging} onClick={() => setLayout(defaultPanelLayout(panels))}><Icon name="reset" size={14}/>{tx("بازنشانی چیدمان")}</button></div>
    <div className="workspace-viewport" ref={viewport}>
      {!visible.length && <div className="workspace-empty"><h2>{tx("همهٔ پنجره‌ها بسته‌اند")}</h2><p>{tx("از نوار بالا، پنجرهٔ دلخواهت را باز کن.")}</p><button onClick={() => setLayout(value => ({...value,hidden:[]}))}>{tx("باز کردن همهٔ پنجره‌ها")}</button></div>}
      <div className="panel-strip" style={{height:vertical && visible.length ? height : '100%'}}>
        {panels.map(panel => {
          const index = visible.findIndex(p => p.id === panel.id), next = visible[index + 1];
          const hidden = index < 0;
          const fraction = (pixels[panel.id] ?? 0) / available * 100;
          return <Fragment key={panel.id}><section id={`${uid}-${panel.id}`} data-panel={panel.id} className="workspace-pane" aria-label={tx(`پنجرهٔ ${panel.title}`)} hidden={hidden} style={{flexGrow:pixels[panel.id] ?? 0}}>
            <header className="workspace-pane-header"><b>{tx(panel.title)}</b><button className="panel-close" disabled={dragging} aria-label={tx(`بستن پنجرهٔ ${panel.title}`)} onClick={() => close(panel.id)}><Icon name="close" size={15}/></button></header>
            <div className="workspace-pane-content">{tx(panel.content)}</div>
          </section>{!hidden && next && <div className="workspace-divider" role="separator" tabIndex={0} aria-label={tx(`تغییر اندازهٔ ${panel.title}`)} aria-controls={`${uid}-${panel.id}`} aria-orientation={vertical ? 'horizontal' : 'vertical'} aria-valuenow={Math.round(fraction)} aria-valuemin={Math.floor(panel[vertical ? 'minHeight' : 'minWidth'] / available * 100)} aria-valuemax={Math.ceil((pixels[panel.id]! + pixels[next.id]! - next[vertical ? 'minHeight' : 'minWidth']) / available * 100)} title={tx("برای تغییر اندازه بکش؛ کلیدهای جهت‌دار هم قابل استفاده‌اند.")} onPointerDown={event => start(event,panel.id,next.id)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={event => keyboard(event,panel.id,next.id)}><i/></div>}</Fragment>;
        })}
      </div>
    </div>
    {dragging && <div className="workspace-drag-shield" aria-hidden="true"/>}
  </div>;
}
