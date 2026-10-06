import { describe, expect, it } from 'vitest';
import { gameSlice, resetPlayer, setMovementSpeed, togglePause, setCameraView, setDestination, setThemeMode } from './gameSlice';

describe('game settings', () => {
  const initial = gameSlice.reducer(undefined, { type: 'init' });
  it('limits movement speed and rejects invalid values', () => {
    expect(gameSlice.reducer(initial, setMovementSpeed(100)).movementSpeed).toBe(5);
    expect(gameSlice.reducer(initial, setMovementSpeed(-1)).movementSpeed).toBe(1.5);
    expect(gameSlice.reducer(initial, setMovementSpeed(NaN)).movementSpeed).toBe(initial.movementSpeed);
  });
  it('toggles pause and resets only the player, preserving settings', () => {
    const paused = gameSlice.reducer(initial, togglePause());
    expect(paused.paused).toBe(true);
    const reset = gameSlice.reducer(paused, resetPlayer());
    expect(reset.resetToken).toBe(1);
    expect(reset.paused).toBe(true);
    expect(reset.movementSpeed).toBe(initial.movementSpeed);
  });
  it('preserves the chosen camera through a player reset', () => {
    const chosen = gameSlice.reducer(initial, setCameraView('firstPerson'));
    expect(gameSlice.reducer(chosen, resetPlayer()).cameraView).toBe('firstPerson');
  });
  it('confirms and preserves each appearance choice without resetting learning or the camera', () => {
    for (const mode of ['light', 'dark', 'auto'] as const) {
      const chosen = gameSlice.reducer(initial, setThemeMode(mode));
      expect(chosen.themeChosen).toBe(true);
      expect(gameSlice.reducer(chosen, resetPlayer()).themeMode).toBe(mode);
      expect(chosen.cameraView).toBe(initial.cameraView);
    }
  });
  it('accepts home destinations while rejecting invalid world coordinates', () => {
    expect(gameSlice.reducer(initial, setDestination({ x: -7, z: 2.5 })).destination).toEqual({ x: -7, z: 2.5 });
    expect(gameSlice.reducer(initial, setDestination({ x: 100, z: 0 })).destination).toBeUndefined();
    expect(gameSlice.reducer(initial, setDestination({ x: 0, z: 15 })).destination).toBeUndefined();
    expect(gameSlice.reducer(initial, setDestination({ x: 0, z: NaN })).destination).toBeUndefined();
  });
});
