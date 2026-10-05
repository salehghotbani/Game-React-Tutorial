import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { dampAngle } from '../logic/movement';
import { PLAYER_CONFIG } from '../config';
import type { PlayerMotion } from './types';
import { HumanFigure } from './HumanFigure';

type Props = { motion: RefObject<PlayerMotion>; paused: boolean; seated: boolean };
const MODEL_BASE_Y = -(PLAYER_CONFIG.capsuleHalfHeight + PLAYER_CONFIG.capsuleRadius);

export function PlayerModel({ motion, paused, seated }: Props) {
  const model = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const walkTime = useRef(0);

  useFrame((_, delta) => {
    if (!model.current || paused) return;
    const moving = motion.current.speed > 0.08;
    walkTime.current += delta * (moving ? motion.current.running ? 14 : 9 : 2);
    const swing = moving ? Math.sin(walkTime.current) * (motion.current.running ? 0.8 : 0.48) : 0;
    model.current.rotation.y = dampAngle(model.current.rotation.y, motion.current.heading, PLAYER_CONFIG.rotationDamping, delta);
    model.current.position.y = MODEL_BASE_Y + (moving && !motion.current.airborne ? Math.abs(Math.sin(walkTime.current)) * 0.028 : 0);
    model.current.rotation.x = motion.current.running ? 0.09 : 0;
    const alpha = 1 - Math.exp(-10 * delta);
    if (leftLeg.current) leftLeg.current.rotation.x += ((seated ? -1.35 : motion.current.airborne ? -0.45 : swing) - leftLeg.current.rotation.x) * alpha;
    if (rightLeg.current) rightLeg.current.rotation.x += ((seated ? -1.35 : motion.current.airborne ? 0.2 : -swing) - rightLeg.current.rotation.x) * alpha;
    if (leftArm.current) leftArm.current.rotation.x += ((seated ? -0.8 : motion.current.airborne ? -0.65 : -swing * 0.65) - leftArm.current.rotation.x) * alpha;
    if (rightArm.current) rightArm.current.rotation.x += ((seated ? -0.8 : motion.current.airborne ? -0.65 : swing * 0.65) - rightArm.current.rotation.x) * alpha;
  });

  return (
    <group ref={model} position={[0, MODEL_BASE_Y, 0]} rotation={[0, Math.PI, 0]}>
      <HumanFigure shirt="#55998c" hair="#45362e" backpack leftArm={leftArm} rightArm={rightArm} leftLeg={leftLeg} rightLeg={rightLeg} />
    </group>
  );
}
