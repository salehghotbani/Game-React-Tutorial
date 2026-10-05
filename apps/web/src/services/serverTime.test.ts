import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchServerTime, timeFromHeaders } from './serverTime';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('hosting clock', () => {
  it('adjusts the origin date by CDN age without the browser calendar', () => {
    expect(timeFromHeaders(new Headers({ date: 'Mon, 05 Oct 2026 12:00:00 GMT', age: '37' }))).toBe(Date.UTC(2026, 9, 5, 12, 0, 37));
    expect(timeFromHeaders(new Headers({ date: 'Mon, 05 Oct 2026 12:00:00 GMT' }))).toBe(Date.UTC(2026, 9, 5, 12));
  });

  it('rejects missing dates and invalid cache ages instead of inventing a time', () => {
    const values: Record<string, string>[] = [{}, { date: 'invalid' }, { date: 'Mon, 05 Oct 2026 12:00:00 GMT', age: '-1' }, { date: 'Mon, 05 Oct 2026 12:00:00 GMT', age: 'Infinity' }, { date: 'Mon, 05 Oct 2026 12:00:00 GMT', age: '999999999999999999' }];
    for (const value of values) {
      expect(timeFromHeaders(new Headers(value))).toBeNull();
    }
  });

  it('uses HEAD inside the deployment subpath without requesting an API on static hosting', async () => {
    vi.stubEnv('VITE_STATIC_HOST', 'true'); vi.stubEnv('BASE_URL', '/ReactTutorial/');
    const fetch = vi.fn().mockResolvedValue(new Response(null, { headers: { date: 'Mon, 05 Oct 2026 12:00:00 GMT', age: '4' } }));
    vi.stubGlobal('fetch', fetch);
    const signal = new AbortController().signal;
    expect(await fetchServerTime(signal)).toBe(Date.UTC(2026, 9, 5, 12, 0, 4));
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/^\/ReactTutorial\/index\.html\?clock=/), { method: 'HEAD', cache: 'no-store', signal });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retains the precise API clock for local and server-backed hosting', async () => {
    vi.stubEnv('VITE_STATIC_HOST', 'false');
    const fetch = vi.fn().mockResolvedValue(Response.json({ timestamp: 123456789 })); vi.stubGlobal('fetch', fetch);
    const signal = new AbortController().signal;
    expect(await fetchServerTime(signal)).toBe(123456789);
    expect(fetch).toHaveBeenCalledWith('/api/time', { cache: 'no-store', signal });
  });

  it('reports missing or failed hosting clocks', async () => {
    vi.stubEnv('VITE_STATIC_HOST', 'true');
    const fetch = vi.fn().mockResolvedValue(new Response(null)); vi.stubGlobal('fetch', fetch);
    await expect(fetchServerTime(new AbortController().signal)).rejects.toThrow('Hosting clock unavailable');
    fetch.mockResolvedValue(new Response(null, { status: 404, headers: { date: 'Mon, 05 Oct 2026 12:00:00 GMT' } }));
    await expect(fetchServerTime(new AbortController().signal)).rejects.toThrow('Hosting clock unavailable');
  });
});
