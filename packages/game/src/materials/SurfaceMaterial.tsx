import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { createSurfaceTextures, type SurfaceKind, type SurfaceTextures } from './textures';

const kinds: SurfaceKind[] = ['wood', 'plaster', 'brick', 'stone', 'asphalt', 'grass', 'fabric', 'roof', 'metal'];
const Library = createContext<Partial<Record<SurfaceKind, SurfaceTextures>>>({});
const woodColors = new Set(['#d5ad80', '#ba946f', '#b2a287', '#dbc2a0', '#d7bb96', '#dec7a8', '#d1b591', '#d4af86', '#cfaa7f', '#a99070', '#b5936e', '#876950', '#9f8062', '#b5a485']);
const fabricColors = new Set(['#719b8a', '#ce976f', '#ba8562', '#ddb089', '#e4d9bb', '#7f9f88', '#91afa7', '#c7c2b0', '#b2b7a0']);

export function SurfaceProvider({ children }: { children: ReactNode }) {
  const library = useMemo(() => Object.fromEntries(kinds.map((kind, index) => [kind, createSurfaceTextures(kind, index + 1)])) as Record<SurfaceKind, SurfaceTextures>, []);
  useEffect(() => () => { Object.values(library).forEach(surface => Object.values(surface).forEach(texture => texture.dispose())); }, [library]);
  return <Library.Provider value={library}>{children}</Library.Provider>;
}

export function SurfaceMaterial({ color, surface, emissive }: { color: string; surface?: SurfaceKind; emissive?: string }) {
  const library = useContext(Library);
  const kind = surface ?? (woodColors.has(color) ? 'wood' : fabricColors.has(color) ? 'fabric' : 'plaster');
  const textures = library[kind];
  return <meshStandardMaterial color={color} map={kind === 'metal' ? undefined : textures?.map} bumpMap={textures?.bumpMap}
    roughnessMap={textures?.roughnessMap} bumpScale={kind === 'brick' ? 0.075 : kind === 'wood' ? 0.04 : 0.025}
    roughness={kind === 'metal' ? 0.35 : kind === 'wood' ? 0.62 : 0.91} metalness={kind === 'metal' ? 0.75 : 0}
    emissive={emissive} emissiveIntensity={emissive ? 0.45 : 0} />;
}
