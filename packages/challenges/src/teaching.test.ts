import { describe, expect, it } from 'vitest';
import { challenges, getChapterLesson, getTeachingLesson } from './index';
import { compileCode } from '../../learning-engine/src/compiler/compile';

describe('beginner curriculum', () => {
  it('teaches React, tags, functions and JSX before the first task', () => {
    expect(getTeachingLesson(challenges[0]!).steps.map(s=>s.id)).toEqual(['what-react','html','function','jsx','ready']);
  });
  it('provides explanation before every assessment and compiles all executable examples', () => {
    const examples = new Set<string>();
    for (const c of challenges) {
      const lesson = getTeachingLesson(c);
      expect(lesson.steps.length).toBeGreaterThan(2);
      expect(lesson.steps.at(-1)?.id).toBe('ready');
      expect(new Set(lesson.steps.map(s=>s.id)).size, c.id).toBe(lesson.steps.length);
      for (const step of lesson.steps) {
        expect(step.paragraphs.length).toBeGreaterThan(0);
        if (step.preview) examples.add(step.preview);
      }
    }
    for (const source of examples) expect(compileCode(source).code).toBeTruthy();
    expect(examples.size).toBeGreaterThan(10);
    expect(getChapterLesson(1).steps[0]?.id).toBe('what-react');
  });
});
