import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Vector3Tuple, KnowledgeRoom } from '@react-quest/shared';
import { BloomingGarden, Greenhouse, LivingRoomDetails, type RoomLifeView } from './RoomLife';
import { WorldBox as Box } from '../world/Primitives';

function useSignTexture(kind: 'screen' | 'poster', emblem = 'MAKE SOMETHING GREAT.') {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = kind === 'screen' ? '#1a343b' : '#efe8d5';
      ctx.fillRect(0, 0, 768, 512);
      ctx.fillStyle = kind === 'screen' ? '#a9d5bb' : '#4e776b';
      ctx.font = 'bold 46px monospace';
      ctx.fillText(kind === 'screen' ? '> hello, react.' : 'MAKE', 58, kind === 'screen' ? 110 : 140);
      if (kind === 'poster') {
        ctx.font = 'bold 30px monospace';
        ctx.fillText(emblem.slice(0, 22), 58, 206);
        ctx.fillText('LEARN > BUILD > MASTER', 58, 272);
        ctx.fillStyle = '#cc9571';
        ctx.beginPath(); ctx.arc(590, 375, 65, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#4e776b'; ctx.fillRect(60, 345, 330, 9);
      } else {
        const widths = [250, 410, 310, 195, 330, 440];
        widths.forEach((width, i) => {
          ctx.fillStyle = ['#769d8d', '#91c0c7', '#d6b991'][i % 3] ?? '#769d8d';
          ctx.fillRect(i % 2 ? 90 : 58, 172 + i * 40, width, 12);
        });
        ctx.fillStyle = '#526e6d';
        ctx.font = '20px monospace'; ctx.fillText('YOUR NEXT CHAPTER STARTS HERE', 58, 470);
      }
    }
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [kind, emblem]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Desk() {
  const screenTexture = useSignTexture('screen');
  return (
    <group position={[-1.5, 0, -3.8]}>
      <Box position={[0, 1.4, 0]} size={[3.2, 0.14, 1.3]} color="#d5ad80" />
      {[-1.35, 1.35].flatMap((x) => [-0.45, 0.45].map((z) => <Box key={`${x}-${z}`} position={[x, 0.66, z]} size={[0.12, 1.33, 0.12]} color="#475755" />))}
      <Box position={[0.1, 1.54, -0.25]} size={[0.6, 0.07, 0.38]} color="#38454b" />
      <Box position={[0.1, 1.77, -0.31]} size={[0.09, 0.45, 0.09]} color="#38454b" />
      <Box position={[0.1, 2.08, -0.31]} size={[1.43, 0.89, 0.09]} color="#344147" />
      <mesh position={[0.1, 2.08, -0.26]}><planeGeometry args={[1.3, 0.77]} /><meshStandardMaterial map={screenTexture} emissive="#6cae9c" emissiveIntensity={0.22} emissiveMap={screenTexture} /></mesh>
      <Box position={[0.1, 1.5, 0.29]} size={[0.9, 0.065, 0.29]} color="#ebe5d8" />
      {Array.from({ length: 11 }, (_, i) => <Box key={i} position={[-0.3 + i * 0.078, 1.537, 0.29]} size={[0.047, 0.009, 0.17]} color="#b7bdb5" />)}
      <mesh position={[0.79, 1.53, 0.26]} scale={[0.085, 0.045, 0.12]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#dbe2d8" /></mesh>
      <Box position={[1.13, 1.74, -0.21]} size={[0.33, 0.48, 0.33]} color="#e5e0d4" />
      <mesh position={[1.13, 1.77, -0.035]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.02, 16]} /><meshStandardMaterial color="#5a685f" /></mesh>
      <mesh position={[-1.03, 1.59, 0.15]} castShadow><cylinderGeometry args={[0.095, 0.085, 0.23, 12]} /><meshStandardMaterial color="#9dbaab" /></mesh>
      <mesh position={[-1.03, 1.712, 0.15]}><cylinderGeometry args={[0.08, 0.08, 0.012, 12]} /><meshStandardMaterial color="#584131" /></mesh>
      <Box position={[-1.18, 1.65, -0.38]} size={[0.34, 0.08, 0.32]} color="#cf9771" />
      <Box position={[-1.18, 1.72, -0.38]} size={[0.31, 0.06, 0.29]} color="#ede4cf" />
    </group>
  );
}

function Chair() {
  return (
    <group position={[-1.5, 0, -2.4]}>
      <mesh position={[0, 0.33, 0]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.65, 12]} /><meshStandardMaterial color="#555c58" /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <Box key={i} position={[Math.sin(i * Math.PI * 0.4) * 0.18, 0.11, Math.cos(i * Math.PI * 0.4) * 0.18]} size={[0.07, 0.07, 0.5]} rotation={[0, i * Math.PI * 0.4, 0]} color="#555c58" />)}
      <Box position={[0, 0.72, 0]} size={[0.85, 0.18, 0.8]} color="#719b8a" radius={0.06} />
      <Box position={[0, 1.13, 0.32]} size={[0.81, 0.7, 0.16]} rotation={[-0.12, 0, 0]} color="#719b8a" radius={0.05} />
      {[-1, 1].map((side) => <Box key={side} position={[side * 0.46, 0.93, 0]} size={[0.08, 0.12, 0.6]} color="#475755" />)}
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: Vector3Tuple; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.32, 0]} castShadow><cylinderGeometry args={[0.32, 0.22, 0.64, 12]} /><meshStandardMaterial color="#c78c65" /></mesh>
      <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.28, 0.28, 0.02, 12]} /><meshStandardMaterial color="#544a36" /></mesh>
      <mesh position={[0, 1.12, 0]} castShadow><cylinderGeometry args={[0.025, 0.03, 1.08, 8]} /><meshStandardMaterial color="#668555" /></mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i * 2.4) * 0.26, 0.93 + i * 0.1, Math.cos(i * 2.4) * 0.26]} rotation={[0.3, i * 2.4, -0.55]} scale={[0.2, 0.48, 0.09]} castShadow>
          <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={i % 2 ? '#6f9162' : '#497950'} />
        </mesh>
      ))}
    </group>
  );
}

