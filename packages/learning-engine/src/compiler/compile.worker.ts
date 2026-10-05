import { compileCode } from './compile';

self.onmessage = (event: MessageEvent<{ source: string }>) => {
  try { self.postMessage({ result: compileCode(event.data.source) }); }
  catch (error) { self.postMessage({ error: error instanceof Error ? error.message : String(error) }); }
};
