import { describe, expect, it } from 'vitest';
import { getChallenge, getTeachingLesson } from '@react-quest/challenges';
import { advanceLesson, answerQuestion, completeChallenge, progressSlice } from './progressSlice';
import { dailyChallenge, emptyProgress, getProgressTotals, getSkillStatus, restoreProgress } from './progression';
import { learn } from './progressTestHelpers';

describe('teaching before assessment', () => {
  it('rejects answers and awards before the explanation is completed', () => {
    const c = getChallenge('js-map')!;
    const state = progressSlice.reducer(emptyProgress, answerQuestion({ id:c.id, question:'map', answer:1 }));
    expect(state.answers[c.id]).toBeUndefined();
    const award = completeChallenge({ id:c.id, source:c.starterFiles['src/App.jsx']!, result:{passed:true,score:100,tests:c.tests.map(t=>({id:t.id,name:t.name,passed:true}))} });
    expect(progressSlice.reducer(state, award).completedLessons).toEqual([]);
  });
  it('prevents skipping a teaching step and resumes a partially read lesson', () => {
    const skipped = progressSlice.reducer(emptyProgress, advanceLesson({id:'hello-react',step:3}));
    expect(skipped.learnedLessons).toEqual([]);
    let state = progressSlice.reducer(skipped, advanceLesson({id:'hello-react',step:0}));
    state = restoreProgress({version:3,...state});
    expect(state.lessonSteps['hello-react']).toBe(1);
    expect(state.learnedLessons).toEqual([]);
    expect(progressSlice.reducer(state, advanceLesson({id:'profile-card',step:0})).lessonSteps['profile-card']).toBeUndefined();
  });
  it('introduces a skill after the lesson, without reward or assistance penalty', () => {
    const state = learn(emptyProgress,'hello-react');
    expect(state.learnedLessons).toContain('hello-react');
    expect(getSkillStatus(state,'jsx')).toBe('introduced');
    expect(getProgressTotals(state).xp).toBe(0);
    expect(state.assistance).toEqual({});
    expect(restoreProgress({version:3,...state}).learnedLessons).toEqual(['hello-react']);
  });
  it('keeps historic rewards and allows revisiting passed exercises', () => {
    const state = restoreProgress({version:2, completedLessons:['hello-react'], receipts:{'hello-react':{hints:1}}});
    expect(getProgressTotals(state).xp).toBe(180);
    expect(state.learnedLessons).toEqual(['hello-react']);
    expect(state.lessonSteps['hello-react']).toBe(getTeachingLesson(getChallenge('hello-react')!).steps.length);
    expect(state.learnedLessons).not.toContain('js-map');
  });
  it('starts a new learner with the React introduction even on the daily entry', () => {
    for (const at of [Date.now(), Date.now()+86400000, Date.now()+2*86400000]) expect(dailyChallenge(emptyProgress,at).id).toBe('hello-react');
  });
});
