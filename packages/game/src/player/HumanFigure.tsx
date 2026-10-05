import { RoundedBox } from '@react-three/drei';
import type { Group } from 'three';
import type { RefObject } from 'react';
import { SurfaceMaterial } from '../materials/SurfaceMaterial';

type Props = {
  shirt: string; hair: string; skin?: string; elderly?: boolean; skirt?: boolean; beard?: boolean; backpack?: boolean;
  leftArm?: RefObject<Group | null>; rightArm?: RefObject<Group | null>;
  leftLeg?: RefObject<Group | null>; rightLeg?: RefObject<Group | null>;
};

export function HumanFigure({ shirt, hair, skin = '#cfaa8a', elderly, skirt, beard, backpack, leftArm, rightArm, leftLeg, rightLeg }: Props) {
  return <>
    <RoundedBox position={[0, 0.97, 0]} args={[0.5, 0.59, 0.31]} radius={0.12} smoothness={3} castShadow><SurfaceMaterial color={shirt} surface="fabric" /></RoundedBox>
    <mesh position={[0, 1.3, 0]} castShadow><cylinderGeometry args={[0.08, 0.09, 0.15, 16]} /><meshStandardMaterial color={skin} roughness={0.68} /></mesh>
    <mesh position={[0, 1.53, 0]} scale={[0.92, 1.14, 0.95]} castShadow><sphereGeometry args={[0.215, 24, 16]} /><meshStandardMaterial color={skin} roughness={0.64} /></mesh>
    <mesh position={[0, 1.66, -0.025]} scale={[1, 0.7, 1]} castShadow><sphereGeometry args={[0.224, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} /><meshStandardMaterial color={hair} roughness={0.94} /></mesh>
    <mesh position={[0, 1.51, 0.199]} scale={[0.75, 1.2, 1]}><sphereGeometry args={[0.037, 12, 8]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[0, 1.43, 0.185]} scale={[1, 0.2, 0.4]}><sphereGeometry args={[0.04, 12, 8]} /><meshStandardMaterial color="#a66c60" /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 0.205, 1.52, 0]} scale={[0.65, 1, 0.7]}><sphereGeometry args={[0.042, 12, 8]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[side * 0.085, 1.57, 0.183]} scale={[1, 0.55, 0.4]}><sphereGeometry args={[0.033, 12, 8]} /><meshStandardMaterial color="#eee9df" /></mesh>
      <mesh position={[side * 0.085, 1.568, 0.196]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#3a332f" /></mesh>
      <mesh position={[side * 0.085, 1.62, 0.174]} rotation={[0, 0, side * -0.12]}><capsuleGeometry args={[0.009, 0.047, 4, 8]} /><meshStandardMaterial color={hair} /></mesh>
      <group ref={side === -1 ? leftArm : rightArm} position={[side * 0.31, 1.17, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.076, 0.3, 6, 12]} /><SurfaceMaterial color={shirt} surface="fabric" /></mesh>
        <mesh position={[0, -0.47, 0.012]} scale={[0.75, 1, 0.7]} castShadow><sphereGeometry args={[0.082, 16, 12]} /><meshStandardMaterial color={skin} roughness={0.68} /></mesh>
      </group>
      <group ref={side === -1 ? leftLeg : rightLeg} position={[side * 0.135, 0.62, 0]}>
        <mesh position={[0, -0.23, 0]} castShadow><capsuleGeometry args={[0.096, 0.3, 6, 12]} /><SurfaceMaterial color="#34454c" surface="fabric" /></mesh>
        <RoundedBox position={[0, -0.53, 0.064]} args={[0.21, 0.14, 0.35]} radius={0.045} smoothness={2} castShadow><meshStandardMaterial color="#b7ada0" roughness={0.8} /></RoundedBox>
      </group>
      {elderly && <mesh position={[side * 0.085, 1.57, 0.205]}><torusGeometry args={[0.046, 0.006, 6, 16]} /><meshStandardMaterial color="#635d57" metalness={0.65} roughness={0.3} /></mesh>}
    </group>)}
    {elderly && <mesh position={[0, 1.57, 0.212]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.08, 8]} /><meshStandardMaterial color="#635d57" /></mesh>}
    {skirt && <mesh position={[0, 0.56, 0]} castShadow><cylinderGeometry args={[0.23, 0.34, 0.5, 24]} /><SurfaceMaterial color={shirt} surface="fabric" /></mesh>}
    {beard && <mesh position={[0, 1.385, 0.13]} scale={[1, 0.8, 0.5]}><sphereGeometry args={[0.115, 16, 12]} /><meshStandardMaterial color={hair} roughness={0.95} /></mesh>}
    {backpack && <RoundedBox position={[0, 0.95, -0.21]} args={[0.33, 0.4, 0.17]} radius={0.055} smoothness={2} castShadow><SurfaceMaterial color="#b59669" surface="fabric" /></RoundedBox>}
  </>;
}
