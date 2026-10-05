import { describe, expect, it } from 'vitest';
import { challenges } from '@react-quest/challenges';
import { evaluateResults, isSuccessfulEvaluation } from './evaluation';

describe('challenge judge', () => {
  const counter = challenges[4]!;
  const passing = counter.tests.map((test) => ({ id: test.id, name: test.name, passed: true }));
  it('requires behavior plus actual React hook evidence', () => {
    const withoutHook = evaluateResults(counter, passing, { components: ['App'], hooks: [] });
    expect(withoutHook.passed).toBe(false);
    expect(withoutHook.score).toBe(75);
    expect(evaluateResults(counter, passing, { components: ['App'], hooks: ['useState'] }).passed).toBe(true);
  });
  it('fails missing or failed mandatory tests', () => {
    expect(evaluateResults(counter, passing.slice(1), { components: ['App'], hooks: ['useState'] }).passed).toBe(false);
    expect(evaluateResults(counter, [{ ...passing[0]!, passed: false }, ...passing.slice(1)], { components: ['App'], hooks: ['useState'] }).passed).toBe(false);
  });
  it('rejects duplicate and forged test ids', () => {
    const valid = evaluateResults(counter, passing, { components: ['App'], hooks: ['useState'] });
    expect(isSuccessfulEvaluation(counter, valid)).toBe(true);
    expect(isSuccessfulEvaluation(counter, { ...valid, tests: [valid.tests[0]!, valid.tests[0]!, ...valid.tests.slice(2)] })).toBe(false);
    expect(isSuccessfulEvaluation(counter, { passed: true, score: 100, tests: [] })).toBe(false);
  });
});
