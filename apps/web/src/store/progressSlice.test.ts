import { describe, expect, it } from 'vitest';
import { challenges } from '@react-quest/challenges';
import { completeChallenge, progressSlice, saveDraft, selectChallenge } from './progressSlice';
import { emptyProgress, getAchievements, getLevelInfo, getProgressTotals, getUnlocks, restoreProgress } from './progression';
import { learn } from './progressTestHelpers';

const resultFor = (index: number) => ({ passed: true, score: 100, tests: challenges[index]!.tests.map((test) => ({ id: test.id, name: test.name, passed: true })) });

describe('progression and persistence', () => {
  it('derives unique achievements from lesson completion and finished arcade scores', () => {
    expect(getAchievements([], 0)).toEqual([]);
    expect(getAchievements(['hello-react', 'hello-react'], 499).map((achievement) => achievement.id)).toEqual(['first-component']);
    const state = restoreProgress({ version: 1, completedLessons: challenges.map((challenge) => challenge.id), arcadeBestScore: 500 });
    expect(getAchievements(state.completedLessons, state.arcadeBestScore).map((achievement) => achievement.id)).toEqual(['first-component', 'react-foundations', 'bug-hunter']);
  });
  it('awards XP only once, even after restoration', () => {
    const first = challenges[0]!;
    const award = completeChallenge({ id: first.id, source: first.starterFiles['src/App.jsx']!, result: resultFor(0) });
    const completed = progressSlice.reducer(learn(emptyProgress, first.id), award);
    const repeated = progressSlice.reducer(completed, award);
    expect(getProgressTotals(repeated.completedLessons)).toEqual({ xp: 200, coins: 20 });
    const restored = restoreProgress({ version: 1, ...repeated });
    expect(progressSlice.reducer(restored, award).completedLessons).toHaveLength(1);
  });
  it('rejects failed, stale and locked submissions', () => {
    const first = challenges[0]!;
    const failed = progressSlice.reducer(learn(emptyProgress, first.id), completeChallenge({ id: first.id, source: first.starterFiles['src/App.jsx']!, result: { ...resultFor(0), passed: false } }));
    expect(failed.completedLessons).toEqual([]);
    const modified = progressSlice.reducer(learn(emptyProgress, first.id), saveDraft({ id: first.id, code: 'changed code' }));
    expect(progressSlice.reducer(modified, completeChallenge({ id: first.id, source: first.starterFiles['src/App.jsx']!, result: resultFor(0) })).completedLessons).toEqual([]);
    expect(progressSlice.reducer(emptyProgress, selectChallenge(challenges[4]!.id)).selectedChallengeId).toBe(first.id);
  });
  it('unlocks the arcade only after all five 200-XP lessons', () => {
    let state = emptyProgress;
    challenges.slice(0,5).forEach((challenge, index) => { state = progressSlice.reducer(learn(state, challenge.id), completeChallenge({ id: challenge.id, source: challenge.starterFiles['src/App.jsx']!, result: resultFor(index) })); });
    expect(getProgressTotals(state.completedLessons)).toEqual({ xp: 1000, coins: 120 });
    expect(getUnlocks(999)).not.toContain('arcade');
    expect(getUnlocks(1000)).toContain('arcade');
    expect(getLevelInfo(1000).level).toBe(2);
    expect(getLevelInfo(1200).level).toBe(3);
  });
  it('restores valid prerequisite chains and derives XP rather than trusting saved totals', () => {
    const restored = restoreProgress({ version: 1, completedLessons: ['hello-react', 'hello-react', 'unknown', 'state-counter'], xp: 99999, drafts: { 'hello-react': 'saved JSX', unknown: 'bad' }, selectedChallengeId: 'state-counter' });
    expect(restored.completedLessons).toEqual(['hello-react']);
    expect(getProgressTotals(restored.completedLessons).xp).toBe(200);
    expect(restored.drafts).toEqual({ 'hello-react': 'saved JSX' });
    expect(restored.selectedChallengeId).toBe('hello-react');
    expect(restoreProgress({ version: 999 })).toEqual(emptyProgress);
  });
});
