import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

/** Hosting proxies may provide the visitor country. Never use the server's own IP as the visitor. */
export function visitorLocalePlugin(): Plugin {
  const install = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use('/api/locale', (request, response) => {
      if (request.method !== 'GET') { response.writeHead(405, { Allow: 'GET' }).end(); return; }
      const header = request.headers['cf-ipcountry'] ?? request.headers['x-vercel-ip-country'];
      const country = typeof header === 'string' && /^[A-Z]{2}$/i.test(header) && !['XX', 'ZZ'].includes(header.toUpperCase()) ? header.toUpperCase() : null;
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', Vary: 'CF-IPCountry, X-Vercel-IP-Country' });
      response.end(JSON.stringify({ country }));
    });
  };
  return { name: 'react-quest-visitor-locale', configureServer: install, configurePreviewServer: install };
}
