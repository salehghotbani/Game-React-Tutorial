import { useEffect, useMemo } from 'react';
import { BoxGeometry } from 'three';
import type { Vector3Tuple } from '@react-quest/shared';

/** Tile surface detail in meters rather than stretching it across each object. */
export function useBoxGeometry([width, height, depth]: Vector3Tuple) {
  const geometry = useMemo(() => {
    const box = new BoxGeometry(width, height, depth);
    const uv = box.getAttribute('uv');
    const normal = box.getAttribute('normal');
    for (let vertex = 0; vertex < uv.count; vertex++) {
      const faceWidth = Math.abs(normal.getX(vertex)) > 0.5 ? depth : width;
      const faceHeight = Math.abs(normal.getY(vertex)) > 0.5 ? depth : height;
      uv.setXY(vertex, uv.getX(vertex) * faceWidth, uv.getY(vertex) * faceHeight);
    }
    return box;
  }, [width, height, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}
