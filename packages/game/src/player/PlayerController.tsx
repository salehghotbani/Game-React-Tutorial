import { useEffect, useRef, type RefObject } from 'react';
import { CapsuleCollider, RigidBody, useBeforePhysicsStep, useRapier } from '@react-three/rapier';
import type { GameSettings } from '@react-quest/shared';
import { PHYSICS_TIMESTEP, PLAYER_CONFIG } from '../config';
import { useMovementInput } from '../input/useMovementInput';
import type { CameraLook } from '../input/useCameraLook';
import { getMovement } from '../logic/movement';
import { movementSpeed, nextVerticalVelocity } from '../logic/locomotion';
import { findWalkingPath, type Point } from '../logic/navigation';
import { getActivityPose } from './activityPose';
import { PlayerModel } from './PlayerModel';
import type { PlayerBodyRef, PlayerMotion } from './types';
import { vehicleObstacle, type VehicleState } from '../vehicles/driving';

type Props = {
  bodyRef: PlayerBodyRef;
  settings: GameSettings;
  look: RefObject<CameraLook>;
  vehicle: RefObject<VehicleState>;
  driverAttachedRef: RefObject<boolean>;
  greenhouseOpen?: boolean;
  arcadeUnlocked?: boolean;
  onTravelEnd?: () => void;
  onFirstMove?: () => void;
};

