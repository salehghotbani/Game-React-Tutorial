import { tx, useLanguage } from '@react-quest/localization';
import { Html } from '@react-three/drei';
import type { GameSettings, Vector3Tuple } from '@react-quest/shared';
import { ROOM_COLLIDERS, type RoomSpotId } from '../config';
import { worldDaylight } from '../logic/appearance';
import type { RoomLifeView } from '../room/RoomLife';
import { FLOOR_AREAS, GAME_NET, NEIGHBORHOOD_COLLIDERS, NEIGHBOR_HOUSES, WORLD_CEILINGS } from './layout';
import { WorldBox, WorldSign } from './Primitives';
import { ForegroundBuilding } from './ForegroundBuilding';
import { NaturalTree as Tree } from './NaturalTree';
import { NeighborHouse as House } from './NeighborHouse';
import { NeighborhoodDetails } from './NeighborhoodDetails';

function Destination({ id, position, label, life }: { id: RoomSpotId; position: Vector3Tuple; label: string; life: RoomLifeView }) {
  useLanguage();
  return <Html position={position} center zIndexRange={[9, 0]}><button className="room-marker ready" onClick={() => life.onNavigate?.(id)} aria-label={tx(`رفتن به ${label}`)}><span>✦</span>{tx(label)}</button></Html>;
}

function Architecture({ cameraView }: { cameraView: GameSettings['cameraView'] }) {
  useLanguage();
  const walls = [...ROOM_COLLIDERS.filter(collider => collider.id.startsWith('wall-') && collider.id !== 'wall-east'), ...NEIGHBORHOOD_COLLIDERS.filter(collider =>
    !collider.id.endsWith('floor') && (collider.id.startsWith('world-') || collider.id.startsWith('upper-') || collider.id.startsWith('annex-') || collider.id.startsWith('yard-') && !collider.id.includes('tree') && !collider.id.includes('bench') || collider.id.startsWith('net-') && collider.id !== 'net-desks' && !collider.id.startsWith('net-chair') || collider.id === 'quiet-south')
  )];
  return <>{walls.map(wall => {
    const outdoor = wall.id.startsWith('world-') || wall.id.startsWith('yard-');
    const rearWall = wall.id === 'upper-north' || wall.id === 'annex-north';
    const height = outdoor ? 0.8 : cameraView === 'firstPerson' || rearWall ? 3 : 0.85;
    const color = wall.id.startsWith('net-') ? '#8eaeb6' : outdoor ? '#c4c9ae' : '#dbdcc8';
    return <WorldBox key={wall.id} position={[wall.position[0], height / 2, wall.position[2]]} size={[wall.halfExtents[0] * 2, height, wall.halfExtents[2] * 2]} color={color} />;
  })}</>;
}

function ExtraRooms({ life }: { life: RoomLifeView }) {
  useLanguage();
  return <>
    <WorldBox position={[-3.8, 0.65, -11.4]} size={[2.2, 1.3, 1.1]} color="#b6c6b4" />
    <WorldBox position={[-3.8, 1.34, -11.4]} size={[2.3, 0.08, 1.2]} color="#e5ddc8" />
    <WorldBox position={[-4.2, 1.39, -11.4]} size={[0.6, 0.04, 0.7]} color="#90a3a2" />
    <WorldBox position={[-1, 1.1, -11.3]} size={[1.1, 2.2, 1.2]} color="#e0e6de" />
    <WorldBox position={[-1, 1.2, -10.67]} size={[0.04, 0.65, 0.05]} color="#98a9a1" />
    <WorldBox position={[-2.9, 0.9, -8.7]} size={[1.5, 0.1, 1.4]} color="#cfaa7f" />
    {[-1, 1].map(side => <WorldBox key={side} position={[-2.9 + side * 0.5, 0.45, -8.7]} size={[0.09, 0.9, 1]} color="#a99070" />)}
    <WorldBox position={[-8.7, 0.43, -2.7]} size={[1.6, 0.7, 3]} color="#bea489" />
    <WorldBox position={[-8.7, 0.86, -2.4]} size={[1.5, 0.19, 2.3]} color="#91afa7" />
    <WorldBox position={[-8.7, 0.93, -3.6]} size={[1.2, 0.2, 0.6]} color="#f0e9d7" />
    <WorldBox position={[-8.9, 1.2, 1.2]} size={[1.3, 0.12, 1.6]} color="#d4af86" />
    <WorldBox position={[-8.9, 1.3, 1]} size={[0.5, 0.07, 0.65]} color="#829e95" />
    <WorldBox position={[-7.6, 1.8, -4.92]} size={[2.4, 1.35, 0.08]} color="#93b6b6" />
    <WorldBox position={[-7.6, 1.8, -4.86]} size={[0.05, 1.35, 0.06]} color="#e5e3ce" />
    <WorldBox position={[-7.6, 1.8, -4.86]} size={[2.4, 0.05, 0.06]} color="#e5e3ce" />
    <WorldBox position={[2.5, 0.025, -8.9]} size={[3.8, 0.04, 4.8]} color="#c7c2b0" />
    <Destination id="kitchen" position={[-2.2, 2, -7.5]} label={tx("آشپزخانه")} life={life} />
    <Destination id="quietRoom" position={[-7.3, 2, 0]} label={tx("اتاق آرام")} life={life} />
  </>;
}

