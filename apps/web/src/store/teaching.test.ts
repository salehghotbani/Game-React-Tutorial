import { describe, expect, it } from 'vitest';
import { getChallenge, getTeachingLesson } from '@react-quest/challenges';
import { advanceLesson, answerQuestion, completeChallenge, progressSlice, startPractice, selectChallenge } from './progressSlice';
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
  it('opens mid-course lessons and arbitrary sections without granting rewards', () => {
    let state = progressSlice.reducer(emptyProgress, selectChallenge('build-board'));
    state = progressSlice.reducer(state, advanceLesson({id:'build-board',step:2}));
    state = restoreProgress({version:3,...state});
    expect(state.selectedChallengeId).toBe('build-board');
    expect(state.lessonSteps['build-board']).toBe(3);
    expect(state.completedLessons).toEqual([]);
    expect(getProgressTotals(state).xp).toBe(0);
    expect(progressSlice.reducer(state, advanceLesson({id:'build-board',step:999}))).toEqual(state);
  });
  it('lets experienced learners start practice without claiming mastery or earlier completion', () => {
    const state = progressSlice.reducer(emptyProgress, startPractice('build-budget'));
    expect(state.learnedLessons).toEqual(['build-budget']);
    expect(state.completedLessons).toEqual([]);
    expect(getSkillStatus(state,'architecture')).toBe('introduced');
    expect(getProgressTotals(state).xp).toBe(0);
    expect(restoreProgress({version:3,...state}).learnedLessons).toEqual(['build-budget']);
    expect(progressSlice.reducer(state,startPractice('unknown'))).toEqual(state);
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
