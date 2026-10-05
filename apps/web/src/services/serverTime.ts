/** HTTP dates have second precision; Age accounts for time held in a CDN cache. */
export function timeFromHeaders(headers: Headers): number | null {
  const date = headers.get('date');
  if (!date) return null;
  const timestamp = Date.parse(date);
  const age = headers.get('age') ?? '0';
  if (!Number.isFinite(timestamp) || timestamp <= 0 || !/^\d+$/.test(age)) return null;
  const adjusted = timestamp + Number(age) * 1000;
  return Number.isSafeInteger(adjusted) ? adjusted : null;
}

export async function fetchServerTime(signal: AbortSignal): Promise<number> {
  if (import.meta.env.VITE_STATIC_HOST === 'true') {
    // Same-origin headers remain readable on Pages, without an API or CORS proxy.
    const response = await fetch(`${import.meta.env.BASE_URL}index.html?clock=${crypto.randomUUID()}`, {
      method: 'HEAD', cache: 'no-store', signal
    });
    const timestamp = response.ok ? timeFromHeaders(response.headers) : null;
    if (timestamp === null) throw new Error('Hosting clock unavailable');
    return timestamp;
  }

  const response = await fetch('/api/time', { cache: 'no-store', signal });
  if (!response.ok) throw new Error('Clock unavailable');
  const body: unknown = await response.json();
  if (!body || typeof body !== 'object' || !('timestamp' in body) || typeof body.timestamp !== 'number' || !Number.isFinite(body.timestamp) || body.timestamp <= 0) throw new Error('Invalid server clock');
  return body.timestamp;
}
