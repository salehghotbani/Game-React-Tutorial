import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

/** The same HTTP clock is available in development and the built preview server. */
export function serverTimePlugin(): Plugin {
  const install = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use('/api/time', (request, response) => {
      if (request.method !== 'GET') {
        response.writeHead(405, { Allow: 'GET' }).end();
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ timestamp: Date.now(), timeZone: 'Asia/Tehran' }));
    });
  };
  return { name: 'react-quest-server-clock', configureServer: install, configurePreviewServer: install };
}
