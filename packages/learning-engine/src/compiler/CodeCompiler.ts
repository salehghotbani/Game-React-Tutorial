import CompilerWorker from './compile.worker?worker';
import type { CompiledCode } from '@react-quest/shared';

export function compileInWorker(source: string): Promise<CompiledCode> {
  return new Promise((resolve, reject) => {
    const worker = new CompilerWorker();
    const timeout = window.setTimeout(() => { worker.terminate(); reject(new Error('زمان تبدیل کد تمام شد. فایل را بررسی و دوباره اجرا کن.')); }, 10000);
    const finish = () => { clearTimeout(timeout); worker.terminate(); };
    worker.onmessage = (event: MessageEvent<{ result?: CompiledCode; error?: string }>) => {
      finish();
      if (event.data.result) resolve(event.data.result);
      else reject(new Error(event.data.error || 'تبدیل کد ناموفق بود.'));
    };
    worker.onerror = (event) => { finish(); reject(new Error(event.message)); };
    worker.postMessage({ source });
  });
}
