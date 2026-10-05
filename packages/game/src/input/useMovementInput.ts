import { useCallback, useEffect, useRef } from 'react';
import type { MovementInput } from '@react-quest/shared';
import { isTypingTarget } from '../logic/movement';

const bindings: Record<string, keyof MovementInput> = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'backward', ArrowDown: 'backward',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right'
};
export type PlayerInput = MovementInput & { sprint: boolean; jump: boolean };

export function useMovementInput(paused: boolean) {
  const input = useRef<PlayerInput>({ forward: false, backward: false, left: false, right: false, sprint: false, jump: false });

  useEffect(() => {
    const heldKeys = new Set<string>();
    const touchDirections = new Set<keyof PlayerInput>();
    const updateInput = () => {
      for (const action of ['forward', 'backward', 'left', 'right'] as const) {
        input.current[action] = touchDirections.has(action) || [...heldKeys].some((key) => bindings[key] === action);
      }
      input.current.sprint = touchDirections.has('sprint') || heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight');
    };
    const clear = () => { heldKeys.clear(); touchDirections.clear(); input.current.jump = false; updateInput(); };
    const touch = (event: Event) => {
      if (paused || !(event instanceof CustomEvent)) return;
      const detail: unknown = event.detail;
      if (!detail || typeof detail !== 'object' || !('direction' in detail) || !('pressed' in detail)) return;
      const direction = detail.direction;
      if (direction === 'jump') { if (detail.pressed === true) input.current.jump = true; return; }
      if (direction !== 'forward' && direction !== 'backward' && direction !== 'left' && direction !== 'right' && direction !== 'sprint') return;
      if (detail.pressed === true) touchDirections.add(direction);
      else touchDirections.delete(direction);
      updateInput();
    };
    const down = (event: KeyboardEvent) => {
      if (paused || isTypingTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) input.current.jump = true;
      } else if (bindings[event.code] || event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        event.preventDefault();
        heldKeys.add(event.code);
        updateInput();
      }
    };
    const up = (event: KeyboardEvent) => { heldKeys.delete(event.code); updateInput(); };
    clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    window.addEventListener('react-quest-movement', touch);
    document.addEventListener('visibilitychange', clear);
    return () => {
      clear();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      window.removeEventListener('react-quest-movement', touch);
      document.removeEventListener('visibilitychange', clear);
    };
  }, [paused]);

  const consumeJump = useCallback(() => {
    const requested = input.current.jump;
    input.current.jump = false;
    return requested;
  }, []);
  return { input, consumeJump };
}
