import { tx, useLanguage } from '@react-quest/localization';
import { FLOOR_AREAS, WORLD_BOUNDS, type PlayerPosition } from '@react-quest/game';

const scale = 164 / (WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ);
const mapX = (x: number) => 35 + (x - WORLD_BOUNDS.minX) * scale;
const mapY = (z: number) => 18 + (z - WORLD_BOUNDS.minZ) * scale;

export function MiniMap({ position, greenhouseOpen = false }: { position: PlayerPosition; greenhouseOpen?: boolean }) {
  useLanguage();
  return <section className="minimap neighborhood-map" aria-label={tx('نقشهٔ خانه')}>
    <svg viewBox="0 0 209 200" className="map-svg" role="img" aria-label={tx('موقعیت بازیکن در خانه')}>
      <defs><clipPath id="world-map-clip"><rect x="10" y="18" width="189" height="164" rx="8" /></clipPath></defs>
      <rect x="2" y="2" width="205" height="196" rx="14" fill="#f6f4e8" />
      <g clipPath="url(#world-map-clip)">
        <rect x="10" y="18" width="189" height="164" fill="#adc299" />
        {FLOOR_AREAS.map(area => <rect key={area.id} x={mapX(area.x - area.width / 2)} y={mapY(area.z - area.depth / 2)} width={area.width * scale} height={area.depth * scale} fill={area.id === 'game-net' ? '#719aa4' : area.id.includes('road') || area.id === 'street' ? '#9aa6a7' : '#d9cdb5'} />)}
        {greenhouseOpen && <rect x={mapX(5)} y={mapY(-3)} width={5 * scale} height={6 * scale} fill="#bdd2b0" stroke="#87a77c" />}
        <g data-testid="player-marker" data-player-x={position.x.toFixed(3)} data-player-z={position.z.toFixed(3)} data-player-y={position.y?.toFixed(3)} data-camera-yaw={position.cameraYaw?.toFixed(3)} transform={`translate(${mapX(position.x)} ${mapY(position.z)}) rotate(${180 - position.heading * 180 / Math.PI})`}>
          <circle r="7" fill="#477c67" opacity="0.2" /><path d="m0-6 4 8-4-1-4 1Z" fill="#376d5b" stroke="#f8f5ed" strokeWidth="1" />
        </g>
      </g>
      <text x="105" y="10" fontSize="7" textAnchor="middle" fill="#84957e">N</text>
    </svg>
  </section>;
}
