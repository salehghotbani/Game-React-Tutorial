import type * as ReactTypes from 'react';
import type { RuntimeTrace } from '@react-quest/shared';

export function createObservation(React: typeof ReactTypes, node: HTMLElement, post: (type: string, data?: Record<string, unknown>) => void) {
  const nativeTimeout = window.setTimeout.bind(window);
  const nativeInterval = window.setInterval.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeClearInterval = window.clearInterval.bind(window);
  const timers = new Map<number, { kind: 'interval' | 'timeout'; callback: () => void; delay: number; next: number; native?: number }>();
  let serial = 0, clock = 0, evaluating = false, effectSerial = 0;
  let storage: Record<string, string> = {};
  const effects = new Map<number, number>();
  const renders = new Map<string, number>();
  let trace: RuntimeTrace[] = [];
  let flush: number | undefined;
  const describe = (value: unknown) => { try { return JSON.stringify(value, (_, item: unknown) => typeof item === 'function' ? '[function]' : typeof item === 'symbol' ? '[symbol]' : item)?.slice(0, 300) ?? String(value); } catch { return '[nested value]'; } };
  const emit = (kind: RuntimeTrace['kind'], label: string, value?: unknown) => {
    if (evaluating) return;
    trace.push({ kind, label, at: Math.round(performance.now()), detail: value === undefined ? undefined : describe(value) });
    trace = trace.slice(-24);
    if (flush === undefined) flush = nativeTimeout(() => { flush = undefined; post('trace', { events: trace, renders: Object.fromEntries(renders) }); }, 70);
  };
  const component = (name: string) => {
    const calls = (renders.get(name) ?? 0) + 1;
    renders.set(name, calls);
    if (calls > 300) throw new Error('Render limit exceeded: check your Effect dependencies or state update.');
    emit('render', name);
  };
  Object.assign(globalThis, { __reactQuestTrace: { component } });
  const schedule = (kind: 'interval' | 'timeout', handler: TimerHandler, delay = 0, args: unknown[] = []) => {
    if (typeof handler !== 'function') throw new Error('Use a function as the timer callback.');
    const id = ++serial;
    const milliseconds = Math.max(kind === 'interval' ? 10 : 0, Number(delay) || 0);
    const callback = () => { if (kind === 'timeout') timers.delete(id); (handler as (...args: unknown[]) => void)(...args); };
    const native = evaluating ? undefined : kind === 'interval' ? nativeInterval(callback, milliseconds) : nativeTimeout(callback, milliseconds);
    timers.set(id, { kind, callback, delay: milliseconds, next: clock + milliseconds, native });
    return id;
  };
  const clear = (id?: number) => { const timer = id === undefined ? undefined : timers.get(id); if (timer?.native !== undefined) { nativeClearInterval(timer.native); nativeClearTimeout(timer.native); } if (id !== undefined) timers.delete(id); };
  window.setInterval = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => schedule('interval', handler, delay, args)) as typeof window.setInterval;
  window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => schedule('timeout', handler, delay, args)) as typeof window.setTimeout;
  window.clearInterval = clear as typeof window.clearInterval;
  window.clearTimeout = clear as typeof window.clearTimeout;
  const delay = (milliseconds = 40) => new Promise<void>(resolve => nativeTimeout(resolve, milliseconds));
  const advance = async (milliseconds: number) => {
    const end = clock + Math.min(10000, Math.max(0, milliseconds));
    for (let calls = 0; calls < 300; calls++) {
      const due = [...timers.entries()].filter(([, timer]) => timer.next <= end).sort((a, b) => a[1].next - b[1].next)[0];
      if (!due) break;
      const [id, timer] = due;
      clock = timer.next;
      if (timer.kind === 'interval') timer.next += timer.delay; else timers.delete(id);
      timer.callback();
      await delay();
    }
    clock = end;
  };
  const reset = () => { for (const id of timers.keys()) clear(id); effects.clear(); effectSerial = 0; clock = 0; renders.clear(); trace = []; };
  const setStorage = (value: Record<string, string>) => { storage = { ...value }; };
  const persist = () => { if (!evaluating) post('storage', { values: storage }); };
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => storage[String(key)] ?? null,
    setItem: (key: string, value: string) => { key = String(key); if (['__proto__', 'constructor', 'prototype'].includes(key) || key.length > 128 || String(value).length > 65536 || Object.keys(storage).length > 30) throw new Error('Lesson storage limit exceeded.'); storage[key] = String(value); persist(); },
    removeItem: (key: string) => { delete storage[String(key)]; persist(); }, clear: () => { storage = {}; persist(); }, key: (index: number) => Object.keys(storage)[index] ?? null,
    get length() { return Object.keys(storage).length; }
  } });
  window.fetch = async (resource: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof resource === 'string' ? resource : resource instanceof URL ? resource.href : resource.url, 'https://lesson.local');
    emit('request', `${init?.method ?? 'GET'} ${url.pathname}`, Object.fromEntries(url.searchParams));
    const signal = init?.signal;
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(80);
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const failed = url.pathname === '/api/fail' || url.searchParams.get('city') === 'Error';
    let data: unknown;
    if (failed) data = { message: 'Service unavailable' };
    else if (url.pathname === '/api/weather') { const city = url.searchParams.get('city') ?? 'Tehran'; data = { city, temperature: city === 'Shiraz' ? 30 : 24 }; }
    else if (url.pathname === '/api/movies') data = (url.searchParams.get('q') ?? '').toLowerCase().includes('hook') ? [{ id: 3, title: 'Hooks Lab' }] : [{ id: 1, title: 'React Story' }, { id: 2, title: 'State Wars' }];
    else if (url.pathname === '/api/users') data = [{ id: 1, name: 'Ada', role: 'Admin' }, { id: 2, name: 'Grace', role: 'Reader' }];
    else throw new Error('The lesson API only supports /api/weather, /api/movies, /api/users and /api/fail.');
    emit('request', `${failed ? 500 : 200} ${url.pathname}`, data);
    return new Response(JSON.stringify(data), { status: failed ? 500 : 200, headers: { 'Content-Type': 'application/json' } });
  };
  function useObservedState<S>(initial: S | (() => S)): [S, ReactTypes.Dispatch<ReactTypes.SetStateAction<S>>] {
    const [value, update] = React.useState(initial);
    emit('state', 'State snapshot', value);
    return [value, next => { emit('state', 'setState', typeof next === 'function' ? '[updater]' : next); update(next); }];
  }
  function useObservedEffect(effect: ReactTypes.EffectCallback, dependencies?: ReactTypes.DependencyList) {
    const id = React.useRef<number | null>(null);
    if (id.current === null) id.current = ++effectSerial;
    const effectId = id.current;
    // The learner's exact dependencies are under test; adding wrapper dependencies would change the lesson's behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { effects.set(effectId, (effects.get(effectId) ?? 0) + 1); emit('effect', `Effect ${effectId}`, dependencies); const cleanup = effect(); return () => { emit('effect', `Cleanup ${effectId}`); cleanup?.(); }; }, dependencies);
  }
  const observed = { ...React, useState: useObservedState, useEffect: useObservedEffect, createElement: ((type: ReactTypes.ElementType, props: Record<string, unknown> | null, ...children: ReactTypes.ReactNode[]) => {
    const element = React.createElement(type, props, ...children);
    if (typeof type === 'function') {
      // Read actual element props: key is React metadata, and JSX children arrive as props.children.
      const publicProps = { ...(element.props as Record<string, unknown>) };
      if (publicProps.children !== undefined) publicProps.children = React.Children.toArray(publicProps.children as ReactTypes.ReactNode).map(child => React.isValidElement(child) ? typeof child.type === 'string' ? child.type : typeof child.type === 'function' ? child.type.name : 'Element' : child);
      emit('props', type.name || 'Component', publicProps);
    }
    return element;
  }) as typeof React.createElement } as typeof React;
  new MutationObserver(() => emit('dom', 'DOM updated', node.textContent?.slice(0, 160))).observe(node, { childList: true, subtree: true, characterData: true, attributes: true });
  return { React: observed, delay, advance, reset, emit, effects, timers, getStorage: () => ({ ...storage }), setStorage, setEvaluating(value: boolean) { evaluating = value; } };
}
