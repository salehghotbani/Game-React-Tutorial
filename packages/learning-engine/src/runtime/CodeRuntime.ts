import localPreviewScript from 'virtual:react-quest-preview';
import bridgeSource from 'virtual:react-quest-bridge';
import { WebContainer, type WebContainerProcess, type FileSystemTree } from '@webcontainer/api';
import type { Challenge, CompiledCode, CodeAnalysis, RuntimeTrace, EvaluationResult, TestResult } from '@react-quest/shared';
import { compileInWorker } from '../compiler/CodeCompiler';
import { evaluateResults } from '../evaluation';
import { previewStyle } from './previewStyle';

export type RuntimeKind = 'auto' | 'local' | 'webcontainer';
export type RuntimeStatus = {
  phase: 'idle' | 'compiling' | 'booting' | 'installing' | 'starting' | 'ready' | 'evaluating' | 'error';
  engine: 'local' | 'webcontainer';
  message: string;
  logs: string;
  fallbackReason?: string;
};
export const idleStatus: RuntimeStatus = { phase: 'idle', engine: 'local', message: 'کدت را بنویس و اجرا کن.', logs: '' };

let bootPromise: Promise<WebContainer> | undefined;
function bootContainer() {
  if (!bootPromise) bootPromise = WebContainer.boot({ coep: 'credentialless', forwardPreviewErrors: 'exceptions-only' }).catch((error: unknown) => { bootPromise = undefined; throw error; });
  return bootPromise;
}

function timeout<T>(promise: Promise<T>, milliseconds: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), milliseconds);
    promise.then((value) => { clearTimeout(timer); resolve(value); }, (error: unknown) => { clearTimeout(timer); reject(error); });
  });
}

