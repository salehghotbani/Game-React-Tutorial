import type { Vector3Tuple } from '@react-quest/shared';
import { getWorldTime } from '../logic/worldTime';
import { WorldBox } from './Primitives';

export function RoomClock({ timestamp, position }: { timestamp: number | null; position: Vector3Tuple }) {
  const time = timestamp === null ? null : getWorldTime(timestamp);
  return <group position={position}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.34, 0.34, 0.06, 32]} /><meshStandardMaterial color="#b59e77" /></mesh>
    <mesh position={[0, 0, 0.037]}><circleGeometry args={[0.3, 32]} /><meshStandardMaterial color="#f6ebce" /></mesh>
    {Array.from({ length: 12 }, (_, index) => <WorldBox key={index} position={[Math.sin(index * Math.PI / 6) * 0.255, Math.cos(index * Math.PI / 6) * 0.255, 0.05]} size={[0.018, 0.04, 0.008]} rotation={[0, 0, -index * Math.PI / 6]} color="#78877b" />)}
    {time && <>
      <group rotation={[0, 0, time.hourAngle]}><WorldBox position={[0, 0.065, 0.07]} size={[0.025, 0.16, 0.012]} color="#57796a" /></group>
      <group rotation={[0, 0, time.minuteAngle]}><WorldBox position={[0, 0.095, 0.078]} size={[0.014, 0.23, 0.012]} color="#947755" /></group>
    </>}
  </group>;
}
