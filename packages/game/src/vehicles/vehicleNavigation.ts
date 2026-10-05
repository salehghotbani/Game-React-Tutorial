import { findWalkingPath } from '../logic/navigation';
import type { WorldPoint } from '../world/layout';
import { exitCandidates, vehicleObstacle, type VehicleState } from './driving';

export function findCarApproach(start: WorldPoint, state: VehicleState, greenhouseOpen: boolean, arcadeUnlocked: boolean): WorldPoint | undefined {
  const candidates = exitCandidates(state).filter(point => Math.hypot(point.x - state.x, point.z - state.z) < 2)
    .sort((a, b) => Math.hypot(a.x - start.x, a.z - start.z) - Math.hypot(b.x - start.x, b.z - start.z));
  return candidates.find(point => findWalkingPath(start, point, greenhouseOpen, arcadeUnlocked, [vehicleObstacle(state)]).length > 0);
}
