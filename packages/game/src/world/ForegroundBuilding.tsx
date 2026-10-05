import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils, Mesh, MeshStandardMaterial } from 'three';
import type { GameSettings } from '@react-quest/shared';

type Props = {
  bounds: { x: number; z: number; width: number; depth: number };
  cameraView: GameSettings['cameraView'];
  children: ReactNode;
};

/** Fade the nearby façade when the follow camera is above it. Physics stays solid. */
export function ForegroundBuilding({ bounds, cameraView, children }: Props) {
  const group = useRef<Group>(null);
  const opacity = useRef(1);
  const surfaces = useRef<{ mesh: Mesh; castsShadow: boolean; materials: MeshStandardMaterial[] }[]>([]);

  useFrame(({ camera }, delta) => {
    if (!surfaces.current.length) group.current?.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const materials = (Array.isArray(object.material) ? object.material : [object.material])
        .filter((material): material is MeshStandardMaterial => material instanceof MeshStandardMaterial);
      surfaces.current.push({ mesh: object, castsShadow: object.castShadow, materials });
    });
    const aboveBuilding = cameraView === 'thirdPerson'
      && Math.abs(camera.position.x - bounds.x) < bounds.width / 2 + 1.5
      && Math.abs(camera.position.z - bounds.z) < bounds.depth / 2 + 1.5;
    const next = MathUtils.damp(opacity.current, aboveBuilding ? 0.12 : 1, 9, Math.min(delta, 0.1));
    opacity.current = Math.abs(next - 1) < 0.001 ? 1 : next;
    for (const { mesh, castsShadow, materials } of surfaces.current) {
      mesh.castShadow = castsShadow && opacity.current === 1;
      for (const material of materials) {
        material.transparent = opacity.current < 1;
        material.opacity = opacity.current;
        material.depthWrite = opacity.current === 1;
      }
    }
  });

  return <group ref={group}>{children}</group>;
}
