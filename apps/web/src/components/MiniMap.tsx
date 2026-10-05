import { tx, useLanguage } from '@react-quest/localization';
import { NEIGHBORS, type PlayerPosition } from '@react-quest/game';

export function MiniMap({ position, greenhouseOpen = false }: { position: PlayerPosition; greenhouseOpen?: boolean }) {
  useLanguage();
  const mapX = (x: number) => 10 + (x + 21) * 4.5;
  const mapY = (z: number) => 10 + (z + 13) * 4.5;
  return <section className="minimap neighborhood-map" aria-label={tx("نقشهٔ محله")}>
    <svg viewBox="0 0 209 200" className="map-svg" role="img" aria-label={tx("موقعیت بازیکن در محله")}>
      <rect x="2" y="2" width="205" height="196" rx="14" fill="#f6f4e8" />
      <rect x="10" y={mapY(12)} width="189" height="31.5" rx="3" fill="#a4afb0" />
      <rect x={mapX(-10)} y={mapY(-12)} width="68" height="76.5" fill="#d9cdb5" stroke="#a9b49e" />
      <rect x={mapX(-10)} y={mapY(5)} width="90" height="31.5" fill="#aec39c" />
      <rect x={mapX(-19.5)} y={mapY(4)} width="40.5" height="31.5" fill="#719aa4" />
      <text x={mapX(-15)} y={mapY(8)} fontSize="7" textAnchor="middle" fill="#f5f4e7">PLAY</text>
      <text x={mapX(0)} y={mapY(-6)} fontSize="7" textAnchor="middle" fill="#748776">HOME</text>
      {greenhouseOpen && <rect x={mapX(5)} y={mapY(-3)} width="22.5" height="27" fill="#bdd2b0" stroke="#87a77c" />}
      {[-14, -3, 9].map(x => <rect key={x} x={mapX(x - 4)} y={mapY(20)} width="36" height="27" rx="2" fill="#c8b292" />)}
      {NEIGHBORS.map(person => <circle key={person.id} cx={mapX(person.position[0])} cy={mapY(person.position[2])} r="2.7" fill={person.color} />)}
      <g data-testid="player-marker" data-player-x={position.x.toFixed(3)} data-player-z={position.z.toFixed(3)} data-player-y={position.y?.toFixed(3)} data-camera-yaw={position.cameraYaw?.toFixed(3)} transform={`translate(${mapX(position.x)} ${mapY(position.z)}) rotate(${180 - position.heading * 180 / Math.PI})`}>
        <circle r="7" fill="#477c67" opacity="0.2" /><path d="m0-6 4 8-4-1-4 1Z" fill="#376d5b" stroke="#f8f5ed" strokeWidth="1" />
      </g>
      <text x="105" y="9" fontSize="7" textAnchor="middle" fill="#84957e">N</text>
    </svg>
  </section>;
}
