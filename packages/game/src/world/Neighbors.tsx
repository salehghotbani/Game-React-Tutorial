import { tx, useLanguage } from '@react-quest/localization';
import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { NEIGHBORS, type NeighborId } from './layout';
import { HumanFigure } from '../player/HumanFigure';

export type NeighborSpeech = { id: NeighborId; text: string };

function Neighbor({ person, speech, onTalk }: { person: typeof NEIGHBORS[number]; speech?: NeighborSpeech; onTalk?: (id: NeighborId) => void }) {
  useLanguage();
  const body = useRef<Group>(null);
  const elderly = person.id === 'grandmother' || person.id === 'grandfather';
  useFrame(({ clock }) => {
    if (body.current) body.current.rotation.z = Math.sin(clock.elapsedTime * 1.4 + person.position[0]) * 0.018;
  });
  return <group position={person.position} scale={person.scale} rotation={[0, -0.4, 0]}>
    <group ref={body}>
      <HumanFigure shirt={person.color} hair={person.hair} elderly={elderly} skirt={person.id === 'grandmother'} beard={person.id === 'grandfather'} />
      {elderly && <mesh position={[0.4, 0.4, 0.15]}><cylinderGeometry args={[0.018, 0.018, 0.8, 10]} /><meshStandardMaterial color="#735639" roughness={0.7} /></mesh>}
    </group>
    <Html position={[0, 2.05, 0]} center zIndexRange={[9, 0]}>
      <div className="neighbor-label">
        {speech?.id === person.id && <div className="neighbor-speech" role="status">{tx(speech.text)}</div>}
        <button aria-label={tx(`گفتگو با ${person.name}`)} onClick={() => onTalk?.(person.id)}>{tx(person.name)}</button>
      </div>
    </Html>
  </group>;
}

export function Neighbors({ speech, onTalk }: { speech?: NeighborSpeech; onTalk?: (id: NeighborId) => void }) {
  useLanguage();
  return <>{NEIGHBORS.map(person => <Neighbor key={person.id} person={person} speech={speech} onTalk={onTalk} />)}</>;
}
