import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { GameSettings } from '@react-quest/shared';
import { CAMERA_CONFIG } from '../config';

export type CameraLook = { yaw: number; pitch: number; orbitYaw: number; orbitPitch: number };

export function useCameraLook(enabled: boolean, cameraView: GameSettings['cameraView']) {
  const look = useRef<CameraLook>({ yaw: 0, pitch: -0.08, orbitYaw: CAMERA_CONFIG.yaw, orbitPitch: Math.atan2(CAMERA_CONFIG.offset[1], Math.hypot(CAMERA_CONFIG.offset[0], CAMERA_CONFIG.offset[2])) });
  const { gl } = useThree();

  useEffect(() => {
    if (!enabled) return;
    const canvas = gl.domElement;
    let pointer: { id: number; x: number; y: number } | undefined;
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      const dx = (event.clientX - pointer.x) * 0.005;
      const dy = (event.clientY - pointer.y) * 0.004;
      if (cameraView === 'firstPerson') {
        look.current.yaw -= dx;
        look.current.pitch = Math.max(-1.1, Math.min(1.1, look.current.pitch - dy));
      } else {
        look.current.orbitYaw -= dx;
        look.current.orbitPitch = Math.max(0.3, Math.min(1.18, look.current.orbitPitch - dy));
      }
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const release = () => { pointer = undefined; };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    window.addEventListener('blur', release);
    return () => {
      if (pointer && canvas.hasPointerCapture(pointer.id)) canvas.releasePointerCapture(pointer.id);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', release);
      canvas.removeEventListener('lostpointercapture', release);
      window.removeEventListener('blur', release);
    };
  }, [enabled, cameraView, gl]);

  return look;
}
