import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { gameSlice } from './gameSlice';
import { progressSlice } from './progressSlice';
import { loadProgress, SAVE_KEY } from './progression';

export const store = configureStore({ reducer: { game: gameSlice.reducer, progress: progressSlice.reducer }, preloadedState: { progress: loadProgress() } });
let previousProgress = store.getState().progress;
let previousCamera = store.getState().game.cameraView;
let previousTheme = store.getState().game.themeMode;
let themeChosen = store.getState().game.themeChosen;
store.subscribe(() => {
  const game = store.getState().game;
  if (game.themeChosen && (game.themeMode !== previousTheme || !themeChosen)) {
    previousTheme = game.themeMode;
    themeChosen = true;
    try { localStorage.setItem('react-quest-theme-v1', game.themeMode); } catch { /* Storage may be unavailable. */ }
  }
  const camera = store.getState().game.cameraView;
  if (camera !== previousCamera) {
    previousCamera = camera;
    try { localStorage.setItem('react-quest-camera-v1', camera); } catch { /* Storage may be unavailable. */ }
  }
  const progress = store.getState().progress;
  if (progress === previousProgress) return;
  previousProgress = progress;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 3, ...progress })); } catch { /* Local persistence can be unavailable in private/limited storage contexts. */ }
});
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();
