import type { MovementInput } from '@react-quest/shared';

export function getMovement(input: MovementInput, cameraYaw: number, speed: number) {
  const x = Number(input.right) - Number(input.left);
  const z = Number(input.backward) - Number(input.forward);
  const length = Math.hypot(x, z);
  if (length === 0) return { x: 0, z: 0 };
  const normalizedX = x / length;
  const normalizedZ = z / length;
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
