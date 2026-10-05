import { languageForCountry } from '@react-quest/localization';

export function countryFromResponse(value: unknown): string | null {
  if (!value || typeof value !== 'object' || !('country' in value) || languageForCountry(value.country) === null) return null;
  return (value.country as string).toUpperCase();
}
async function lookup(url: string, parent: AbortSignal): Promise<string | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.any([parent, AbortSignal.timeout(4000)]), credentials: 'omit', cache: 'no-store' });
    return response.ok ? countryFromResponse(await response.json()) : null;
  } catch { return null; }
}
export async function detectCountry(signal: AbortSignal): Promise<string | null> {
  const country = import.meta.env.VITE_STATIC_HOST === 'true' ? null : await lookup('/api/locale', signal);
  if (country || signal.aborted) return country;
  // Executed in the visitor's browser, so the public lookup receives the visitor's IP.
  return lookup('https://api.country.is/', signal);
}
