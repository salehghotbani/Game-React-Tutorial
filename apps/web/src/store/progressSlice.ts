import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getChallenge, getTeachingLesson, isChallengeAvailable } from '@react-quest/challenges';
import { isSuccessfulEvaluation } from '@react-quest/learning-engine/evaluation';
import type { EvaluationResult } from '@react-quest/shared';
import { cleanStorage, dailyChallenge, dayKey, emptyProgress, getDraft, getProgressTotals, hintFactor, isRoomAvailable, type ProgressState } from './progression';
import { getRoomRewards } from './roomLife';

export const progressSlice = createSlice({
  name: 'progress', initialState: emptyProgress as ProgressState,
  reducers: {
    selectChallenge(state, action: PayloadAction<string>) {
      const challenge = getChallenge(action.payload);
      if (!challenge || !isChallengeAvailable(challenge, state.completedLessons)) return;
      if (challenge.project && !state.drafts[challenge.id]) {
        const previous = Object.keys(state.drafts).map(getChallenge).filter(c => c?.project?.id === challenge.project!.id && c.project.step < challenge.project!.step && state.completedLessons.includes(c.id)).sort((a, b) => b!.project!.step - a!.project!.step)[0];
        if (previous) state.drafts[challenge.id] = state.drafts[previous.id]!;
      }
      state.selectedChallengeId = challenge.id;
    },
    saveDraft(state, action: PayloadAction<{ id: string; code: string }>) { if (getChallenge(action.payload.id) && action.payload.code.length <= 65536) state.drafts[action.payload.id] = action.payload.code; },
    advanceLesson(state, action: PayloadAction<{id: string; step: number}>) {
      const c = getChallenge(action.payload.id);
      if (!c || !isChallengeAvailable(c, state.completedLessons) || state.learnedLessons.includes(c.id)) return;
      const current = state.lessonSteps[c.id] ?? 0;
      if (current !== action.payload.step) return;
      const count = getTeachingLesson(c).steps.length;
      state.lessonSteps[c.id] = Math.min(count, current + 1);
      if (state.lessonSteps[c.id] === count) {
        state.learnedLessons.push(c.id);
        for (const skill of c.skills ?? []) if (!state.introduced.includes(skill)) state.introduced.push(skill);
      }
    },
    revealHint(state, action: PayloadAction<string>) { const c = getChallenge(action.payload); if (!c || c.mastery) return; const a = state.assistance[c.id] ??= { hints: 0, solution: false }; a.hints = Math.min(c.hints.length, 4, a.hints + 1); },
    revealSolution(state, action: PayloadAction<string>) { const c = getChallenge(action.payload); if (!c || c.mastery || !c.solution) return; (state.assistance[c.id] ??= { hints: 0, solution: false }).solution = true; },
    answerQuestion(state, action: PayloadAction<{ id: string; question: string; answer: number }>) { const { id, question, answer } = action.payload; const q = getChallenge(id)?.questions?.find(x => x.id === question); if (state.learnedLessons.includes(id) && q && Number.isInteger(answer) && answer >= 0 && answer < q.options.length) (state.answers[id] ??= {})[question] = answer; },
    completeChallenge(state, action: PayloadAction<{ id: string; source: string; result: EvaluationResult; answers?: Record<string, number>; at?: number; daily?: boolean }>) {
      const { id, source, result, answers = {}, at = Date.now(), daily } = action.payload, c = getChallenge(id);
      if (!c || !state.learnedLessons.includes(id) || !isChallengeAvailable(c, state.completedLessons) || source !== getDraft(state, c) || !Number.isFinite(at)) return;
      for (const q of c.questions ?? []) if (answers[q.id] !== state.answers[id]?.[q.id]) return;
      const passed = isSuccessfulEvaluation(c, result);
      const dailyId = dailyChallenge(state, at).id;
      state.attempts.push({ id, at, failed: result.tests.filter(t => !t.passed).map(t => t.id) }); state.attempts = state.attempts.slice(-200);
      if (!passed) return;
      const help = state.assistance[id] ?? { hints: 0, solution: false };
      if (c.mastery && (help.hints || help.solution)) return;
      if (!state.completedLessons.includes(id)) { state.completedLessons.push(id); state.receipts[id] = { xp: Math.floor(c.xp * hintFactor(help.hints, help.solution)), coins: c.coins, at, hints: help.hints, solution: help.solution, mastery: c.mastery === true }; }
      state.reviewed[id] = at;
      if (daily && dailyId === id && !state.dailyDays.includes(dayKey(at))) state.dailyDays.push(dayKey(at));
    },
    saveProjectStorage(state, action: PayloadAction<{ id: string; values: Record<string, string> }>) { if (getChallenge(state.selectedChallengeId)?.project?.id === action.payload.id || state.selectedChallengeId === action.payload.id) state.projectStorage[action.payload.id] = cleanStorage(action.payload.values); },
    assignDaily(state) { const c = dailyChallenge(state); state.dailyAssignments[dayKey()] = c.id; },
    visitRoom(state, action: PayloadAction<string>) { if (isRoomAvailable(state, action.payload)) state.selectedRoom = action.payload; },
    waterPlant(state) { const id=state.completedLessons.find(id=>!state.roomLife.wateredLessons.includes(id)); if(id) state.roomLife.wateredLessons.push(id); },
    collectRoomKey(state) { if(getRoomRewards(state.completedLessons,state.roomLife).keyEarned) state.roomLife.keyCollected=true; },
    openGreenhouse(state) { if(state.roomLife.keyCollected) state.roomLife.greenhouseOpen=true; },
    bookmarkRoomBook(state, action: PayloadAction<{id:string; page:number}>) {
      const {id,page}=action.payload, c=getChallenge(id);
      if(c && (id==='hello-react'||state.completedLessons.includes(id)) && Number.isInteger(page) && page>=0 && page<getTeachingLesson(c).steps.length) state.roomLife.bookPages[id]=page;
    },
    recordArcadeScore(state, action: PayloadAction<number>) { if (Number.isFinite(action.payload) && getProgressTotals(state).xp >= 1000) state.arcadeBestScore = Math.min(100000, Math.max(state.arcadeBestScore, Math.floor(action.payload))); }
  }
});
export const { selectChallenge, saveDraft, completeChallenge, recordArcadeScore, advanceLesson, revealHint, revealSolution, answerQuestion, saveProjectStorage, assignDaily, visitRoom, waterPlant, collectRoomKey, openGreenhouse, bookmarkRoomBook } = progressSlice.actions;
