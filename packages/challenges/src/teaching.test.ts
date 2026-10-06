import { describe, expect, it } from 'vitest';
import { challenges, chapters, getChapterLesson, getTeachingLesson } from './index';
import { compileCode } from '../../learning-engine/src/compiler/compile';

describe('beginner curriculum', () => {
  it('teaches React, tags, functions and JSX before the first task', () => {
    expect(getTeachingLesson(challenges[0]!).steps.map(s=>s.id)).toEqual(['what-react','html','function','jsx','ready']);
  });
  it('covers every chapter with learning goals, a valid self-check and a runnable example', () => {
    const examples = new Set<string>();
    for (const chapter of chapters) {
      const lesson = getChapterLesson(chapter.id);
      expect(lesson.outcomes.length, chapter.title).toBeGreaterThanOrEqual(2);
      expect(lesson.steps.length, chapter.title).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.steps.map(step => step.id)).size).toBe(lesson.steps.length);
      expect(lesson.steps.some(step => step.preview), chapter.title).toBe(true);
      expect(lesson.checkpoint.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.checkpoint.answer).toBeGreaterThanOrEqual(0);
      expect(lesson.checkpoint.answer).toBeLessThan(lesson.checkpoint.options.length);
      expect(lesson.checkpoint.explanation.length).toBeGreaterThan(20);
      for (const step of lesson.steps) if (step.preview) examples.add(step.preview);
    }
    for (const source of examples) expect(compileCode(source).code).toBeTruthy();
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
