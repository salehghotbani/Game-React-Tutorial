import { describe, expect, it } from 'vitest';
import { matchesText } from './textMatch';

describe('behavioral copy comparison', () => {
  it('accepts sentence punctuation, capitalization and harmless whitespace', () => {
    expect(matchesText(' my React journey\n starts here ', 'My React journey starts here.')).toBe(true);
    expect(matchesText(' سلام دنیا! ', 'سلام دنیا')).toBe(true);
    expect(matchesText('Hello   Ada.', 'Hello Ada')).toBe(true);
  });
  it('keeps meaningful data and numerical differences strict', () => {
    const different: [string, string][] = [['-1','1'], ['1.5','15'], ['$19.9','$199'], ['Ada','Mina'], ['ada@example.com.','ada@example.com'], ['Tehran 25°C','Tehran 24°C']];
    for (const [actual, expected] of different) expect(matchesText(actual,expected)).toBe(false);
    expect(matchesText('1.', '1')).toBe(false);
    expect(matchesText('hello.', 'Hello', true)).toBe(false);
    expect(matchesText(undefined, '')).toBe(false);
  });
});
