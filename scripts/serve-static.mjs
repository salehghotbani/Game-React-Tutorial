import { createServer } from 'node:http';
import { access, readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../apps/web/dist/', import.meta.url));
const base = process.argv[2] ?? '/';
const port = Number(process.argv[3] ?? 4180);
if (!base.startsWith('/') || !base.endsWith('/') || /[?#\\%]/.test(base) || base.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('Supply a base path with leading/trailing slashes, e.g. /Game-React-Tutorial/.');
}
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Supply a valid TCP port.');
await access(resolve(root, 'index.html'));

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.wasm': 'application/wasm', '.map': 'application/json' };

function reply(response, status, text) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }).end(text);
}

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { reply(response, 400, 'Invalid path'); return; }
  if (!pathname.startsWith(base)) { reply(response, 404, 'Use the configured base path.'); return; }
  const target = resolve(root, pathname.slice(base.length) || 'index.html');
  const fromRoot = relative(root, target);
  if (isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) {
    reply(response, 403, 'Path outside build output');
    return;
  }
  try {
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream', 'Content-Length': content.length, 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { reply(response, 404, 'File not found'); }
});

server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Static preview: http://127.0.0.1:${port}${base} (files only; no API or isolation headers)`));
