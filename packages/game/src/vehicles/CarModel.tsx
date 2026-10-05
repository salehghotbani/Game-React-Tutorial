import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Group } from 'three';
import { HumanFigure } from '../player/HumanFigure';
import { CAR, type VehicleState } from './driving';

function Wheel({ x, z, state, paused }: { x: number; z: number; state: RefObject<VehicleState>; paused: boolean }) {
  const wheel = useRef<Group>(null);
  useFrame((_, dt) => { if (wheel.current && !paused) wheel.current.rotation.x -= state.current.speed * Math.min(dt, 0.05) / 0.32; });
  return <group position={[x, 0.34, z]} ref={wheel}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.22, 20]} /><meshStandardMaterial color="#20272a" roughness={0.95} /></mesh>
    <mesh position={[Math.sign(x) * 0.115, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.19, 0.19, 0.015, 12]} /><meshStandardMaterial color="#b6c5c7" metalness={0.85} roughness={0.25} /></mesh>
  </group>;
}

function Driver() {
  const leftArm = useRef<Group>(null), rightArm = useRef<Group>(null), leftLeg = useRef<Group>(null), rightLeg = useRef<Group>(null);
  useLayoutEffect(() => {
    for (const arm of [leftArm.current, rightArm.current]) if (arm) arm.rotation.x = -0.9;
    for (const leg of [leftLeg.current, rightLeg.current]) if (leg) leg.rotation.x = -1.3;
  }, []);
  return <group position={[-0.37, 0.13, -0.09]} rotation={[0, Math.PI, 0]} scale={0.8}>
    <HumanFigure shirt="#55998c" hair="#45362e" leftArm={leftArm} rightArm={rightArm} leftLeg={leftLeg} rightLeg={rightLeg} />
  </group>;
}

export function CarModel({ state, color, paused, driver = false, firstPerson = false, night = false, detailed = false }: {
  state: RefObject<VehicleState>; color: string; paused: boolean; driver?: boolean; firstPerson?: boolean; night?: boolean; detailed?: boolean;
}) {
  return <group position={[0, -CAR.centerHeight, 0]}>
    <RoundedBox position={[0, 0.63, 0]} args={[1.73, 0.54, 3.75]} radius={0.16} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={color} metalness={0.55} roughness={0.28} /></RoundedBox>
    <RoundedBox position={[0, 0.92, -1.18]} args={[1.65, 0.08, 1.2]} radius={0.04} smoothness={2} castShadow><meshStandardMaterial color={color} metalness={0.55} roughness={0.28} /></RoundedBox>
    <RoundedBox position={[0, 1.54, 0.18]} args={[1.58, 0.11, 1.9]} radius={0.06} smoothness={2} castShadow><meshStandardMaterial color={color} metalness={0.55} roughness={0.28} /></RoundedBox>
    <mesh position={[0, 1.22, -0.75]} rotation={[-0.28, 0, 0]}><boxGeometry args={[1.48, 0.59, 0.035]} /><meshStandardMaterial color="#9cbfc5" transparent opacity={0.35} roughness={0.1} metalness={0.25} depthWrite={false} /></mesh>
    <mesh position={[0, 1.22, 1.05]} rotation={[0.25, 0, 0]}><boxGeometry args={[1.48, 0.59, 0.035]} /><meshStandardMaterial color="#89abb7" transparent opacity={0.5} roughness={0.15} depthWrite={false} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 0.78, 1.22, 0.16]}><boxGeometry args={[0.025, 0.54, 1.65]} /><meshStandardMaterial color="#9dbbc6" transparent opacity={0.32} depthWrite={false} roughness={0.15} /></mesh>
      {[-0.69, 0.12, 1].map(z => <mesh key={z} position={[side * 0.78, 1.23, z]}><boxGeometry args={[0.06, 0.59, 0.08]} /><meshStandardMaterial color={color} metalness={0.5} roughness={0.32} /></mesh>)}
      <mesh position={[side * 0.87, 0.86, 0.43]}><boxGeometry args={[0.025, 0.04, 0.22]} /><meshStandardMaterial color="#cdd4d3" metalness={0.8} roughness={0.25} /></mesh>
      <mesh position={[side * 0.54, 0.74, -1.87]}><boxGeometry args={[0.39, 0.15, 0.025]} /><meshStandardMaterial color="#ffecd0" emissive="#ffe1a2" emissiveIntensity={night ? 2 : 0.25} /></mesh>
      <mesh position={[side * 0.59, 0.72, 1.89]}><boxGeometry args={[0.31, 0.16, 0.025]} /><meshStandardMaterial color="#d65a48" emissive="#df4c31" emissiveIntensity={night ? 1.5 : 0.15} /></mesh>
      <Wheel x={side * 0.86} z={-1.22} state={state} paused={paused} /><Wheel x={side * 0.86} z={1.22} state={state} paused={paused} />
    </group>)}
    <mesh position={[0, 0.48, -1.91]}><boxGeometry args={[1.64, 0.1, 0.08]} /><meshStandardMaterial color="#455258" metalness={0.65} /></mesh>
    <mesh position={[0, 0.64, -1.9]}><boxGeometry args={[0.6, 0.14, 0.03]} /><meshStandardMaterial color="#25383f" /></mesh>
    {detailed && <>
      {[-0.38, 0.38].map(x => <group key={x}><RoundedBox position={[x, 0.65, 0.12]} args={[0.58, 0.14, 0.64]} radius={0.06} smoothness={2}><meshStandardMaterial color="#334e54" /></RoundedBox><RoundedBox position={[x, 0.91, 0.41]} args={[0.55, 0.6, 0.12]} radius={0.055} smoothness={2}><meshStandardMaterial color="#334e54" /></RoundedBox></group>)}
      <mesh position={[0, 0.98, -0.58]}><boxGeometry args={[1.45, 0.16, 0.32]} /><meshStandardMaterial color="#30464b" /></mesh>
      <mesh position={[-0.38, 1.08, -0.36]} rotation={[-0.35, 0, 0]}><torusGeometry args={[0.17, 0.021, 8, 20]} /><meshStandardMaterial color="#172c32" /></mesh>
    </>}
    {driver && !firstPerson && <Driver />}
  </group>;
}
