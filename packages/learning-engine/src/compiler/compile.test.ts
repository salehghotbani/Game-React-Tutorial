import { describe, expect, it } from 'vitest';
import { compileCode } from './compile';

describe('JSX compilation and source evidence', () => {
  it('compiles JSX and detects function components and React hook aliases', () => {
    const result = compileCode('import { useState as state } from "react"; export default function App() { const [n] = state(0); return <output>{n}</output>; }');
    expect(result.code).toContain('React.createElement');
    expect(result.analysis.components).toContain('App');
    expect(result.analysis.hooks).toContain('useState');
  });
  it('does not treat comments or text as hook calls', () => {
    expect(compileCode('export default function App() { /* useState(0) */ return <p>useState</p>; }').analysis.hooks).not.toContain('useState');
  });
  it('guards loops in both local and Vite source', () => {
    const result = compileCode('export default function App() { while (true) {} return <h1>Hi</h1>; }');
    expect(result.code).toContain('Execution limit exceeded');
    expect(result.safeSource).toContain('10000');
  });
  it('reports invalid JSX and rejects oversized files', () => {
    expect(() => compileCode('export default function App(){return <h1>}')).toThrow();
    expect(() => compileCode('x'.repeat(65537))).toThrow();
  });
});