export function PlayerController({ bodyRef, settings, look, vehicle, driverAttachedRef, greenhouseOpen, arcadeUnlocked, onTravelEnd, onFirstMove }: Props) {
  const { world } = useRapier();
  const { input, consumeJump } = useMovementInput(settings.paused || settings.mode !== 'explore');
  const previousMode = useRef(settings.mode);
  const returnPosition = useRef({ x: PLAYER_CONFIG.spawn[0], y: PLAYER_CONFIG.spawn[1], z: PLAYER_CONFIG.spawn[2] });
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  const motion = useRef<PlayerMotion>({ speed: 0, heading: Math.PI, airborne: false, running: false });
  const verticalVelocity = useRef(0);
  const grounded = useRef(false);
  const path = useRef<Point[]>([]);
  const stuckTime = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    stuckTime.current = 0;
    const body = bodyRef.current;
    path.current = body && settings.destination ? findWalkingPath(body.translation(), settings.destination, greenhouseOpen, arcadeUnlocked, [vehicleObstacle(vehicle.current)]) : [];
    if (settings.destination && !path.current.length) onTravelEnd?.();
  }, [settings.destination, bodyRef, greenhouseOpen, arcadeUnlocked, onTravelEnd, vehicle]);

  useEffect(() => {
    const character = world.createCharacterController(PLAYER_CONFIG.collisionOffset);
    character.setSlideEnabled(true);
    character.enableSnapToGround(0.15);
    character.setApplyImpulsesToDynamicBodies(false);
    controller.current = character;
    return () => { controller.current = null; world.removeCharacterController(character); };
  }, [world]);

  useBeforePhysicsStep(() => {
    const body = bodyRef.current;
    const character = controller.current;
    if (!body || !character) return;
    if (settings.mode === 'driving') {
      const car = vehicle.current;
      // A render may span several physics ticks; a completed exit must stay detached immediately.
      if (driverAttachedRef.current) body.setNextKinematicTranslation({ x: car.x, y: car.y + 0.4, z: car.z });
      verticalVelocity.current = 0; grounded.current = false;
      previousMode.current = settings.mode;
      return;
    }
    const modeChanged = previousMode.current !== settings.mode;
    const pose = getActivityPose(settings.mode);
    if (modeChanged && pose && !getActivityPose(previousMode.current)) returnPosition.current = { ...body.translation() };
    if (pose) {
      body.setNextKinematicTranslation(pose.seat);
      motion.current = { speed: 0, heading: pose.heading, airborne: false, running: false };
      verticalVelocity.current = 0;
      grounded.current = true;
      previousMode.current = settings.mode;
      return;
    }
    if (modeChanged && settings.mode === 'explore' && getActivityPose(previousMode.current)) body.setTranslation(returnPosition.current, true);
    previousMode.current = settings.mode;

    const cameraYaw = settings.cameraView === 'firstPerson' ? look.current.yaw : look.current.orbitYaw;
    const active = !settings.paused && settings.mode === 'explore';
    const speed = movementSpeed(settings.movementSpeed, input.current.sprint);
    const jump = consumeJump() && active;
    let velocity = active ? getMovement(input.current, cameraYaw, speed) : { x: 0, z: 0 };
    if (settings.destination && (Math.hypot(velocity.x, velocity.z) > 0.01 || jump)) {
      path.current = [];
      onTravelEnd?.();
    } else if (settings.destination && !settings.paused && settings.mode === 'explore') {
      const position = body.translation();
      while (path.current[0] && Math.hypot(path.current[0].x - position.x, path.current[0].z - position.z) < 0.025) path.current.shift();
      const waypoint = path.current[0];
      if (waypoint) {
        const dx = waypoint.x - position.x;
        const dz = waypoint.z - position.z;
        const distance = Math.hypot(dx, dz);
        const routeSpeed = Math.min(speed, distance / PHYSICS_TIMESTEP);
        velocity = { x: dx / distance * routeSpeed, z: dz / distance * routeSpeed };
      } else onTravelEnd?.();
    }

    verticalVelocity.current = nextVerticalVelocity(verticalVelocity.current, grounded.current, jump, PHYSICS_TIMESTEP);
    if (verticalVelocity.current > 0) character.disableSnapToGround();
    else character.enableSnapToGround(0.15);
    const verticalStep = verticalVelocity.current * PHYSICS_TIMESTEP;
    character.computeColliderMovement(body.collider(0), {
      x: velocity.x * PHYSICS_TIMESTEP,
      y: verticalStep,
      z: velocity.z * PHYSICS_TIMESTEP
    });
    const corrected = character.computedMovement();
    grounded.current = character.computedGrounded();
    if (grounded.current && verticalVelocity.current < 0 || verticalVelocity.current > 0 && corrected.y < verticalStep - 0.001) verticalVelocity.current = 0;
    const movingDistance = Math.hypot(corrected.x, corrected.z);
    if (settings.destination && Math.hypot(velocity.x, velocity.z) > 0.01) {
      stuckTime.current = movingDistance < 0.002 ? stuckTime.current + PHYSICS_TIMESTEP : 0;
      if (stuckTime.current > 1.2) { path.current = []; onTravelEnd?.(); }
    }
    if (!hasMoved.current && (movingDistance > 0.002 || jump && corrected.y > 0.002)) { hasMoved.current = true; onFirstMove?.(); }
    const position = body.translation();
    body.setNextKinematicTranslation({ x: position.x + corrected.x, y: position.y + corrected.y, z: position.z + corrected.z });
    motion.current.speed = movingDistance / PHYSICS_TIMESTEP;
    motion.current.airborne = !grounded.current;
    motion.current.running = input.current.sprint && movingDistance > 0.002;
    if (Math.hypot(velocity.x, velocity.z) > 0.01) motion.current.heading = Math.atan2(velocity.x, velocity.z);
  });

  const seated = Boolean(getActivityPose(settings.mode));
  return (
    <RigidBody ref={bodyRef} type="kinematicPosition" colliders={false} position={PLAYER_CONFIG.spawn} enabledRotations={[false, false, false]} name="player">
      <CapsuleCollider args={[PLAYER_CONFIG.capsuleHalfHeight, PLAYER_CONFIG.capsuleRadius]} sensor={settings.mode === 'driving'} />
      {settings.mode !== 'driving' && (settings.cameraView === 'thirdPerson' || seated) && <PlayerModel motion={motion} paused={settings.paused} seated={seated} />}
    </RigidBody>
  );
}
