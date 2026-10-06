import type * as ReactTypes from 'react';
import type { createRoot as CreateRoot } from 'react-dom/client';
import type { ChallengeTest, TestResult } from '@react-quest/shared';
import { createObservation } from './observability';
import { matchesText, normalizeText } from '../textMatch';

type Modules = Record<string, unknown>;
type Testing = typeof import('@testing-library/react');
type Config = { React: typeof ReactTypes; createRoot: typeof CreateRoot; modules?: Modules; libraries?: Record<string, Record<string, unknown>>; testing?: Testing };

export function installBridge({ React: originalReact, createRoot, modules: initialModules, libraries = {}, testing }: Config) {
  let modules = initialModules;
  const node = document.getElementById('root')!;
  let root: ReturnType<typeof createRoot> | undefined;
  let renderingError = '', callbackCount = 0;
  let ready = !initialModules;
  const channel = 'react-quest-preview';
  const post = (type: string, data: Record<string, unknown> = {}) => window.parent.postMessage({ channel, type, ...data }, '*');
  const observation = createObservation(originalReact, node, post);
  const React = observation.React;
  const errorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);
  const unmount = () => { root?.unmount(); root = undefined; testing?.cleanup(); node.replaceChildren(); };
  const render = async (name = 'default', props: Record<string, unknown> = {}, fresh = true) => {
    if (fresh) unmount();
    renderingError = '';
    const component = modules?.[name];
    if (!component || (typeof component !== 'function' && typeof component !== 'object')) throw new Error(`کامپوننت export شدهٔ ${name} پیدا نشد.`);
    root ??= createRoot(node, { onUncaughtError(error) { renderingError = errorMessage(error); post('error', { message: renderingError }); } });
    root.render(React.createElement(component as ReactTypes.ComponentType<Record<string, unknown>>, props));
    await observation.delay();
    if (renderingError) throw new Error(renderingError);
  };
  const imports: Record<string, unknown> = { ...libraries, react: React, ...(testing ? { '@testing-library/react': testing } : {}) };
  const toolkit = libraries['@reduxjs/toolkit'];
  if (toolkit?.configureStore) imports['@reduxjs/toolkit'] = { ...toolkit, configureStore: (options: unknown) => {
    const store = (toolkit.configureStore as (options: unknown) => { dispatch: (action: unknown) => unknown; getState: () => unknown })(options);
    const dispatch = store.dispatch;
    store.dispatch = action => { observation.emit('store', 'dispatch → reducer', action); const result = dispatch(action); observation.emit('store', 'Store updated', store.getState()); return result; };
    return store;
  } };
  const query = libraries['@tanstack/react-query'];
  if (query?.QueryClient) {
    type CacheEvent = { type: string; query?: { queryKey: unknown; state?: { status?: string; data?: unknown } } };
    const Base = query.QueryClient as new (...args: unknown[]) => { getQueryCache: () => { subscribe: (listener: (event: CacheEvent) => void) => unknown } };
    class ObservedQueryClient extends Base { constructor(...args: unknown[]) { super(...args); this.getQueryCache().subscribe(event => observation.emit('query', `${event.type}: Query cache`, { key: event.query?.queryKey, status: event.query?.state?.status, data: event.query?.state?.data })); } }
    imports['@tanstack/react-query'] = { ...query, QueryClient: ObservedQueryClient };
  }
  window.addEventListener('error', event => post('error', { message: event.message }));
  window.addEventListener('unhandledrejection', event => post('error', { message: errorMessage(event.reason) }));
  const runStudentTest = async (mutant: boolean) => {
    if (!testing || typeof modules?.testCounter !== 'function') throw new Error('تابع testCounter و Testing Library لازم‌اند.');
    unmount();
    const testContainer = document.createElement('div');
    node.append(testContainer);
    let assertions = 0;
    const expect = (received: unknown) => ({
      toHaveTextContent(expected: string) { assertions++; if (!(received instanceof Element) || received.textContent?.trim() !== expected) throw new Error(`متن مورد انتظار ${expected} پیدا نشد.`); },
      toBe(expected: unknown) { assertions++; if (received !== expected) throw new Error(`انتظار ${String(expected)} بود.`); },
      toBeInTheDocument() { assertions++; if (!(received instanceof Element) || !document.contains(received)) throw new Error('عنصر در document نیست.'); }
    });
    const Broken = () => React.createElement('main', null, React.createElement('output', { role: 'status' }, '0'), React.createElement('button', null, '+1'));
    let failure: unknown;
    try {
      await (modules.testCounter as (api: unknown) => Promise<void>)({ ...testing, render: (element: ReactTypes.ReactNode) => testing.render(mutant ? React.createElement(Broken) : element, { container: testContainer, baseElement: node }), expect });
    } catch (error) { failure = error; }
    testing.cleanup();
    if (!mutant && failure) throw failure;
    if (!mutant && assertions < 2) throw new Error('حداقل دو assertion برای مقدار اولیه و پس از کلیک بنویس.');
    if (mutant && !failure) throw new Error('تستت نسخهٔ بدون به‌روزرسانی را هم قبول کرد؛ رفتار پس از کلیک را بررسی کن.');
  };
  window.addEventListener('message', async (event: MessageEvent) => {
    if (event.source !== window.parent || event.data?.channel !== channel) return;
    const request = event.data as { type: string; id: string; code?: string; tests?: ChallengeTest[]; storage?: Record<string, string>; language?: string };
    try {
      if (request.type === 'locale' && (request.language === 'fa' || request.language === 'en')) {
        document.documentElement.lang = request.language;
        document.documentElement.dir = request.language === 'fa' ? 'rtl' : 'ltr';
      }
      if (request.type === 'render') {
        unmount(); observation.reset(); observation.setStorage(request.storage ?? {});
        const exported: { exports: Modules } = { exports: {} };
        const require = (name: string) => { if (name in imports) return imports[name]; throw new Error(`این کتابخانه در آزمایشگاه موجود نیست: ${name}`); };
        new Function('require', 'module', 'exports', 'React', request.code!)(require, exported, exported.exports, React);
        modules = exported.exports;
        await render();
        post('rendered', { id: request.id });
      }
      if (request.type === 'storage-init') { observation.setStorage(request.storage ?? {}); await render(); post('rendered', { id: request.id }); }
      if (request.type === 'evaluate') {
        const previousStorage = observation.getStorage();
        const results: TestResult[] = [];
        observation.setEvaluating(true);
        try {
          for (const test of request.tests ?? []) {
            if (test.questionId) continue;
            try {
              unmount(); observation.reset(); observation.setStorage({}); callbackCount = 0;
              await render();
              for (const step of test.steps) {
                if (step.type === 'render' || step.type === 'rerender') {
                  const props: Record<string, unknown> = { ...step.props };
                  if (step.type === 'render' && step.callbackProp) props[step.callbackProp] = () => { callbackCount++; };
                  await render(step.component, props, step.type === 'render');
                } else if (step.type === 'remount') await render();
                else if (step.type === 'unmount') { unmount(); await observation.delay(); }
                else if (step.type === 'clock') await observation.advance(step.milliseconds);
                else if (step.type === 'timer-count') {
                  const active = [...observation.timers.values()].filter(timer => timer.kind === 'interval').length;
                  if (active !== step.count) throw new Error(`${active} interval فعال مانده؛ انتظار ${step.count}.`);
                } else if (step.type === 'effect-count') {
                  const runs = observation.effects.get(step.index) ?? 0;
                  if (runs > step.max) throw new Error(`Effect ${runs} بار اجرا شد؛ dependencyها را بررسی کن.`);
                } else if (step.type === 'wait') { await observation.advance(step.milliseconds); await observation.delay(step.milliseconds); }
                else if (step.type === 'storage') { if (!localStorage.getItem(step.key)?.includes(step.contains)) throw new Error(`دادهٔ ${step.key} ذخیره نشده است.`); }
                else if (step.type === 'student-test') await runStudentTest(step.mutant);
                else if (step.type === 'callback') { if (callbackCount !== step.count) throw new Error(`تابع ${callbackCount} بار اجرا شد؛ انتظار ${step.count}.`); }
                else if (step.type === 'count') { const n = node.querySelectorAll(step.selector).length; if (n !== step.count) throw new Error(`${step.selector}: تعداد ${n} است؛ انتظار ${step.count}.`); }
                else if (step.type === 'wait-text') {
                  const start = performance.now();
                  while (!matchesText(node.querySelector(step.selector)?.textContent, step.text) && performance.now() - start < (step.timeout ?? 1200)) { await observation.advance(50); await observation.delay(); if (renderingError) throw new Error(renderingError); }
                  if (!matchesText(node.querySelector(step.selector)?.textContent, step.text)) throw new Error(`متن ${step.text} در زمان انتظار ظاهر نشد.`);
                } else {
                  const element = node.querySelector<HTMLElement>(step.selector);
                  if (!element) throw new Error(`عنصر ${step.selector} پیدا نشد.`);
                  if (step.type === 'text' && !matchesText(element.textContent, step.text, step.exact)) throw new Error(`متن مورد انتظار: ${step.text}؛ متن فعلی: ${element.textContent?.trim() || '(خالی)'}`);
                  if (step.type === 'nonempty-text' && !normalizeText(element.textContent ?? '').replace(/[\s\p{P}\p{S}]/gu, '')) throw new Error('این بخش هنوز متن ندارد؛ یک عنوان یا جملهٔ دلخواه بنویس.');
                  if (step.type === 'attribute' && element.getAttribute(step.name) !== step.value) throw new Error(`ویژگی ${step.name} باید ${step.value} باشد.`);
                  if (step.type === 'focus' && document.activeElement !== element) throw new Error('input فوکوس نگرفته است.');
                  if (step.type === 'click') for (let i = 0; i < (step.times ?? 1); i++) { element.click(); await observation.delay(); if (renderingError) throw new Error(renderingError); }
                  if (step.type === 'input') {
                    if (element instanceof HTMLSelectElement) { element.value = step.value; element.dispatchEvent(new Event('change', { bubbles: true })); }
                    else {
                      const setter = Object.getOwnPropertyDescriptor(element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value')?.set;
                      setter?.call(element, step.value); element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    await observation.delay();
                  }
                  if (step.type === 'check' && element instanceof HTMLInputElement && element.checked !== step.checked) { element.click(); await observation.delay(); }
                }
              }
              results.push({ id: test.id, name: test.name, passed: true });
            } catch (error) { results.push({ id: test.id, name: test.name, passed: false, message: errorMessage(error) }); }
          }
        } finally {
          unmount(); observation.reset(); observation.setStorage(previousStorage); observation.setEvaluating(false);
          try { await render(); } catch { /* Failures are shown in the test results. */ }
        }
        post('evaluated', { id: request.id, results });
      }
      if (request.type === 'ping' && ready) post('ready', { id: request.id });
    } catch (error) { post('failed', { id: request.id, message: errorMessage(error) }); }
  });
  if (initialModules) void render().then(() => { ready = true; post('ready'); }).catch(error => post('error', { message: errorMessage(error) }));
  else post('ready');
}
