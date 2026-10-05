import { useLayoutEffect, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { WorldBox } from './Primitives';

function GrassPatch({ x }: { x: number }) {
  const grass = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!grass.current) return;
    const blade = new Object3D();
    for (let index = 0; index < 280; index++) {
      blade.position.set(Math.sin(index * 67.1) * 3, 0.08, 8.5 + Math.cos(index * 39.7) * 3);
      blade.rotation.set(0, index * 2.4, Math.sin(index) * 0.15);
      blade.scale.set(0.7, 0.65 + (index % 7) * 0.12, 1);
      blade.updateMatrix(); grass.current.setMatrixAt(index, blade.matrix);
    }
    grass.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh position={[x, 0, 0]} ref={grass} args={[undefined, undefined, 280]} receiveShadow><coneGeometry args={[0.025, 0.16, 3]} /><meshStandardMaterial color="#6d864e" roughness={0.95} /></instancedMesh>;
}

export function NeighborhoodDetails() {
  return <>
    <GrassPatch x={-5.4} /><GrassPatch x={5.4} />
    {[-1, 1].map(side => <WorldBox key={side} position={[0, 0.04, 15.5 + side * 3.35]} size={[42, 0.12, 0.24]} color="#b6b6ac" surface="stone" />)}
    {[-18, -7, 5, 17].map(x => <group key={x} position={[x, 0.045, 18.5]}>
      <WorldBox position={[0, 0, 0]} size={[0.65, 0.025, 0.38]} color="#555c5e" surface="metal" />
      {[-2, -1, 0, 1, 2].map(index => <WorldBox key={index} position={[index * 0.11, 0.018, 0]} size={[0.055, 0.02, 0.3]} color="#30373a" surface="metal" />)}
    </group>)}
    {[-1, 1].map(side => <WorldBox key={`path-${side}`} position={[side * 2.05, 0.065, 8.5]} size={[0.14, 0.1, 7]} color="#a49e8f" surface="stone" />)}
  </>;
}