function Yard({ life }: { life: RoomLifeView }) {
  useLanguage();
  return <>
    <WorldBox position={[0, 0.013, 8.5]} size={[4, 0.035, 7]} color="#b5ad9b" surface="stone" />
    {[-1, 1].map(side => <WorldBox key={side} position={[side * 5.4, 0.015, 8.5]} size={[6.7, 0.04, 6.7]} color="#637f4c" surface="grass" />)}
    <Tree x={-6.6} z={8.2} /><Tree x={7.6} z={8} scale={0.9} />
    <WorldBox position={[4, 0.58, 9.5]} size={[3, 0.15, 0.9]} color="#b5936e" />
    <WorldBox position={[4, 1, 9.9]} size={[3, 0.72, 0.12]} color="#b5936e" />
    {[-1, 1].map(side => <WorldBox key={side} position={[4 + side, 0.25, 9.5]} size={[0.12, 0.5, 0.6]} color="#678779" />)}
    <Destination id="yard" position={[0, 2.2, 8.2]} label={tx("حیاط خانه")} life={life} />
    <Destination id="street" position={[0, 2.3, 12.5]} label={tx("کوچهٔ یادگیری")} life={life} />
  </>;
}

function GameNetBuilding({ life, unlocked }: { life: RoomLifeView; unlocked: boolean }) {
  useLanguage();
  return <>
    <WorldBox position={[-15, 0.015, 7.5]} size={[8.8, 0.04, 6.8]} color="#536c77" />
    <WorldBox position={[-15, 1.45, 4.03]} size={[8.8, 2.9, 0.2]} color="#527982" />
    <WorldSign text={tx("REACT PLAY / گیم‌نت")} position={[-15, 2.6, 11.12]} width={5} color="#a9efe2" />
    <WorldBox position={[-15, 2.6, 11.05]} size={[5.4, 1.5, 0.12]} color="#335b60" />
    <WorldBox position={[-15, 1.4, 5.1]} size={[6.2, 0.13, 1.2]} color="#b5a485" />
    {[-17.2, -15, -12.8].map(x => <group key={x} position={[x, 0, 5.1]}>
      <WorldBox position={[0, 1.98, -0.1]} size={[1.45, 0.94, 0.13]} color="#263c48" />
      <WorldBox position={[0, 1.98, -0.02]} size={[1.31, 0.79, 0.015]} color={unlocked ? '#66b9a2' : '#557080'} emissive={unlocked ? '#66b9a2' : undefined} />
      <WorldBox position={[0, 1.5, 0.24]} size={[0.75, 0.04, 0.28]} color="#405561" />
      <WorldBox position={[0, 0.5, 1.1]} size={[0.65, 0.4, 0.7]} color="#759a9c" />
      <WorldBox position={[0, 0.9, 1.35]} size={[0.65, 0.65, 0.12]} color="#648b92" />
    </group>)}
    <Destination id="gameNet" position={[-15, 2.6, 7.2]} label={tx(unlocked ? 'گیم‌نت · ۳ دقیقه بازی' : `گیم‌نت · ${GAME_NET.requiredXp} XP`)} life={life} />
  </>;
}

export function Neighborhood({ settings, life, timestamp, gameNetUnlocked }: { settings: GameSettings; life: RoomLifeView; timestamp: number | null; gameNetUnlocked: boolean }) {
  useLanguage();
  const night = worldDaylight(timestamp, settings.themeMode) < 0.2;
  return <>
    <WorldBox position={[0, -0.12, 7]} size={[60, 0.2, 60]} color="#677e53" surface="grass" />
    {FLOOR_AREAS.filter(area => area.id !== 'studio').map(area => <WorldBox key={area.id} position={[area.x, -0.1, area.z]} size={[area.width, 0.2, area.depth]} color={area.id === 'street' ? '#464b50' : area.id.includes('walk') ? '#b6b6ac' : '#d0b696'} surface={area.id === 'street' ? 'asphalt' : area.id.includes('walk') ? 'stone' : 'wood'} />)}
    <Architecture cameraView={settings.cameraView} />
    {settings.cameraView === 'firstPerson' && settings.mode === 'explore' && WORLD_CEILINGS.map(ceiling => <WorldBox key={ceiling.id} position={ceiling.position} size={[ceiling.halfExtents[0] * 2, ceiling.halfExtents[1] * 2, ceiling.halfExtents[2] * 2]} color="#e4decb" />)}
    <ExtraRooms life={life} />
    <Yard life={life} />
    <NeighborhoodDetails />
    <GameNetBuilding life={life} unlocked={gameNetUnlocked} />
    {NEIGHBOR_HOUSES.map((house, index) => <ForegroundBuilding key={index} bounds={house} cameraView={settings.cameraView}><House house={house} index={index} night={night} /></ForegroundBuilding>)}
    {[-18, -9, 0, 9, 18].map(x => <WorldBox key={x} position={[x, 0.012, 15.7]} size={[3, 0.025, 0.12]} color="#dfe1cd" />)}
    {[-19, 8, 19].map(x => <group key={x} position={[x, 0, 18.6]}>
      <WorldBox position={[0, 1.8, 0]} size={[0.09, 3.6, 0.09]} color="#607b76" />
      <WorldBox position={[0, 3.5, 0]} size={[0.46, 0.32, 0.46]} color="#e7cf91" emissive={night ? '#f0c477' : undefined} />
      {night && <pointLight position={[0, 3.3, 0]} intensity={8} distance={7} color="#f9d29b" />}
    </group>)}
    <Tree x={18.5} z={20} scale={1.1} /><Tree x={-19.3} z={20} />
  </>;
}
