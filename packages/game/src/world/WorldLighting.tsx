import { Sky, Stars } from '@react-three/drei';
import { Color } from 'three';
import type { ThemeMode } from '@react-quest/shared';
import { worldDaylight } from '../logic/appearance';
import { getWorldTime } from '../logic/worldTime';

export function WorldLighting({ timestamp, theme }: { timestamp: number | null; theme: ThemeMode }) {
  const daylight = worldDaylight(timestamp, theme);
  const hour = theme === 'light' ? 11 : theme === 'dark' ? 22 : timestamp === null ? 22 : getWorldTime(timestamp).hour;
  const angle = (hour - 6) / 12 * Math.PI;
  const sky = new Color('#152338').lerp(new Color('#bbd2db'), daylight);
  const sun: [number, number, number] = [Math.cos(angle) * 26, 8 + daylight * 24, -15];
  return <>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky, 45, 100]} />
    {daylight > 0.15 ? <Sky distance={2000} sunPosition={sun} turbidity={4} rayleigh={1.2} mieCoefficient={0.006} mieDirectionalG={0.8} /> : <Stars radius={90} depth={30} count={800} factor={2.5} saturation={0} fade speed={0} />}
    <ambientLight intensity={0.16 + daylight * 0.23} />
    <hemisphereLight args={['#e6edff', '#59664d', 0.65 + daylight * 0.7]} />
    <directionalLight position={sun} intensity={daylight > 0.15 ? 0.6 + daylight * 2.8 : 0.75} color={daylight > 0.15 ? '#fff1d9' : '#b5c8ec'} castShadow
      shadow-mapSize={[2048, 2048]} shadow-camera-left={-27} shadow-camera-right={27} shadow-camera-top={32} shadow-camera-bottom={-27} shadow-normalBias={0.035} shadow-bias={-0.0001} shadow-radius={3} />
    <directionalLight position={[-12, 8, 7]} color="#a0c8db" intensity={0.2 + daylight * 0.25} />
  </>;
}
