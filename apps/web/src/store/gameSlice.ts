import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { PLAYER_CONFIG, WORLD_BOUNDS, canDrive } from '@react-quest/game';
import type { GameMode, GameSettings, ThemeMode } from '@react-quest/shared';

const initialState: GameSettings = {
  movementSpeed: PLAYER_CONFIG.speed,
  paused: false,
  showPhysics: false,
  resetToken: 0,
  mode: 'explore',
  cameraView: loadCameraPreference(),
  ...loadThemePreference()
};

function loadThemePreference(): Pick<GameSettings, 'themeMode' | 'themeChosen'> {
  try {
    const saved = localStorage.getItem('react-quest-theme-v1');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return { themeMode: saved, themeChosen: true };
  } catch { /* Ask again when storage is unavailable. */ }
  return { themeMode: 'auto', themeChosen: false };
}

function loadCameraPreference(): GameSettings['cameraView'] {
  try { return localStorage.getItem('react-quest-camera-v1') === 'firstPerson' ? 'firstPerson' : 'thirdPerson'; }
  catch { return 'thirdPerson'; }
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setMovementSpeed(state, action: PayloadAction<number>) {
      if (Number.isFinite(action.payload)) state.movementSpeed = Math.max(PLAYER_CONFIG.minSpeed, Math.min(PLAYER_CONFIG.maxSpeed, action.payload));
    },
    togglePause(state) { state.paused = !state.paused; },
    setPaused(state, action: PayloadAction<boolean>) { state.paused = action.payload; },
    togglePhysics(state) { state.showPhysics = !state.showPhysics; },
    startDriving(state, action: PayloadAction<number>) {
      if (state.mode !== 'explore' || state.paused || !canDrive(action.payload)) return;
      state.mode = 'driving'; state.destination = undefined;
    },
    requestCarExit(state) { if (state.mode === 'driving' && !state.paused) state.vehicleExitRequest = (state.vehicleExitRequest ?? 0) + 1; },
    setCameraView(state, action: PayloadAction<GameSettings['cameraView']>) { state.cameraView = action.payload; },
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      if (!['light', 'dark', 'auto'].includes(action.payload)) return;
      state.themeMode = action.payload;
      state.themeChosen = true;
    },
    resetPlayer(state) { state.resetToken += 1; state.mode = 'explore'; state.destination=undefined; },
    setMode(state, action: PayloadAction<GameMode>) { state.mode = action.payload; state.paused = false; state.destination=undefined; },
    setDestination(state, action: PayloadAction<{x:number;z:number}|undefined>) {
      const point=action.payload;
      if (!point || (state.mode === 'explore' && Number.isFinite(point.x) && Number.isFinite(point.z) && point.x >= WORLD_BOUNDS.minX && point.x <= WORLD_BOUNDS.maxX && point.z >= WORLD_BOUNDS.minZ && point.z <= WORLD_BOUNDS.maxZ)) state.destination = point;
    }
  }
});

export const { setMovementSpeed, togglePause, setPaused, togglePhysics, resetPlayer, setMode, setDestination, setCameraView, setThemeMode, startDriving, requestCarExit } = gameSlice.actions;
