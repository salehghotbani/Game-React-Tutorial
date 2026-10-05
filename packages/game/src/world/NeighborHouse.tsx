import { useMemo } from 'react';
import { DoubleSide, Shape } from 'three';
import { NEIGHBOR_HOUSES } from './layout';
import { WorldBox, WorldSign } from './Primitives';
import { SurfaceMaterial } from '../materials/SurfaceMaterial';

type Props = { house: typeof NEIGHBOR_HOUSES[number]; index: number; night: boolean };

export function NeighborHouse({ house, index, night }: Props) {
  const gable = useMemo(() => new Shape().moveTo(-house.width / 2, 0).lineTo(house.width / 2, 0).lineTo(0, 1.35).closePath(), [house.width]);
  const slope = Math.atan2(1.35, house.width / 2);
  return <group position={[house.x, 0, house.z]}>
    <WorldBox position={[0, 1.8, 0]} size={[house.width, 3.6, house.depth]} color={house.color} surface="brick" />
    <WorldBox position={[0, 0.23, 0]} size={[house.width + 0.15, 0.46, house.depth + 0.15]} color="#aaa69c" surface="stone" />
    {[-1, 1].map(side => <group key={side}>
      <WorldBox position={[side * house.width / 4, 4.275, 0]} rotation={[0, 0, -side * slope]} size={[Math.hypot(house.width / 2, 1.35) + 0.35, 0.15, house.depth + 0.6]} color={house.roof} surface="roof" />
      <mesh position={[0, 3.6, side * (house.depth / 2 + 0.015)]} rotation={[0, side === -1 ? Math.PI : 0, 0]} castShadow><shapeGeometry args={[gable]} /><SurfaceMaterial color={house.color} surface="brick" /></mesh>
      <WorldBox position={[side * (house.width / 2 + 0.12), 3.52, 0]} size={[0.13, 0.16, house.depth + 0.4]} color="#635d57" surface="metal" />
      <mesh position={[side * (house.width / 2 + 0.13), 1.75, -house.depth / 2 + 0.2]}><cylinderGeometry args={[0.045, 0.045, 3.4, 12]} /><SurfaceMaterial color="#7b7770" surface="metal" /></mesh>
      <group position={[side * 2.2, 1.95, -house.depth / 2 - 0.1]}>
        <WorldBox position={[0, 0, 0]} size={[1.42, 1.48, 0.13]} color="#e1d8c9" surface="wood" />
        <mesh position={[0, 0, -0.08]}><planeGeometry args={[1.23, 1.3]} /><meshPhysicalMaterial color={night ? '#dfbc79' : '#819dab'} metalness={0.22} roughness={0.13} clearcoat={1} side={DoubleSide} emissive={night ? '#e2ac65' : '#172e39'} emissiveIntensity={night ? 0.7 : 0.15} /></mesh>
        <WorldBox position={[0, 0, -0.1]} size={[0.055, 1.3, 0.08]} color="#ded6c6" surface="wood" />
        <WorldBox position={[0, 0, -0.1]} size={[1.24, 0.055, 0.08]} color="#ded6c6" surface="wood" />
        <WorldBox position={[0, -0.79, -0.09]} size={[1.65, 0.12, 0.34]} color="#b7b0a2" surface="stone" />
      </group>
    </group>)}
    <WorldBox position={[0, 1.12, -house.depth / 2 - 0.06]} size={[1.37, 2.24, 0.13]} color="#ddd3c0" surface="wood" />
    <WorldBox position={[0, 1.05, -house.depth / 2 - 0.15]} size={[1.19, 2.1, 0.07]} color="#5d736b" surface="wood" />
    {[0.5, 1.15, 1.75].map(y => <WorldBox key={y} position={[0, y, -house.depth / 2 - 0.192]} size={[0.96, 0.41, 0.025]} color="#455e55" surface="wood" />)}
    <mesh position={[-0.4, 1.05, -house.depth / 2 - 0.22]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.028, 0.028, 0.1, 12]} /><meshStandardMaterial color="#bcaa78" metalness={0.8} roughness={0.25} /></mesh>
    <WorldBox position={[0, 0.075, -house.depth / 2 - 0.75]} size={[2.4, 0.15, 1.5]} color="#b6b2a7" surface="stone" />
    <WorldSign text={`خانهٔ ${index + 1}`} position={[0, 2.65, -house.depth / 2 - 0.19]} width={1.1} rotation={[0, Math.PI, 0]} />
  </group>;
}
