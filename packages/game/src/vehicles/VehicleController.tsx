import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody, interactionGroups, useBeforePhysicsStep, useRapier } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { tx, useLanguage } from '@react-quest/localization';
import type { GameSettings } from '@react-quest/shared';
import { PHYSICS_TIMESTEP } from '../config';
import { useMovementInput } from '../input/useMovementInput';
import type { CameraLook } from '../input/useCameraLook';
import type { PlayerBodyRef } from '../player/types';
import { CAR, initialVehicleState, stepDriving, yawRotation, type VehicleState } from './driving';
import { canTurn, safeExit } from './vehiclePhysics';
import { CarModel } from './CarModel';

const CAR_GROUPS = interactionGroups(2, [0, 1, 3]);
type Props = {
  bodyRef: PlayerBodyRef; playerRef: PlayerBodyRef; driverAttachedRef: RefObject<boolean>; state: RefObject<VehicleState>; look: RefObject<CameraLook>;
  settings: GameSettings; unlocked: boolean; night: boolean;
  onTelemetry?: (state: VehicleState) => void; onExit?: () => void; onBlockedExit?: () => void; onNavigate?: () => void;
};

export function VehicleController({ bodyRef, playerRef, driverAttachedRef, state: stateRef, look: lookRef, settings, unlocked, night, onTelemetry, onExit, onBlockedExit, onNavigate }: Props) {
  useLanguage();
  const { world, rapier } = useRapier();
  const active = settings.mode === 'driving' && unlocked;
  const { input } = useMovementInput(!active || settings.paused);
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  const exitRequest = useRef(settings.vehicleExitRequest);
  const sample = useRef(0);
  useEffect(() => {
    stateRef.current = initialVehicleState();
    const character = world.createCharacterController(0.025);
    character.setSlideEnabled(true);
    controller.current = character;
    return () => { controller.current = null; world.removeCharacterController(character); };
  }, [world, stateRef]);
  useEffect(() => {
    stateRef.current.speed = 0;
    driverAttachedRef.current = active;
    if (active) { lookRef.current.yaw = 0; lookRef.current.orbitYaw = 0; lookRef.current.orbitPitch = 0.22; }
  }, [active, stateRef, lookRef, driverAttachedRef]);
  useEffect(() => { if (settings.paused) stateRef.current.speed = 0; }, [settings.paused, stateRef]);

  useBeforePhysicsStep(() => {
    const body = bodyRef.current, character = controller.current;
    if (!body || !character) return;
    if (active && settings.vehicleExitRequest !== exitRequest.current) {
      exitRequest.current = settings.vehicleExitRequest;
      const position = safeExit(world, body, stateRef.current, CAR_GROUPS);
      if (position && playerRef.current) {
        driverAttachedRef.current = false;
        stateRef.current.speed = 0;
        playerRef.current.setTranslation(position, true);
        playerRef.current.setNextKinematicTranslation(position);
        lookRef.current.yaw += stateRef.current.yaw;
        lookRef.current.orbitYaw += stateRef.current.yaw;
        onExit?.();
      } else onBlockedExit?.();
      return;
    }
    if (!active || !driverAttachedRef.current || settings.paused) return;
    const current = stateRef.current;
    const next = stepDriving(current, input.current, PHYSICS_TIMESTEP);
    if (!canTurn(world, body, next.yaw, CAR_GROUPS)) next.yaw = current.yaw;
    body.setRotation(yawRotation(next.yaw), true);
    // Cast the actual rotated car footprint; buildings, traffic and world limits stop driving.
    character.computeColliderMovement(body.collider(0), {
      x: -Math.sin(next.yaw) * next.speed * PHYSICS_TIMESTEP, y: -0.04,
      z: -Math.cos(next.yaw) * next.speed * PHYSICS_TIMESTEP
    }, rapier.QueryFilterFlags.EXCLUDE_SENSORS, CAR_GROUPS);
    const corrected = character.computedMovement();
    const position = body.translation();
    if (Math.hypot(corrected.x, corrected.z) < Math.abs(next.speed) * PHYSICS_TIMESTEP * 0.5) next.speed = 0;
    stateRef.current = { ...next, x: position.x + corrected.x, y: position.y + corrected.y, z: position.z + corrected.z };
    body.setNextKinematicTranslation(stateRef.current);
    body.setNextKinematicRotation(yawRotation(next.yaw));
  });
  useFrame((_, delta) => {
    sample.current += delta;
    if (sample.current > 0.15) { onTelemetry?.({ ...stateRef.current }); sample.current = 0; }
  });
  return <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false} position={[24, CAR.centerHeight, 25]} rotation={[0, Math.PI, 0]} name="learning-car">
    <CuboidCollider args={[CAR.halfWidth, CAR.halfHeight, CAR.halfLength]} collisionGroups={CAR_GROUPS} />
    <CarModel state={stateRef} color="#367e8d" paused={settings.paused} driver={active} detailed firstPerson={settings.cameraView === 'firstPerson'} night={night} />
    {settings.mode === 'explore' && <Html position={[0, 2.15, 0]} center zIndexRange={[9, 0]}><button className={`room-marker ${unlocked ? 'ready' : ''}`} onClick={onNavigate} aria-label={tx('رفتن به ماشین')}><span>◆</span>{tx(unlocked ? 'ماشین · آمادهٔ رانندگی' : 'ماشین · ۲۰۰۰ XP')}</button></Html>}
  </RigidBody>;
}
