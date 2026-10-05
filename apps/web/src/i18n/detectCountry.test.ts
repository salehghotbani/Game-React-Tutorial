import { afterEach, describe, expect, it, vi } from 'vitest';
import { countryFromResponse, detectCountry } from './detectCountry';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('visitor country lookup', () => {
  it('validates country data and discards IP and unrelated fields', () => {
    expect(countryFromResponse({ country: 'ir', ip: '198.51.100.1' })).toBe('IR');
    for (const value of [null, { country: 'XX' }, { country: '<script>' }, { location: 'IR' }]) expect(countryFromResponse(value)).toBeNull();
  });
  it('uses a hosting country without querying a third party', async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ country: 'IR' })));
    vi.stubGlobal('fetch', request);
    expect(await detectCountry(new AbortController().signal)).toBe('IR'); expect(request).toHaveBeenCalledTimes(1);
  });
  it('queries from the visitor browser when hosting has no country', async () => {
    const request = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ country: null }))).mockResolvedValueOnce(new Response(JSON.stringify({ country: 'DE', ip: '198.51.100.1' })));
    vi.stubGlobal('fetch', request);
    expect(await detectCountry(new AbortController().signal)).toBe('DE'); expect(request.mock.calls[1]?.[0]).toBe('https://api.country.is/');
  });
  it('skips the nonexistent hosting API on GitHub Pages', async () => {
    vi.stubEnv('VITE_STATIC_HOST', 'true');
    const request = vi.fn().mockResolvedValue(Response.json({ country: 'IR' })); vi.stubGlobal('fetch', request);
    expect(await detectCountry(new AbortController().signal)).toBe('IR');
    expect(request).toHaveBeenCalledWith('https://api.country.is/', expect.objectContaining({ credentials: 'omit' }));
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('returns unknown on network failure and does not continue an aborted lookup', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await detectCountry(new AbortController().signal)).toBeNull();
    const controller = new AbortController(); controller.abort();
    const request = vi.fn().mockRejectedValue(new Error('aborted')); vi.stubGlobal('fetch', request);
    expect(await detectCountry(controller.signal)).toBeNull(); expect(request).toHaveBeenCalledTimes(1);
  });
});
