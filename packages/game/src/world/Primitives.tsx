import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Vector3Tuple } from '@react-quest/shared';
import { SurfaceMaterial } from '../materials/SurfaceMaterial';
import type { SurfaceKind } from '../materials/textures';
import { useBoxGeometry } from '../materials/useBoxGeometry';
import { RoundedBox } from '@react-three/drei';
import { translate, useLanguage } from '@react-quest/localization';

type BoxProps = { position: Vector3Tuple; size: Vector3Tuple; color: string; rotation?: Vector3Tuple; emissive?: string; surface?: SurfaceKind; radius?: number };

export function WorldBox({ position, size, color, rotation, emissive, surface, radius }: BoxProps) {
  const geometry = useBoxGeometry(size);
  if (radius) return <RoundedBox position={position} rotation={rotation} args={size} radius={Math.min(radius, ...size.map(dimension => dimension / 3))} smoothness={3} castShadow receiveShadow><SurfaceMaterial color={color} surface={surface} emissive={emissive} /></RoundedBox>;
  return <mesh position={position} rotation={rotation} geometry={geometry} castShadow receiveShadow>
    <SurfaceMaterial color={color} surface={surface} emissive={emissive} />
  </mesh>;
}

export function WorldSign({ text, position, width = 2, color = '#bce7cc', rotation }: { text: string; position: Vector3Tuple; width?: number; color?: string; rotation?: Vector3Tuple }) {
  const language = useLanguage();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 192;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#28493f';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.font = 'bold 72px Tahoma';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.direction = language === 'fa' ? 'rtl' : 'ltr';
      context.fillText(translate(text, language), 384, 96, 700);
    }
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [text, color, language]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position} rotation={rotation}><planeGeometry args={[width, width / 4]} /><meshStandardMaterial map={texture} emissive="#bce7cc" emissiveIntensity={0.1} /></mesh>;
}
