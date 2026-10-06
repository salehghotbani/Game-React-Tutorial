import type { MovementInput } from '@react-quest/shared';

export function getMovement(input: MovementInput, cameraYaw: number, speed: number) {
  const keyboardX = Number(input.right) - Number(input.left);
  const keyboardZ = Number(input.backward) - Number(input.forward);
  const keyboardActive = keyboardX !== 0 || keyboardZ !== 0;
  const x = keyboardActive ? keyboardX : input.analog?.x ?? 0;
  const z = keyboardActive ? keyboardZ : input.analog?.z ?? 0;
  const length = Math.hypot(x, z);
  if (!Number.isFinite(length) || length === 0) return { x: 0, z: 0 };
  const divisor = keyboardActive ? length : Math.max(1, length);
  const normalizedX = x / divisor;
  const normalizedZ = z / divisor;
  return {
    x: (normalizedX * Math.cos(cameraYaw) + normalizedZ * Math.sin(cameraYaw)) * speed,
    z: (-normalizedX * Math.sin(cameraYaw) + normalizedZ * Math.cos(cameraYaw)) * speed
  };
}

export function dampAngle(current: number, target: number, damping: number, delta: number) {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * (1 - Math.exp(-damping * delta));
}

export function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (
    target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}
