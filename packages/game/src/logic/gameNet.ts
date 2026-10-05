import { GAME_NET } from '../world/layout';

export function canUseGameNet(xp: number): boolean {
  return Number.isFinite(xp) && xp >= GAME_NET.requiredXp;
}

export function gameNetSecondsLeft(deadline: number, now: number): number {
  if (!Number.isFinite(deadline) || !Number.isFinite(now)) return 0;
  return Math.max(0, Math.min(GAME_NET.sessionSeconds, Math.ceil((deadline - now) / 1000)));
}
