import { bugQuestions } from './questions';

export const GAME_DURATION = 180;
export type Bug = { id: number; x: number; y: number; speed: number };
export type ArcadeState = { phase: 'ready' | 'playing' | 'question' | 'finished'; remaining: number; health: number; score: number; kills: number; bugs: Bug[]; nextId: number; spawnIn: number; selectedId?: number; questionIndex: number; feedback: string };

export function createArcadeState(): ArcadeState { return { phase: 'ready', remaining: GAME_DURATION, health: 3, score: 0, kills: 0, bugs: [], nextId: 1, spawnIn: 0.5, questionIndex: 0, feedback: '' }; }
export function startArcade(): ArcadeState { return { ...createArcadeState(), phase: 'playing' }; }

export function tickArcade(state: ArcadeState, delta: number, random: () => number = Math.random): ArcadeState {
  if (state.phase !== 'playing' || !Number.isFinite(delta) || delta <= 0) return state;
  const elapsed = Math.min(delta, state.remaining);
  const bugs = state.bugs.map((bug) => ({ ...bug, y: bug.y + elapsed * bug.speed }));
  const hit = bugs.filter((bug) => bug.y >= 1).length;
  const next: ArcadeState = { ...state, remaining: Math.max(0, state.remaining - elapsed), health: Math.max(0, state.health - hit), bugs: bugs.filter((bug) => bug.y < 1), spawnIn: state.spawnIn - elapsed };
  if (next.health === 0 || next.remaining === 0) return { ...next, phase: 'finished' };
  if (next.spawnIn <= 0 && next.bugs.length < 12) {
    next.bugs.push({ id: next.nextId, x: 0.12 + random() * 0.76, y: 0, speed: 0.025 + random() * 0.008 + (GAME_DURATION - next.remaining) * 0.00006 });
    next.nextId += 1;
    next.spawnIn = Math.max(1.8, 4 - (GAME_DURATION - next.remaining) / 90);
  }
  return next;
}

export function selectBug(state: ArcadeState, id: number): ArcadeState {
  if (state.phase !== 'playing' || !state.bugs.some((bug) => bug.id === id)) return state;
  return { ...state, phase: 'question', selectedId: id, feedback: '' };
}

export function answerBug(state: ArcadeState, answer: number): ArcadeState {
  if (state.phase !== 'question' || state.selectedId === undefined || !Number.isInteger(answer) || answer < 0 || answer > 2) return state;
  const question = bugQuestions[state.questionIndex % bugQuestions.length]!;
  const correct = answer === question.correct;
  return {
    ...state, phase: 'playing', selectedId: undefined, questionIndex: state.questionIndex + 1,
    bugs: correct ? state.bugs.filter((bug) => bug.id !== state.selectedId) : state.bugs.map((bug) => bug.id === state.selectedId ? { ...bug, speed: bug.speed * 1.25 } : bug),
    score: state.score + (correct ? 100 : 0), kills: state.kills + (correct ? 1 : 0),
    feedback: `${correct ? 'باگ نابود شد!' : 'باگ فرار کرد و سریع‌تر شد.'} ${question.explanation}`
  };
}
