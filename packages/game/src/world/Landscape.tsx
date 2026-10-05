import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Float32BufferAttribute, InstancedMesh, Object3D, PlaneGeometry } from 'three';
import type { ThemeMode } from '@react-quest/shared';
import { worldDaylight } from '../logic/appearance';
import { MEADOW_TREES } from './layout';
import { terrainHeight, isMeadowPlanting } from './terrain';
import { NaturalTree } from './NaturalTree';

function Mountains() {
  const geometry = useMemo(() => {
    const terrain = new PlaneGeometry(360, 360, 120, 120);
    terrain.rotateX(-Math.PI / 2);
    const positions = terrain.getAttribute('position');
    const colors: number[] = [];
    const grass = new Color('#718457'), rock = new Color('#777c76'), snow = new Color('#e5ecea');
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index), z = positions.getZ(index);
      const height = terrainHeight(x, z);
      positions.setY(index, height);
      const color = grass.clone().lerp(rock, Math.min(1, Math.max(0, (height - 10) / 28))).lerp(snow, Math.min(1, Math.max(0, (height - 43) / 15)));
      color.multiplyScalar(0.94 + Math.sin(x * 0.8 + z * 0.6) * 0.045);
      colors.push(color.r, color.g, color.b);
    }
    terrain.setAttribute('color', new Float32BufferAttribute(colors, 3));
    terrain.computeVertexNormals();
    return terrain;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial vertexColors roughness={1} /></mesh>;
}

function Wildflowers() {
  const stems = useRef<InstancedMesh>(null), flowers = useRef<InstancedMesh>(null), grass = useRef<InstancedMesh>(null);
  const points = useMemo(() => Array.from({ length: 2600 }, (_, i) => ({ x: Math.sin(i * 127.1) * 71, z: 10 + Math.sin(i * 311.7) * 61 })).filter(p => isMeadowPlanting(p.x, p.z)), []);
  useLayoutEffect(() => {
    const object = new Object3D();
    points.forEach((p, i) => {
      object.position.set(p.x, 0.15, p.z); object.scale.set(0.7, 0.8 + (i % 4) * 0.1, 0.7); object.rotation.set(0, i * 2.4, 0); object.updateMatrix();
      grass.current?.setMatrixAt(i, object.matrix);
      if (i < 550) {
        object.position.y = 0.11; object.scale.set(1, 1, 1); object.updateMatrix(); stems.current?.setMatrixAt(i, object.matrix);
        object.position.y = 0.245; object.scale.set(1, 0.4, 1); object.updateMatrix(); flowers.current?.setMatrixAt(i, object.matrix);
        flowers.current?.setColorAt(i, new Color(['#e2bd62', '#dedbd2', '#b581b6'][i % 3]));
      }
    });
    for (const mesh of [stems.current, flowers.current, grass.current]) { if (mesh) { mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; mesh.computeBoundingSphere(); } }
  }, [points]);
  return <>
    <instancedMesh ref={grass} args={[undefined, undefined, points.length]}><coneGeometry args={[0.09, 0.31, 3]} /><meshStandardMaterial color="#78924f" roughness={1} /></instancedMesh>
    <instancedMesh ref={stems} args={[undefined, undefined, 550]}><cylinderGeometry args={[0.012, 0.016, 0.25, 4]} /><meshStandardMaterial color="#587845" /></instancedMesh>
    <instancedMesh ref={flowers} args={[undefined, undefined, 550]}><sphereGeometry args={[0.065, 6, 4]} /><meshStandardMaterial roughness={0.95} /></instancedMesh>
  </>;
}

function Clouds({ paused, daylight }: { paused: boolean; daylight: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const time = useRef(0);
  const object = useMemo(() => new Object3D(), []);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (!paused) time.current += Math.min(delta, 0.1);
    for (let i = 0; i < 60; i++) {
      const cloud = Math.floor(i / 6), part = i % 6;
      const x = ((cloud * 37 + time.current * 0.35 + 300) % 300) - 150;
      object.position.set(x + (part - 2.5) * 3.5, 31 + cloud % 3 * 7 + Math.sin(part * 1.8) * 1.5, -110 + cloud % 5 * 44 + Math.cos(part) * 2);
      object.scale.set(5 + part % 2 * 2, 2.1 + Math.sin(part) * 0.4, 4.5); object.updateMatrix(); mesh.current.setMatrixAt(i, object.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  const color = new Color('#5a6577').lerp(new Color('#fff6e6'), daylight);
  return <instancedMesh ref={mesh} args={[undefined, undefined, 60]} frustumCulled={false}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={color} roughness={1} transparent opacity={0.89} depthWrite={false} /></instancedMesh>;
}

export function Landscape({ timestamp, theme, paused }: { timestamp: number | null; theme: ThemeMode; paused: boolean }) {
  return <><Mountains /><Wildflowers /><Clouds paused={paused} daylight={worldDaylight(timestamp, theme)} />{MEADOW_TREES.map(([x, z], i) => <NaturalTree key={i} x={x} z={z} scale={1.2 + i % 3 * 0.15} />)}</>;
}
