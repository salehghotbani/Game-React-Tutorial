import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

export type SurfaceKind = 'wood' | 'plaster' | 'brick' | 'stone' | 'asphalt' | 'grass' | 'fabric' | 'roof' | 'metal';
export type SurfaceTextures = { map: CanvasTexture; bumpMap: CanvasTexture; roughnessMap: CanvasTexture };

function randomSource(seed: number) {
  let state = seed;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
}

function textureFrom(canvas: HTMLCanvasElement, color: boolean, repeat: [number, number]) {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 4;
  if (color) texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createSurfaceTextures(kind: SurfaceKind, seed: number): SurfaceTextures {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const random = randomSource(seed);
  context.fillStyle = '#e3e3e3';
  context.fillRect(0, 0, 256, 256);
  for (let index = 0; index < 16000; index++) {
    const shade = Math.round(155 + random() * 90);
    context.fillStyle = `rgba(${shade},${shade},${shade},${kind === 'asphalt' ? 0.65 : 0.2})`;
    context.fillRect(random() * 256, random() * 256, 1 + random(), 1 + random());
  }
  if (kind === 'wood') {
    for (let line = 0; line < 140; line++) {
      const y = random() * 256;
      const wave = 1 + random() * 5;
      context.strokeStyle = `rgba(65,65,65,${0.05 + random() * 0.18})`;
      context.lineWidth = 0.3 + random();
      context.beginPath();
      for (let x = 0; x <= 256; x += 4) {
        const grain = y + Math.sin(x / 44 + y) * wave;
        if (!x) context.moveTo(x, grain); else context.lineTo(x, grain);
      }
      context.stroke();
    }
  }
  if (kind === 'brick' || kind === 'stone') {
    const rowHeight = kind === 'brick' ? 32 : 64;
    for (let row = 0; row < 256 / rowHeight; row++) {
      for (let column = -1; column < 5; column++) {
        const x = column * 64 + (row % 2 ? 32 : 0);
        const shade = 175 + Math.floor(random() * 55);
        context.fillStyle = `rgb(${shade},${shade},${shade})`;
        context.fillRect(x + 2, row * rowHeight + 2, 60, rowHeight - 4);
        context.strokeStyle = '#929292';
        context.lineWidth = 2;
        context.strokeRect(x + 1, row * rowHeight + 1, 62, rowHeight - 2);
      }
    }
  }
  if (kind === 'grass') {
    for (let index = 0; index < 4000; index++) {
      const x = random() * 256, y = random() * 256;
      context.strokeStyle = random() > 0.5 ? '#9a9a9a80' : '#fafafa60';
      context.beginPath(); context.moveTo(x, y); context.lineTo(x + random() * 5 - 2.5, y - 2 - random() * 8); context.stroke();
    }
  }
  if (kind === 'fabric') {
    context.lineWidth = 0.5;
    for (let line = 0; line < 256; line += 2) {
      context.strokeStyle = line % 4 ? '#ffffff40' : '#77777735';
      context.beginPath(); context.moveTo(line, 0); context.lineTo(line, 256); context.moveTo(0, line); context.lineTo(256, line); context.stroke();
    }
  }
  if (kind === 'roof') {
    for (let row = 0; row < 8; row++) {
      context.fillStyle = row % 2 ? '#c4c4c4' : '#e1e1e1';
      context.fillRect(0, row * 32, 256, 31);
      context.strokeStyle = '#737373';
      for (let column = -1; column < 8; column++) context.strokeRect(column * 40 + (row % 2 ? 20 : 0), row * 32, 40, 32);
    }
  }
  const roughness = document.createElement('canvas');
  roughness.width = roughness.height = 256;
  const roughContext = roughness.getContext('2d')!;
  roughContext.fillStyle = kind === 'wood' ? '#989898' : '#dedede';
  roughContext.fillRect(0, 0, 256, 256);
  roughContext.globalAlpha = 0.15;
  roughContext.drawImage(canvas, 0, 0);
  const repeat: [number, number] = kind === 'brick' ? [1, 2] : kind === 'roof' ? [0.5, 0.5] : [1, 1];
  return { map: textureFrom(canvas, true, repeat), bumpMap: textureFrom(canvas, false, repeat), roughnessMap: textureFrom(roughness, false, repeat) };
}
