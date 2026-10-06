export const JOYSTICK_DEAD_ZONE = 0.12;

export function getJoystickState(dx: number, dy: number, radius: number) {
  const distance = Math.hypot(dx, dy);
  if (!Number.isFinite(distance) || !Number.isFinite(radius) || radius <= 0 || distance === 0) {
    return { x: 0, z: 0, offsetX: 0, offsetY: 0 };
  }
  const fraction = Math.min(1, distance / radius);
  const strength = Math.max(0, (fraction - JOYSTICK_DEAD_ZONE) / (1 - JOYSTICK_DEAD_ZONE));
  return {
    x: dx / distance * strength,
    z: dy / distance * strength,
    offsetX: dx / distance * fraction * radius,
    offsetY: dy / distance * fraction * radius
  };
}