function Bookshelf() {
  const bookColors = ['#cc9f75', '#779887', '#ece3cc', '#b57a63', '#657d84'];
  return (
    <group position={[3.65, 0, -4.48]}>
      {[-0.88, 0.88].map((x) => <Box key={x} position={[x, 1.14, 0]} size={[0.09, 2.28, 0.6]} color="#ba946f" />)}
      {[0.12, 0.83, 1.54, 2.25].map((y) => <Box key={y} position={[0, y, 0]} size={[1.85, 0.075, 0.62]} color="#ba946f" />)}
      {[0.83, 1.54].flatMap((y, row) => Array.from({ length: 7 }, (_, i) => <Box key={`${y}-${i}`} position={[-0.63 + i * 0.2, y + 0.28, 0.05]} size={[0.13, 0.43 + (i % 3) * 0.035, 0.34]} rotation={[0, 0, i === 6 ? -0.12 : 0]} color={bookColors[(i + row) % bookColors.length] ?? '#779887'} />))}
      <Box position={[-0.4, 0.31, 0]} size={[0.55, 0.29, 0.42]} color="#7c9485" />
      <Plant position={[0.48, 2.3, 0]} scale={0.35} />
    </group>
  );
}

function Sofa() {
  return (
    <group position={[-3.95, 0, 0]}>
      <Box position={[0, 0.4, 0]} size={[1.3, 0.58, 3.05]} color="#ce976f" radius={0.12} />
      <Box position={[-0.51, 0.92, 0]} size={[0.3, 0.72, 3.04]} color="#ba8562" radius={0.09} />
      {[-1.39, 1.39].map((z) => <Box key={z} position={[0, 0.77, z]} size={[1.36, 0.48, 0.28]} color="#ba8562" radius={0.09} />)}
      {[-0.78, 0, 0.78].map((z) => <Box key={z} position={[0.03, 0.72, z]} size={[1.05, 0.23, 0.74]} color="#ddb089" radius={0.07} />)}
      <Box position={[-0.28, 1.01, -0.83]} size={[0.26, 0.52, 0.52]} rotation={[0.12, 0, -0.15]} color="#e4d9bb" radius={0.08} />
      <Box position={[-0.29, 1.02, 0.76]} size={[0.28, 0.5, 0.5]} rotation={[-0.2, 0, -0.1]} color="#7f9f88" radius={0.08} />
    </group>
  );
}

