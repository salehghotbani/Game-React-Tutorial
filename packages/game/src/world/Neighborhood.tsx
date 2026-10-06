import { useLanguage } from '@react-quest/localization';
import type { GameSettings } from '@react-quest/shared';
import { ROOM_COLLIDERS } from '../config';
import { FLOOR_AREAS, HOME_FLOOR, NEIGHBORHOOD_COLLIDERS, WORLD_CEILINGS } from './layout';
import { WorldBox } from './Primitives';
import { NaturalTree as Tree } from './NaturalTree';

function Architecture({ cameraView }: { cameraView: GameSettings['cameraView'] }) {
  useLanguage();
  const walls = [...ROOM_COLLIDERS.filter(collider => collider.id.startsWith('wall-') && collider.id !== 'wall-east'), ...NEIGHBORHOOD_COLLIDERS.filter(collider =>
    !collider.id.endsWith('floor') && (collider.id.startsWith('upper-') || collider.id.startsWith('annex-') || collider.id.startsWith('yard-') && !collider.id.includes('tree') && !collider.id.includes('bench') || collider.id.startsWith('net-') && collider.id !== 'net-desks' && !collider.id.startsWith('net-chair') || collider.id === 'quiet-south')
  )];
  return <>{walls.map(wall => {
    const outdoor = wall.id.startsWith('world-') || wall.id.startsWith('yard-');
    const rearWall = wall.id === 'upper-north' || wall.id === 'annex-north';
    const height = outdoor ? 0.8 : cameraView === 'firstPerson' || rearWall ? 3 : 0.85;
    const color = wall.id.startsWith('net-') ? '#8eaeb6' : outdoor ? '#c4c9ae' : '#dbdcc8';
    return <WorldBox key={wall.id} position={[wall.position[0], height / 2, wall.position[2]]} size={[wall.halfExtents[0] * 2, height, wall.halfExtents[2] * 2]} color={color} />;
  })}</>;
}

function ExtraRooms() {
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
  </>;
}

function Yard() {
  useLanguage();
  return <>
    <WorldBox position={[0, 0.013, 8.5]} size={[4, 0.035, 7]} color="#b5ad9b" surface="stone" />
    {[-1, 1].map(side => <WorldBox key={side} position={[side * 5.4, 0.015, 8.5]} size={[6.7, 0.04, 6.7]} color="#637f4c" surface="grass" />)}
    <Tree x={-6.6} z={8.2} /><Tree x={7.6} z={8} scale={0.9} />
    <WorldBox position={[4, 0.58, 9.5]} size={[3, 0.15, 0.9]} color="#b5936e" />
    <WorldBox position={[4, 1, 9.9]} size={[3, 0.72, 0.12]} color="#b5936e" />
    {[-1, 1].map(side => <WorldBox key={side} position={[4 + side, 0.25, 9.5]} size={[0.12, 0.5, 0.6]} color="#678779" />)}
  </>;
}

export function Neighborhood({ settings }: { settings: GameSettings }) {
  return <>
    <WorldBox position={HOME_FLOOR.position} size={[HOME_FLOOR.halfExtents[0] * 2, HOME_FLOOR.halfExtents[1] * 2, HOME_FLOOR.halfExtents[2] * 2]} color="#637f4c" surface="grass" />
    {FLOOR_AREAS.filter(area => area.id !== 'studio').map(area => <WorldBox key={area.id}
      position={[area.x, -0.1, area.z]} size={[area.width, 0.2, area.depth]} color="#d0b696" surface="wood" />)}
    <Architecture cameraView={settings.cameraView} />
    {settings.cameraView === 'firstPerson' && settings.mode === 'explore' && WORLD_CEILINGS.map(ceiling => <WorldBox key={ceiling.id} position={ceiling.position} size={[ceiling.halfExtents[0] * 2, ceiling.halfExtents[1] * 2, ceiling.halfExtents[2] * 2]} color="#e4decb" />)}
    <ExtraRooms />
    <Yard />
    <WorldBox position={[0, 0.4, 12.2]} size={[20.8, 0.8, 0.24]} color="#c4c9ae" surface="stone" />
  </>;
}
