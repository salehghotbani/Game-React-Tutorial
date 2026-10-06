import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import type { GameSettings } from '@react-quest/shared';
import { CAMERA_CONFIG } from '../config';
import type { CameraLook } from '../input/useCameraLook';
import { getActivityPose, isEnteringActivity } from '../player/activityPose';
import type { PlayerBodyRef, PlayerPosition } from '../player/types';

type Props = {
  bodyRef: PlayerBodyRef;
  settings: GameSettings;
  look: RefObject<CameraLook>;
  onPosition?: (position: PlayerPosition) => void;
  onActivityReady?: () => void;
};

export function WorldCamera({ bodyRef, settings, look, onPosition, onActivityReady }: Props) {
  const initialized = useRef(false);
  const target = useRef(new Vector3());
  const desired = useRef(new Vector3());
  const lookAt = useRef(new Vector3());
  const previous = useRef(new Vector3());
  const sampleTime = useRef(0);
  const heading = useRef(Math.PI);
  const completedMode = useRef<string | undefined>(undefined);

  useFrame(({ camera, size }, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const position = body.translation();
    const pose = getActivityPose(settings.mode);
    const firstPerson = settings.cameraView === 'firstPerson' && !pose;
    const viewScale = Math.max(1, Math.min(2.1, 1.1 / (size.width / size.height)));

    if (pose) {
      desired.current.set(...pose.camera);
      target.current.set(...pose.target);
    } else if (firstPerson) {
      desired.current.set(position.x, position.y + CAMERA_CONFIG.firstPersonEyeOffset, position.z);
      const yaw = look.current.yaw, pitch = look.current.pitch;
      target.current.set(desired.current.x - Math.sin(yaw) * Math.cos(pitch), desired.current.y + Math.sin(pitch), desired.current.z - Math.cos(yaw) * Math.cos(pitch));
    } else {
      const orbitYaw = look.current.orbitYaw, orbitPitch = look.current.orbitPitch;
      const distance = Math.hypot(...CAMERA_CONFIG.offset) * viewScale;
      const horizontal = Math.cos(orbitPitch) * distance;
      desired.current.set(position.x + Math.sin(orbitYaw) * horizontal, position.y + Math.sin(orbitPitch) * distance, position.z + Math.cos(orbitYaw) * horizontal);
      target.current.set(position.x + CAMERA_CONFIG.framingOffset[0], position.y + CAMERA_CONFIG.lookHeight, position.z + CAMERA_CONFIG.framingOffset[2]);
    }

    if (camera instanceof PerspectiveCamera) {
      const fov = firstPerson ? 72 : CAMERA_CONFIG.fov;
      if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    }
    if (!initialized.current || firstPerson) {
      camera.position.copy(desired.current);
      lookAt.current.copy(target.current);
      if (!initialized.current) previous.current.set(position.x, position.y, position.z);
      initialized.current = true;
    } else {
      const alpha = 1 - Math.exp(-CAMERA_CONFIG.followDamping * Math.min(delta, 0.1));
      camera.position.lerp(desired.current, alpha);
      lookAt.current.lerp(target.current, alpha);
    }
    camera.lookAt(lookAt.current);

    if (isEnteringActivity(settings.mode) && completedMode.current !== settings.mode && camera.position.distanceTo(desired.current) < 0.07) {
      completedMode.current = settings.mode;
      onActivityReady?.();
    } else if (!pose) completedMode.current = undefined;

    sampleTime.current += delta;
    if (sampleTime.current > 0.12) {
      const dx = position.x - previous.current.x;
      const dz = position.z - previous.current.z;
      if (firstPerson) heading.current = look.current.yaw + Math.PI;
      else if (Math.hypot(dx, dz) > 0.005) heading.current = Math.atan2(dx, dz);
      onPosition?.({ x: position.x, y: position.y, z: position.z, heading: heading.current, cameraYaw: (firstPerson ? look.current.yaw : look.current.orbitYaw) });
      previous.current.set(position.x, position.y, position.z);
      sampleTime.current = 0;
    }
  });
  return null;
}
