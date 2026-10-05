import { getTeachingLesson, getChallenge } from '@react-quest/challenges';
import { advanceLesson, progressSlice } from './progressSlice';
import type { ProgressState } from './progression';

export function learn(state: ProgressState, id: string): ProgressState {
  for (let step = state.lessonSteps[id] ?? 0; step < getTeachingLesson(getChallenge(id)!).steps.length; step++) {
    state = progressSlice.reducer(state, advanceLesson({id, step}));
  }
  return state;
}
