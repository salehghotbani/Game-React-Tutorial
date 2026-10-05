import { describe, expect, it } from 'vitest';
import { defaultPanelLayout, fitPanelSizes, resizePanelPair, restorePanelLayout, type PanelSpec } from './workspaceLayout';

const specs: PanelSpec[] = [
  {id:'path',size:180,height:320,minWidth:145,minHeight:180},
  {id:'mission',size:260,height:520,minWidth:230,minHeight:270},
  {id:'editor',size:360,height:520,minWidth:280,minHeight:280},
  {id:'preview',size:300,height:520,minWidth:240,minHeight:240}
];
const minimums = specs.map(p=>({id:p.id,minimum:p.minWidth}));
const sizes = defaultPanelLayout(specs).columns;
describe('splitter sizing and saved layout', () => {
  it('fits a changed viewport without squeezing visible panes below their minimum', () => {
    const fitted = fitPanelSizes({...sizes,path:1},minimums,1100);
    expect(fitted.path).toBe(145);
    expect(Object.values(fitted).reduce((sum,n)=>sum+n,0)).toBeCloseTo(1100);
    for (const p of minimums) expect(fitted[p.id]!).toBeGreaterThanOrEqual(p.minimum);
  });
  it('resizes only the adjacent pair and clamps extreme movement', () => {
    const before = fitPanelSizes(sizes,minimums,1400);
    const resized = resizePanelPair(sizes,minimums,'editor','preview',100,1400);
    const after = fitPanelSizes(resized,minimums,1400);
    expect(after.editor).toBeCloseTo(before.editor!+100);
    expect(after.preview).toBeCloseTo(before.preview!-100);
    expect(after.path).toBeCloseTo(before.path!);
    const extreme = fitPanelSizes(resizePanelPair(sizes,minimums,'editor','preview',100000,1400),minimums,1400);
    expect(extreme.preview).toBeCloseTo(240);
    expect(Object.values(extreme).reduce((sum,n)=>sum+n,0)).toBeCloseTo(1400);
  });
  it('retains hidden pane weights and makes too-small containers finite', () => {
    const visible = minimums.filter(p=>p.id!=='path');
    expect(resizePanelPair(sizes,visible,'editor','preview',50,1000).path).toBe(180);
    const fitted = fitPanelSizes(sizes,minimums,200);
    expect(Object.values(fitted).every(n=>Number.isFinite(n)&&n>0)).toBe(true);
    expect(Object.values(fitted).reduce((sum,n)=>sum+n,0)).toBeCloseTo(200);
    expect(resizePanelPair(sizes,minimums,'editor','preview',NaN,1400)).toEqual(sizes);
  });
  it('restores known panels, accepts closing everything and rejects corrupt sizes', () => {
    const restored = restorePanelLayout({version:1,hidden:['editor','unknown','editor'],columns:{editor:500,path:NaN,preview:-1},rows:{editor:600}},specs);
    expect(restored.hidden).toEqual(['editor']);
    expect(restored.columns).toEqual({...sizes,editor:500});
    expect(restored.rows.editor).toBe(600);
    expect(restorePanelLayout({version:1,hidden:specs.map(p=>p.id)},specs).hidden).toHaveLength(4);
    expect(restorePanelLayout({version:9},specs)).toEqual(defaultPanelLayout(specs));
  });
});
