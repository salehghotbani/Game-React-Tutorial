import { useLayoutEffect, useRef } from 'react';
import { DoubleSide, InstancedMesh, Object3D } from 'three';
import { SurfaceMaterial } from '../materials/SurfaceMaterial';

const LEAVES = 220;

export function NaturalTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const canopy = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = canopy.current;
    if (!mesh) return;
    const leaf = new Object3D();
    for (let index = 0; index < LEAVES; index++) {
      const angle = index * 2.39996;
      const radius = Math.sqrt((index % 47) / 47) * 1.35;
      leaf.position.set(Math.cos(angle) * radius, 2.5 + Math.sin(index * 1.7) * 0.57 + (1 - radius / 1.35) * 0.6, Math.sin(angle) * radius);
      leaf.rotation.set(Math.sin(index) * 0.8, angle, Math.cos(index * 2) * 0.5);
      leaf.scale.set(0.22 + index % 3 * 0.045, 0.07, 0.43);
      leaf.updateMatrix(); mesh.setMatrixAt(index, leaf.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={[x, 0, z]} scale={scale}>
    <mesh position={[0, 1.05, 0]} castShadow><cylinderGeometry args={[0.11, 0.24, 2.1, 16]} /><SurfaceMaterial color="#725340" surface="wood" /></mesh>
    {[0, 1, 2, 3, 4].map(index => <mesh key={index} position={[Math.sin(index * 1.26) * 0.24, 1.9, Math.cos(index * 1.26) * 0.24]} rotation={[Math.cos(index * 1.26) * 0.5, 0, Math.sin(index * 1.26) * 0.5]} castShadow><cylinderGeometry args={[0.035, 0.075, 1.1, 10]} /><SurfaceMaterial color="#765940" surface="wood" /></mesh>)}
    <instancedMesh ref={canopy} args={[undefined, undefined, LEAVES]} castShadow receiveShadow>
      <sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#527447" roughness={0.92} side={DoubleSide} />
    </instancedMesh>
  </group>;
}
