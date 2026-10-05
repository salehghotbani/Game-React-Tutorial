import { describe, expect, it } from 'vitest';
import { answerBug, GAME_DURATION, selectBug, startArcade, tickArcade } from './engine';

describe('Bug Hunter', () => {
  it('runs a three-minute round with three lives and moving bugs', () => {
    const started = startArcade();
    expect(started.remaining).toBe(GAME_DURATION);
    expect(started.health).toBe(3);
    const spawned = tickArcade(started, 1, () => 0.5);
    expect(spawned.bugs).toHaveLength(1);
    expect(tickArcade(spawned, 1).bugs[0]!.y).toBeGreaterThan(0);
  });
  it('freezes time on a question and destroys a correctly answered bug', () => {
    const selected = selectBug(tickArcade(startArcade(), 1, () => 0.5), 1);
    expect(tickArcade(selected, 10)).toBe(selected);
    const answered = answerBug(selected, 1);
    expect(answered.score).toBe(100);
    expect(answered.kills).toBe(1);
    expect(answered.bugs).toHaveLength(0);
    expect(answered.phase).toBe('playing');
  });
  it('lets a wrongly answered bug continue faster without awarding points', () => {
    const selected = selectBug(tickArcade(startArcade(), 1, () => 0.5), 1);
    const answered = answerBug(selected, 0);
    expect(answered.score).toBe(0);
    expect(answered.bugs[0]!.speed).toBeGreaterThan(selected.bugs[0]!.speed);
    expect(answered.phase).toBe('playing');
  });
  it('ends when three bugs reach the server or time expires', () => {
    const state = { ...startArcade(), bugs: [1, 2, 3].map((id) => ({ id, x: 0.5, y: 0.99, speed: 1 })) };
    expect(tickArcade(state, 1).phase).toBe('finished');
    expect(tickArcade(state, 1).health).toBe(0);
    expect(tickArcade({ ...startArcade(), remaining: 0.1 }, 1).phase).toBe('finished');
  });
});
