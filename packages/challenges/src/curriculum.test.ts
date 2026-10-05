import { describe, expect, it } from 'vitest';
import { challenges, chapters, projectDefinitions, rooms, skills } from './index';
import { compileCode } from '../../learning-engine/src/compiler/compile';
import { evaluateResults } from '../../learning-engine/src/evaluation';

describe('education curriculum contracts', () => {
  it('covers every chapter and exercise format with reachable prerequisites', () => {
    expect(chapters.map(c=>c.id)).toEqual(Array.from({length:15},(_,i)=>i));
    expect(new Set(challenges.map(c=>c.kind)).size).toBe(8);
    expect(new Set(challenges.map(c=>c.id)).size).toBe(challenges.length);
    const reached = new Set<string>();
    for(let i=0;i<challenges.length;i++) for(const c of challenges) if(c.prerequisites.every(id=>reached.has(id))) reached.add(c.id);
    expect([...reached].sort()).toEqual(challenges.map(c=>c.id).sort());
    for(const c of chapters) expect(challenges.some(x=>x.chapterId===c.id)).toBe(true);
    for(const room of rooms) for(const skill of room.mastery) expect(challenges.some(c=>c.mastery && c.skills?.includes(skill))).toBe(true);
    for(const skill of skills) expect(challenges.some(c=>c.mastery && c.skills?.includes(skill.id))).toBe(true);
  });
  it('compiles every starter and reference solution and checks source and question requirements', () => {
    for(const c of challenges) {
      compileCode(c.starterFiles['src/App.jsx']!);
      const compiled = compileCode(c.solution!);
      const answers = Object.fromEntries((c.questions??[]).map(q=>[q.id,q.answer]));
      const judged = evaluateResults(c,c.tests.map(t=>({id:t.id,name:t.name,passed:true})),compiled.analysis,answers);
      expect(judged.tests.filter(t=>!t.passed),c.id).toEqual([]);
    }
  });
  it('keeps contiguous project missions and four graduated hints', () => {
    for(const p of projectDefinitions) expect(challenges.filter(c=>c.project?.id===p.id).map(c=>c.project!.step).sort((a,b)=>a-b)).toEqual(Array.from({length:challenges.filter(c=>c.project?.id===p.id).length},(_,i)=>i+1));
    for(const c of challenges) expect(c.hints.length,c.id).toBe(4);
    expect(challenges.filter(c=>c.project?.id==='todo')).toHaveLength(8);
  });
});
