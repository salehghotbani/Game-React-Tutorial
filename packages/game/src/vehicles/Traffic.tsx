import { useEffect, useRef } from 'react';
import { CuboidCollider, RigidBody, interactionGroups, useBeforePhysicsStep, useRapier } from '@react-three/rapier';
import { PHYSICS_TIMESTEP } from '../config';
import type { PlayerBodyRef } from '../player/types';
import { CAR, trafficPosition, type VehicleState } from './driving';
import { CarModel } from './CarModel';

const TRAFFIC_GROUPS = interactionGroups(1, [0, 1, 2]);
const CARS = [{ x: -66, direction: 1, color: '#d6b46f', speed: 6 }, { x: -10, direction: -1, color: '#b35b4b', speed: 7 }, { x: 40, direction: 1, color: '#86a7b7', speed: 6 }, { x: 75, direction: -1, color: '#d6d9cf', speed: 7 }];

function TrafficCar({ x, direction, color, speed, paused, night }: typeof CARS[number] & { paused: boolean; night: boolean }) {
  const body: PlayerBodyRef = useRef(null);
  const { world, rapier } = useRapier();
  const state = useRef<VehicleState>({ x, z: direction > 0 ? 38 : 34, y: CAR.centerHeight, yaw: -direction * Math.PI / 2, speed });
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  useEffect(() => {
    const character = world.createCharacterController(0.025); character.setSlideEnabled(true);
    controller.current = character;
    return () => { controller.current = null; world.removeCharacterController(character); };
  }, [world]);
  useBeforePhysicsStep(() => {
    if (paused || !body.current || !controller.current) return;
    const position = body.current.translation();
    const nextX = trafficPosition(position.x, direction, speed, PHYSICS_TIMESTEP);
    if (Math.abs(nextX - position.x) > 100) {
      // Wrap beyond the explorable boundary, where neither the player nor their car can stand.
      body.current.setTranslation({ ...position, x: nextX }, true);
      body.current.setNextKinematicTranslation({ ...position, x: nextX });
      state.current.x = nextX;
      return;
    }
    controller.current.computeColliderMovement(body.current.collider(0), { x: nextX - position.x, y: 0, z: 0 }, rapier.QueryFilterFlags.EXCLUDE_SENSORS, TRAFFIC_GROUPS);
    const corrected = controller.current.computedMovement();
    state.current.x = position.x + corrected.x;
    state.current.speed = Math.abs(corrected.x) / PHYSICS_TIMESTEP;
    body.current.setNextKinematicTranslation({ ...position, x: state.current.x });
  });
  return <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[x, CAR.centerHeight, direction > 0 ? 38 : 34]} rotation={[0, -direction * Math.PI / 2, 0]} name="traffic-car">
    <CuboidCollider args={[CAR.halfWidth, CAR.halfHeight, CAR.halfLength]} collisionGroups={TRAFFIC_GROUPS} />
    <CarModel state={state} color={color} paused={paused} night={night} />
  </RigidBody>;
}

export function Traffic({ paused, night }: { paused: boolean; night: boolean }) {
  return <>{CARS.map((car, index) => <TrafficCar key={index} {...car} paused={paused} night={night} />)}</>;
}
