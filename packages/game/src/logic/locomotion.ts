import { PLAYER_CONFIG } from '../config';

export function movementSpeed(walkingSpeed: number, sprinting: boolean) {
  return walkingSpeed * (sprinting ? PLAYER_CONFIG.sprintMultiplier : 1);
}

export function nextVerticalVelocity(velocity: number, grounded: boolean, jump: boolean, delta: number) {
  if (grounded && jump) return PLAYER_CONFIG.jumpSpeed;
  if (grounded && velocity <= 0) return -0.5;
  return Math.max(-PLAYER_CONFIG.terminalFallSpeed, velocity - PLAYER_CONFIG.gravity * delta);
}
