import type { ReactNode } from 'react';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { PHYSICS_TIMESTEP, getRoomColliders } from '../config';

type Props = { children: ReactNode; paused: boolean; debug: boolean; arcadeUnlocked: boolean; greenhouseOpen?: boolean };

export function PhysicsWorld({ children, paused, debug, arcadeUnlocked, greenhouseOpen }: Props) {
  return (
    <Physics gravity={[0, -9.81, 0]} timeStep={PHYSICS_TIMESTEP} paused={paused} debug={debug}>
      <RigidBody type="fixed" colliders={false}>
        {getRoomColliders(greenhouseOpen,arcadeUnlocked).map(({ id, position, halfExtents }) => (
          <CuboidCollider key={id} name={id} position={position} args={halfExtents} />
        ))}
      </RigidBody>
      {children}
    </Physics>
  );
}
