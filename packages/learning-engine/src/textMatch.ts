/** Compare human-facing copy without making spelling style part of the lesson. */
export function normalizeText(value: string): string {
  return value.normalize('NFC').replace(/\s+/gu, ' ').trim();
}
export function matchesText(actual: string | null | undefined, expected: string, exact = false): boolean {
  if (actual == null) return false;
  const received = normalizeText(actual), wanted = normalizeText(expected);
  if (exact || !/\p{L}/u.test(wanted)) return received === wanted;
  // Only prose at the end of a sentence is relaxed. Signs, decimals, addresses,
  // IDs and punctuation within the content keep their meaning.
  const prose = (value: string) => value.replace(/[.!?؟…。]+$/u, '').trim().toLocaleLowerCase('en');
  if (/@|:\/\//u.test(wanted)) return received === wanted;
  return prose(received) === prose(wanted);
}
