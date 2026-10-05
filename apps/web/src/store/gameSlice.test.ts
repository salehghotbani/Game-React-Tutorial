import { describe, expect, it } from 'vitest';
import { gameSlice, resetPlayer, setMovementSpeed, togglePause, setCameraView, setDestination, setThemeMode, startDriving, requestCarExit } from './gameSlice';

describe('game settings', () => {
  const initial = gameSlice.reducer(undefined, { type: 'init' });
  it('limits movement speed and rejects invalid values', () => {
    expect(gameSlice.reducer(initial, setMovementSpeed(100)).movementSpeed).toBe(5);
    expect(gameSlice.reducer(initial, setMovementSpeed(-1)).movementSpeed).toBe(1.5);
    expect(gameSlice.reducer(initial, setMovementSpeed(NaN)).movementSpeed).toBe(initial.movementSpeed);
  });
  it('gates driving and exit requests while preserving camera and walking preferences', () => {
    expect(gameSlice.reducer(initial, startDriving(1999)).mode).toBe('explore');
    expect(gameSlice.reducer(initial, startDriving(Infinity)).mode).toBe('explore');
    expect(gameSlice.reducer({ ...initial, paused: true }, startDriving(2000)).mode).toBe('explore');
    const driving = gameSlice.reducer(initial, startDriving(2000));
    expect(driving.mode).toBe('driving'); expect(driving.movementSpeed).toBe(initial.movementSpeed);
    expect(gameSlice.reducer(driving, setDestination({ x: 24, z: 25 })).destination).toBeUndefined();
    expect(gameSlice.reducer(driving, requestCarExit()).vehicleExitRequest).toBe(1);
    expect(gameSlice.reducer(initial, requestCarExit()).vehicleExitRequest).toBeUndefined();
    expect(gameSlice.reducer(driving, resetPlayer()).mode).toBe('explore');
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
  it('accepts neighborhood destinations while rejecting invalid world coordinates', () => {
    expect(gameSlice.reducer(initial, setDestination({ x: -15, z: 7.3 })).destination).toEqual({ x: -15, z: 7.3 });
    expect(gameSlice.reducer(initial, setDestination({ x: 100, z: 0 })).destination).toBeUndefined();
    expect(gameSlice.reducer(initial, setDestination({ x: 0, z: NaN })).destination).toBeUndefined();
  });
});
