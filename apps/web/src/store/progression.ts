import { challenges, foundationIds, getChallenge, getTeachingLesson, isChallengeAvailable, hasRecommendedPrerequisites, rooms } from '@react-quest/challenges';
import type { Challenge, RoomLife } from '@react-quest/shared';
import { emptyRoomLife, restoreRoomLife } from './roomLife';

export const SAVE_KEY = 'react-quest-progress-v1'; // Stable key migrates the existing local profile in place.
export type Receipt = { xp: number; coins: number; at: number; hints: number; solution: boolean; mastery: boolean };
export type Attempt = { id: string; at: number; failed: string[] };
export type Assistance = { hints: number; solution: boolean };
export type ProgressState = {
  completedLessons: string[]; drafts: Record<string, string>; selectedChallengeId: string; arcadeBestScore: number;
  receipts: Record<string, Receipt>; assistance: Record<string, Assistance>; answers: Record<string, Record<string, number>>;
  introduced: string[]; attempts: Attempt[]; reviewed: Record<string, number>; projectStorage: Record<string, Record<string, string>>;
  dailyDays: string[]; dailyAssignments: Record<string,string>; selectedRoom: string;
  learnedLessons: string[]; lessonSteps: Record<string, number>;
  roomLife: RoomLife;
};
export const emptyProgress: ProgressState = { completedLessons: [], drafts: {}, selectedChallengeId: challenges[0]!.id, arcadeBestScore: 0, receipts: {}, assistance: {}, answers: {}, introduced: [], attempts: [], reviewed: {}, projectStorage: {}, dailyDays: [], dailyAssignments: {}, selectedRoom: 'bedroom', learnedLessons: [], lessonSteps: {}, roomLife:emptyRoomLife };
export const levelThresholds = [0, 500, 1200, 2200, 3500];
export const unlockDefinitions = [{ id: 'arcade', xp: 1000, label: 'Bug Hunter' }, { id: 'kitchen', xp: 2500, label: 'آشپزخانه' }, { id: 'garden', xp: 5000, label: 'باغ' }] as const;
export const hintFactor = (hints: number, solution = false) => solution ? 0.3 : [1, .9, .75, .6, .45][Math.min(4, Math.max(0, hints))]!;
export function getProgressTotals(progress: ProgressState | string[]) {
  if (Array.isArray(progress)) { const lessons = challenges.filter(c => progress.includes(c.id)); return { xp: lessons.reduce((n, c) => n + c.xp, 0), coins: lessons.reduce((n, c) => n + c.coins, 0) }; }
  return { xp: Object.values(progress.receipts).reduce((n, r) => n + r.xp, 0) + progress.dailyDays.length * 20, coins: Object.values(progress.receipts).reduce((n, r) => n + r.coins, 0) };
}
export function getLevelInfo(xp: number) { const last = levelThresholds.at(-1)!; const level = xp >= last ? levelThresholds.length + Math.floor((xp - last) / 1500) : Math.max(1, levelThresholds.filter(n => xp >= n).length), floor = levelThresholds[level - 1] ?? last + (level - levelThresholds.length) * 1500, next = levelThresholds[level] ?? floor + 1500; return { level, floor, next, fraction: Math.max(0, Math.min(1, (xp - floor) / (next - floor))) }; }
export function getUnlocks(xp: number) { return unlockDefinitions.filter(u => xp >= u.xp).map(u => u.id); }
export function getAchievements(completed: string[], arcadeBestScore: number) { return [...(completed.includes('hello-react') ? [{ id: 'first-component', label: 'اولین کامپوننت' }] : []), ...(foundationIds.every(id => completed.includes(id)) ? [{ id: 'react-foundations', label: 'پایه‌های React' }] : []), ...(arcadeBestScore >= 500 ? [{ id: 'bug-hunter', label: 'شکارچی باگ' }] : [])]; }
export function getSkillStatus(state: ProgressState, skill: string): 'new' | 'introduced' | 'practiced' | 'mastered' {
  const completed = challenges.filter(c => c.skills?.includes(skill) && state.receipts[c.id]);
  if (completed.some(c => state.receipts[c.id]?.mastery)) return 'mastered';
  if (completed.length) return 'practiced';
  return state.introduced.includes(skill) ? 'introduced' : 'new';
}
export const skillLabels = { new: 'یاد نگرفته', introduced: 'آشنا شده', practiced: 'تمرین کرده', mastered: 'مسلط' };
export function isRoomAvailable(_state: ProgressState, id: string) { return rooms.some(room => room.id === id); }
export function getDraft(state: ProgressState, challenge: Challenge) { return state.drafts[challenge.id] ?? challenge.starterFiles['src/App.jsx'] ?? ''; }
export function dayKey(at = Date.now()) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran', calendar: 'gregory', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at); }
export function getStreak(state: ProgressState, at = Date.now()) {
  let day = new Date(`${dayKey(at)}T12:00:00Z`), count = 0;
  if (!state.dailyDays.includes(dayKey(day.getTime()))) day = new Date(day.getTime() - 86400000);
  while (state.dailyDays.includes(dayKey(day.getTime()))) { count++; day = new Date(day.getTime() - 86400000); }
  return count;
}
export function dueChallenges(state: ProgressState, at = Date.now()) { return challenges.filter(c => state.receipts[c.id] && at - (state.reviewed[c.id] ?? state.receipts[c.id]!.at) >= (state.receipts[c.id]!.mastery ? 14 : 3) * 86400000); }
export function recommendations(state: ProgressState, at = Date.now()) {
  const open = challenges.filter(c => hasRecommendedPrerequisites(c, state.completedLessons) && !state.completedLessons.includes(c.id));
  const recentFailed = [...state.attempts].reverse().find(a => a.failed.length && open.some(c => c.id === a.id));
  const failed = recentFailed && getChallenge(recentFailed.id);
  return [...(failed ? [failed] : []), ...dueChallenges(state, at).slice(0, 1), ...open.filter(c => c.mastery && c.skills?.some(s => getSkillStatus(state, s) === 'practiced')), ...open].filter((c, i, all) => all.findIndex(x => x.id === c.id) === i).slice(0, 3);
}
export function dailyChallenge(state: ProgressState, at = Date.now()) {
  const assigned = getChallenge(state.dailyAssignments[dayKey(at)] ?? ''); if (assigned && isChallengeAvailable(assigned)) return assigned;
  if (!state.completedLessons.includes('hello-react')) return challenges[0]!;
  const accessible = challenges.filter(c => hasRecommendedPrerequisites(c, state.completedLessons) && c.kind !== 'boss' && !c.mastery);
  const taught = accessible.filter(c => state.learnedLessons.includes(c.id));
  const pool = taught.length ? taught : accessible;
  const hash = [...dayKey(at)].reduce((sum, x) => sum + x.charCodeAt(0), 0);
  // Fixed selection from the accessible pool, recomputed after unlocking new prerequisites.
  return pool[hash % Math.max(1, pool.length)] ?? challenges[0]!;
}
export function cleanStorage(value: unknown) {
  const result: Record<string, string> = {};
  if (value && typeof value === 'object') for (const [key, item] of Object.entries(value).slice(0, 30)) if (!['__proto__', 'constructor', 'prototype'].includes(key) && key.length <= 128 && typeof item === 'string' && item.length <= 65536) result[key] = item;
  return result;
}
export function restoreProgress(value: unknown): ProgressState {
  const state: ProgressState = structuredClone(emptyProgress);
  if (!value || typeof value !== 'object') return state;
  const data = value as Record<string, unknown>;
  if (data.version !== 1 && data.version !== 2 && data.version !== 3) return state;
  const wanted = Array.isArray(data.completedLessons) ? data.completedLessons : [];
  // Any valid completed exercise can be restored, including learners starting mid-course.
  state.completedLessons = challenges.filter(c => wanted.includes(c.id)).map(c => c.id);
  for (const c of challenges) {
    const code = data.drafts && typeof data.drafts === 'object' ? (data.drafts as Record<string, unknown>)[c.id] : undefined;
    if (typeof code === 'string' && code.length <= 65536) state.drafts[c.id] = code;
    const assist = data.assistance && typeof data.assistance === 'object' ? (data.assistance as Record<string, Assistance>)[c.id] : undefined;
    if (assist && !c.mastery) state.assistance[c.id] = { hints: Math.min(4, Math.max(0, Math.floor(Number(assist.hints) || 0))), solution: assist.solution === true };
    const answers = data.answers && typeof data.answers === 'object' ? (data.answers as Record<string, unknown>)[c.id] : undefined;
    if (answers && typeof answers === 'object') for (const q of c.questions ?? []) { const answer = (answers as Record<string, unknown>)[q.id]; if (typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < q.options.length) (state.answers[c.id] ??= {})[q.id] = answer; }
    if (state.completedLessons.includes(c.id)) {
      const saved = data.version !== 1 && data.receipts && typeof data.receipts === 'object' ? (data.receipts as Record<string, Receipt>)[c.id] : undefined;
      const hints = Math.min(4, Math.max(0, Math.floor(Number(saved?.hints) || 0))), solution = saved?.solution === true;
      state.receipts[c.id] = { xp: Math.floor(c.xp * hintFactor(hints, solution)), coins: c.coins, hints, solution, at: typeof saved?.at === 'number' && Number.isFinite(saved.at) ? Math.max(0, Math.min(Date.now(), saved.at)) : Date.now(), mastery: data.version !== 1 && c.mastery === true && saved?.mastery === true && !hints && !solution };
    }
    const count = getTeachingLesson(c).steps.length;
    const savedStep = data.lessonSteps && typeof data.lessonSteps === 'object' ? (data.lessonSteps as Record<string, unknown>)[c.id] : undefined;
    if (isChallengeAvailable(c) && typeof savedStep === 'number' && Number.isInteger(savedStep) && savedStep >= 0) state.lessonSteps[c.id] = Math.min(count, savedStep);
    // Existing passed exercises remain reviewable; reading a library page alone is not lesson completion.
    if (state.completedLessons.includes(c.id) || state.lessonSteps[c.id] === count) {
      state.learnedLessons.push(c.id);
      state.lessonSteps[c.id] = count;
      for (const skill of c.skills ?? []) if (!state.introduced.includes(skill)) state.introduced.push(skill);
    }
  }
  if (Array.isArray(data.attempts)) state.attempts = data.attempts.filter((a): a is Attempt => !!a && typeof a === 'object' && !!getChallenge(a.id) && typeof a.at === 'number' && Number.isFinite(a.at) && Array.isArray(a.failed) && a.failed.every((x: unknown) => typeof x === 'string')).slice(-200);
  if (data.reviewed && typeof data.reviewed === 'object') for (const [id, at] of Object.entries(data.reviewed)) if (state.receipts[id] && typeof at === 'number' && Number.isFinite(at)) state.reviewed[id] = Math.min(Date.now(), at);
  if (data.projectStorage && typeof data.projectStorage === 'object') for (const [id, storage] of Object.entries(data.projectStorage)) if (challenges.some(c => (c.project?.id ?? c.id) === id)) state.projectStorage[id] = cleanStorage(storage);
  if (Array.isArray(data.dailyDays)) state.dailyDays = [...new Set(data.dailyDays.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= dayKey()))].slice(-40000);
  if (data.dailyAssignments && typeof data.dailyAssignments === 'object') for (const [day,id] of Object.entries(data.dailyAssignments).slice(-400)) if (/^\d{4}-\d{2}-\d{2}$/.test(day) && typeof id === 'string' && getChallenge(id) && isChallengeAvailable(getChallenge(id)!)) state.dailyAssignments[day]=id;
  state.arcadeBestScore = typeof data.arcadeBestScore === 'number' && Number.isFinite(data.arcadeBestScore) ? Math.max(0, Math.min(100000, Math.floor(data.arcadeBestScore))) : 0;
  const selected = getChallenge(String(data.selectedChallengeId));
  if (selected && isChallengeAvailable(selected)) state.selectedChallengeId = selected.id;
  if (typeof data.selectedRoom === 'string' && isRoomAvailable(state, data.selectedRoom)) state.selectedRoom = data.selectedRoom;
  state.roomLife = restoreRoomLife(data.roomLife, state.completedLessons);
  return state;
}
export function loadProgress(): ProgressState { try { if (typeof localStorage !== 'undefined') return restoreProgress(JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')); } catch { /* Start a new local profile when storage is unavailable. */ } return structuredClone(emptyProgress); }
