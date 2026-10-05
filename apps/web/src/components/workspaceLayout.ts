export type PanelSpec = { id: string; size: number; height: number; minWidth: number; minHeight: number };
export type PanelLayout = { hidden: string[]; columns: Record<string, number>; rows: Record<string, number> };
export type PanelMinimum = { id: string; minimum: number };
export const WORKSPACE_KEY = 'react-quest-workspace-v1';

export function defaultPanelLayout(panels: PanelSpec[]): PanelLayout {
  return { hidden: [], columns: Object.fromEntries(panels.map(p => [p.id, p.size])), rows: Object.fromEntries(panels.map(p => [p.id, p.height])) };
}
export function restorePanelLayout(value: unknown, panels: PanelSpec[]): PanelLayout {
  const layout = defaultPanelLayout(panels);
  if (!value || typeof value !== 'object') return layout;
  const data = value as Record<string, unknown>;
  if (data.version !== 1) return layout;
  if (Array.isArray(data.hidden)) layout.hidden = panels.filter(p => (data.hidden as unknown[]).includes(p.id)).map(p => p.id);
  for (const axis of ['columns', 'rows'] as const) {
    const sizes = data[axis];
    if (!sizes || typeof sizes !== 'object') continue;
    for (const panel of panels) {
      const size = (sizes as Record<string, unknown>)[panel.id];
      if (typeof size === 'number' && Number.isFinite(size) && size > 0 && size <= 10000) layout[axis][panel.id] = size;
    }
  }
  return layout;
}

/** Fit preferred weights to the viewport while keeping every visible pane usable. */
export function fitPanelSizes(sizes: Record<string, number>, panels: PanelMinimum[], available: number): Record<string, number> {
  if (!panels.length || !Number.isFinite(available) || available <= 0) return {};
  const result: Record<string, number> = {};
  const minimumTotal = panels.reduce((sum, p) => sum + p.minimum, 0);
  const scale = Math.min(1, available / Math.max(1, minimumTotal));
  let remaining = [...panels], space = available;
  while (remaining.length) {
    const weight = remaining.reduce((sum, p) => sum + (sizes[p.id] ?? 1), 0);
    const tooSmall = remaining.filter(p => space * (sizes[p.id] ?? 1) / weight < p.minimum * scale - .001);
    if (!tooSmall.length) {
      for (const p of remaining) result[p.id] = space * (sizes[p.id] ?? 1) / weight;
      break;
    }
    for (const p of tooSmall) { result[p.id] = p.minimum * scale; space -= result[p.id]!; }
    remaining = remaining.filter(p => !tooSmall.includes(p));
  }
  return result;
}
export function resizePanelPair(sizes: Record<string, number>, panels: PanelMinimum[], first: string, second: string, delta: number, available: number): Record<string, number> {
  if (!Number.isFinite(delta) || !Number.isFinite(available) || available <= 0 || first === second) return sizes;
  const left = panels.find(p => p.id === first), right = panels.find(p => p.id === second);
  if (!left || !right) return sizes;
  const pixels = fitPanelSizes(sizes, panels, available);
  const pair = pixels[first]! + pixels[second]!;
  const minimumTotal = panels.reduce((sum, p) => sum + p.minimum, 0);
  const scale = Math.min(1, available / Math.max(1, minimumTotal));
  const next = Math.min(pair - right.minimum * scale, Math.max(left.minimum * scale, pixels[first]! + delta));
  pixels[first] = next; pixels[second] = pair - next;
  const totalWeight = panels.reduce((sum, p) => sum + (sizes[p.id] ?? 1), 0);
  return { ...sizes, ...Object.fromEntries(panels.map(p => [p.id, pixels[p.id]! / available * totalWeight])) };
}