type Pending = { resolve: (value: Record<string, unknown>) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

export class CodeRuntime {
  private frame?: HTMLIFrameElement;
  private generation = 0;
  private status: RuntimeStatus = { ...idleStatus };
  private compiled?: CompiledCode;
  private source?: string;
  private pending = new Map<string, Pending>();
  private ready?: { resolve: () => void; reject: (error: Error) => void };
  private process?: WebContainerProcess;
  private container?: WebContainer;
  private serverUrl?: string;
  private unsubscribe: (() => void)[] = [];
  private language: 'fa' | 'en' = 'fa';

  constructor(private notify: (status: RuntimeStatus) => void, private observe?: {
    analysis?: (analysis: CodeAnalysis) => void;
    trace?: (events: RuntimeTrace[], renders: Record<string, number>) => void;
    storage?: (values: Record<string, string>) => void;
    initialStorage?: Record<string, string>;
  }) {}

  attach(frame: HTMLIFrameElement) {
    this.frame = frame;
    this.setLocale(document.documentElement.lang === 'fa' ? 'fa' : 'en');
    window.addEventListener('message', this.onMessage);
    return () => this.dispose();
  }

  setLocale(language: 'fa' | 'en') {
    this.language = language;
    this.frame?.contentWindow?.postMessage({ channel: 'react-quest-preview', type: 'locale', language }, '*');
  }

  private update(patch: Partial<RuntimeStatus>) { this.status = { ...this.status, ...patch }; this.notify(this.status); }
  private log(text: string) { this.update({ logs: (this.status.logs + text).slice(-8000) }); }

  private onMessage = (event: MessageEvent) => {
    if (!this.frame || event.source !== this.frame.contentWindow || event.data?.channel !== 'react-quest-preview') return;
    const data = event.data as Record<string, unknown>;
    if (data.type === 'trace' && Array.isArray(data.events) && data.renders && typeof data.renders === 'object') {
      const events = data.events.slice(-24).filter((item): item is RuntimeTrace => !!item && typeof item === 'object' && ['state','render','dom','props','effect','request','store','query'].includes(item.kind) && typeof item.label === 'string' && item.label.length <= 300 && typeof item.at === 'number' && Number.isFinite(item.at) && (item.detail === undefined || typeof item.detail === 'string' && item.detail.length <= 300));
      const renders = Object.fromEntries(Object.entries(data.renders).slice(0,64).filter(([name,count])=>name.length<=128 && typeof count==='number' && Number.isFinite(count) && count>=0 && count<=10000)) as Record<string,number>;
      this.observe?.trace?.(events,renders);
    }
    if (data.type === 'storage' && data.values && typeof data.values === 'object') {
      const values = Object.fromEntries(Object.entries(data.values).slice(0,30).filter(([key,value])=>!['__proto__','constructor','prototype'].includes(key) && key.length<=128 && typeof value==='string' && value.length<=65536)) as Record<string,string>;
      if (this.observe) this.observe.initialStorage = values;
      this.observe?.storage?.(values);
    }
    if (data.type === 'ready') { this.setLocale(this.language); this.ready?.resolve(); }
    if (data.type === 'error' && typeof data.message === 'string') {
      this.ready?.reject(new Error(data.message));
      this.update({ phase: 'error', message: data.message });
    }
    if (typeof data.id === 'string') {
      const pending = this.pending.get(data.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(data.id);
      if (data.type === 'failed') pending.reject(new Error(String(data.message)));
      else pending.resolve(data);
    }
  };

  private send(type: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error('پیش‌نمایش پاسخ نداد. حلقه‌ها و خطاهای کد را بررسی کن.')); }, 12000);
      this.pending.set(id, { resolve, reject, timer });
      this.frame?.contentWindow?.postMessage({ channel: 'react-quest-preview', type, id, ...payload }, '*');
    });
  }

  private async loadFrame(load: () => void) {
    let ping: ReturnType<typeof setInterval> | undefined;
    try {
      await timeout(new Promise<void>((resolve, reject) => {
        this.ready = { resolve, reject };
        load();
        ping = setInterval(() => this.frame?.contentWindow?.postMessage({ channel: 'react-quest-preview', type: 'ping', id: 'boot' }, '*'), 150);
      }), 15000, 'پیش‌نمایش آماده نشد. اتصال یا تنظیمات مرورگر را بررسی کن.');
    } finally { if (ping) clearInterval(ping); this.ready = undefined; }
  }

  private async runLocal(compiled: CompiledCode) {
    this.update({ engine: 'local', phase: 'starting', message: 'آماده‌سازی پیش‌نمایش React…' });
    await this.loadFrame(() => {
      this.frame!.setAttribute('sandbox', 'allow-scripts allow-forms');
      this.frame!.removeAttribute('src');
      const script = localPreviewScript.replace(/<\/script/gi, '<\\/script');
      this.frame!.srcdoc = `<!doctype html><html lang="${this.language}" dir="${this.language === 'fa' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; form-action 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:;"><style>${previewStyle}</style></head><body><div id="root"></div><script>${script}</script></body></html>`;
    });
    await this.send('render', { code: compiled.code, storage: this.observe?.initialStorage ?? {} });
  }

  private stream(process: WebContainerProcess) {
    void process.output.pipeTo(new WritableStream({ write: (text: string) => this.log(text) })).catch(() => undefined);
  }

  private project(source: string): FileSystemTree {
    return {
      'package.json': { file: { contents: JSON.stringify({ name: 'react-quest-challenge', packageManager: 'pnpm@11.19.0', type: 'module', scripts: { dev: 'vite --host 0.0.0.0 --port 3111' }, dependencies: { react: '19.2.0', 'react-dom': '19.2.0', vite: '6.4.1', 'react-router-dom': '^7.9.0', '@reduxjs/toolkit': '^2.9.0', 'react-redux': '^9.2.0', '@tanstack/react-query': '^5.90.0', '@testing-library/react': '^16.3.0' } }) } },
      'index.html': { file: { contents: `<!doctype html><html lang="${this.language}" dir="${this.language === 'fa' ? 'rtl' : 'ltr'}"><head><meta charset="UTF-8"></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>` } },
      'vite.config.js': { file: { contents: 'export default { esbuild: { jsx: "automatic" }, server: { hmr: false, allowedHosts: true, headers: { "Cross-Origin-Embedder-Policy": "credentialless" } } };' } },
      src: { directory: {
        'App.jsx': { file: { contents: source } },
        'bridge.js': { file: { contents: bridgeSource } },
        'style.css': { file: { contents: previewStyle } },
        'main.jsx': { file: { contents: 'import * as React from "react"; import { createRoot } from "react-dom/client"; import * as Router from "react-router-dom"; import * as Toolkit from "@reduxjs/toolkit"; import * as Redux from "react-redux"; import * as Query from "@tanstack/react-query"; import * as testing from "@testing-library/react"; import { installBridge } from "./bridge.js"; import "./style.css"; installBridge({React, createRoot, testing, libraries: {"react-router-dom":Router,"@reduxjs/toolkit":Toolkit,"react-redux":Redux,"@tanstack/react-query":Query}});' } }
      } }
    };
  }

  private async runContainer(compiled: CompiledCode, generation: number) {
    if (!crossOriginIsolated) throw new Error('این مرورگر در حالت cross-origin isolated نیست.');
    this.update({ engine: 'webcontainer', phase: 'booting', message: 'راه‌اندازی محیط Node در مرورگر…' });
    this.container = await timeout(bootContainer(), 10000, 'ارتباط با سرویس WebContainers برقرار نشد.');
    if (generation !== this.generation) throw new Error('اجرا لغو شد.');
    if (!this.serverUrl) {
      await this.container.mount(this.project(compiled.safeSource));
      let installed = true;
      try { await Promise.all(['react','react-dom','vite','react-router-dom','@reduxjs/toolkit','react-redux','@tanstack/react-query','@testing-library/react'].map(name => this.container!.fs.readFile(`node_modules/${name}/package.json`, 'utf-8'))); } catch { installed = false; }
      if (!installed) {
        this.update({ phase: 'installing', message: 'نصب وابستگی‌های پروژهٔ React؛ فقط بار اول…' });
        const installation = await this.container.spawn('pnpm', ['install']);
        this.process = installation;
        this.stream(installation);
        const exit = await timeout(installation.exit, 45000, 'دریافت وابستگی‌ها با pnpm زمان زیادی برد.');
        if (exit !== 0) throw new Error('نصب وابستگی‌ها ناموفق بود.');
      }
      if (generation !== this.generation) throw new Error('اجرا لغو شد.');
      this.update({ phase: 'starting', message: 'راه‌اندازی Vite…' });
      const serverReady = new Promise<string>((resolve, reject) => {
        this.unsubscribe.push(this.container!.on('server-ready', (_, url) => resolve(url)));
        this.unsubscribe.push(this.container!.on('error', (error) => reject(new Error(error.message))));
      });
      this.process = await this.container.spawn('pnpm', ['run', 'dev']);
      this.stream(this.process);
      this.serverUrl = await timeout(serverReady, 20000, 'سرور Vite آماده نشد.');
    } else await this.container.fs.writeFile('src/App.jsx', compiled.safeSource);
    if (generation !== this.generation) throw new Error('اجرا لغو شد.');
    await this.loadFrame(() => {
      this.frame!.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin');
      this.frame!.removeAttribute('srcdoc');
      this.frame!.src = `${this.serverUrl}?run=${crypto.randomUUID()}`;
    });
    // Both engines run the same compiled module through the observable judge bridge.
    await this.send('render', { code: compiled.code, storage: this.observe?.initialStorage ?? {} });
  }

  async run(source: string, kind: RuntimeKind = 'local') {
    const generation = ++this.generation;
    this.source = undefined;
    this.compiled = undefined;
    this.update({ phase: 'compiling', message: 'بررسی و تبدیل JSX…', logs: '', fallbackReason: undefined });
    try {
      const compiled = await compileInWorker(source);
      this.observe?.analysis?.(compiled.analysis);
      if (generation !== this.generation) throw new Error('اجرا لغو شد.');
      if (kind !== 'local') {
        try { await this.runContainer(compiled, generation); }
        catch (error) {
          this.stopServer();
          if (generation !== this.generation || kind === 'webcontainer') throw error;
          this.update({ fallbackReason: error instanceof Error ? error.message : String(error) });
          await this.runLocal(compiled);
        }
      } else await this.runLocal(compiled);
      if (generation !== this.generation) throw new Error('اجرا لغو شد.');
      this.source = source;
      this.compiled = compiled;
      this.update({ phase: 'ready', message: 'پیش‌نمایش آماده است.' });
    } catch (error) {
      if (generation === this.generation) this.update({ phase: 'error', message: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  async evaluate(challenge: Challenge, source: string, kind: RuntimeKind, answers: Record<string, number> = {}): Promise<EvaluationResult> {
    await this.run(source, kind);
    if (this.source !== source || !this.compiled) throw new Error('کد پس از اجرا تغییر کرده است. دوباره ارسال کن.');
    this.update({ phase: 'evaluating', message: 'اجرای تست‌ها روی کامپوننت واقعی…' });
    try {
      const reply = await this.send('evaluate', { tests: challenge.tests });
      if (!Array.isArray(reply.results) || !reply.results.every((test: unknown) => {
        if (!test || typeof test !== 'object') return false;
        const item = test as Record<string, unknown>;
        return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.passed === 'boolean' && (item.message === undefined || typeof item.message === 'string');
      })) throw new Error('نتیجهٔ تست معتبر نیست.');
      const result = evaluateResults(challenge, reply.results as TestResult[], this.compiled.analysis, answers);
      this.update({ phase: 'ready', message: result.passed ? 'همهٔ تست‌های ضروری موفق شدند.' : 'چند تست هنوز به تغییر نیاز دارند.' });
      return result;
    } catch (error) {
      if (this.frame) this.update({ phase: 'error', message: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  private stopServer() { this.process?.kill(); this.process = undefined; this.serverUrl = undefined; this.unsubscribe.forEach((unsubscribe) => unsubscribe()); this.unsubscribe = []; }

  dispose() {
    this.generation += 1;
    this.ready?.reject(new Error('محیط تمرین بسته شد.'));
    this.ready = undefined;
    for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(new Error('اجرا لغو شد.')); }
    this.pending.clear();
    this.stopServer();
    this.frame = undefined;
    window.removeEventListener('message', this.onMessage);
  }
}