function WallArt({ emblem }: { emblem?: string }) {
  const poster = useSignTexture('poster', emblem);
  return (
    <>
      <Box position={[-4.25, 1.7, -4.84]} size={[1.14, 1.52, 0.09]} color="#9f8062" />
      <mesh position={[-4.25, 1.7, -4.785]}><planeGeometry args={[1.02, 1.38]} /><meshStandardMaterial map={poster} /></mesh>
      {[-4.65,-3.85].map(x=><Box key={x} position={[x,.48,-4.84]} size={[.055,.96,.08]} color="#9f8062"/>)}
    </>
  );
}

export function Room({ theme, life, timestamp, firstPerson }: { theme?: KnowledgeRoom; life:RoomLifeView; timestamp: number | null; firstPerson: boolean }) {
  const sideHeight = firstPerson ? 3 : 0.52;
  return (
    <group>
      {/* Adjacent floors start at ±5; overlapping coplanar slabs cause z-fighting. */}
      <Box position={[0, -0.22, 0]} size={[10, 0.44, 10]} color="#b2a287" />
      {Array.from({ length: 25 }, (_, i) => <Box key={i} position={[-4.8 + i * 0.4, 0.007, 0]} size={[0.393, 0.018, 10]} color={['#dbc2a0', '#d7bb96', '#dec7a8', '#d1b591'][i % 4] ?? '#dbc2a0'} />)}
      <Box position={[5.1, sideHeight / 2, -3.22]} size={[0.24, sideHeight, 3.76]} color="#9bb4a1" />
      <Box position={[5.1, sideHeight / 2, 3.22]} size={[0.24, sideHeight, 3.76]} color="#9bb4a1" />
      <Box position={[0.4, 0.028, 0.45]} size={[4.4, 0.028, 3.15]} color="#e9dfc4" />
      <Box position={[0.4, 0.046, 0.45]} size={[4.1, 0.009, 2.84]} color="#b2b7a0" />
      {[-1.75, 2.55].map((x) => <Box key={x} position={[x, 0.05, 0.45]} size={[0.075, 0.012, 2.89]} color="#6f8f7d" />)}
      <Desk />
      <Chair />
      <Sofa />
      <Bookshelf />
      <BloomingGarden blooms={life.blooms} watering={life.watering&&life.wateringSpot==='plant'}/>
      <LivingRoomDetails view={life} timestamp={timestamp}/>
      <Greenhouse view={life}/>
      <WallArt emblem={theme?.emblem}/>
      <mesh position={[-3.45, 1.5, -3.6]} castShadow><cylinderGeometry args={[0.025, 0.025, 2.95, 10]} /><meshStandardMaterial color="#5c6354" /></mesh>
      <mesh position={[-3.45, 2.85, -3.6]} castShadow><coneGeometry args={[0.43, 0.45, 16, 1, true]} /><meshStandardMaterial color="#e8d7af" /></mesh>
      <pointLight position={[-3.45, 2.64, -3.6]} color="#ffdb9b" intensity={5} distance={4} decay={2} />
    </group>
  );
}
