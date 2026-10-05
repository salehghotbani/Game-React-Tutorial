import { tx, useLanguage } from '@react-quest/localization';
import type { VehicleState } from '@react-quest/game';

export function DrivingHud({ vehicle, onExit }: { vehicle: VehicleState; onExit: () => void }) {
  useLanguage();
  return <section className="driving-hud panel" aria-label={tx('کنترل رانندگی')}>
    <div><b dir="ltr" data-testid="car-speed">{Math.round(Math.abs(vehicle.speed) * 3.6)} <small>km/h</small></b><span>{tx('W/S گاز و عقب · A/D فرمان · Space ترمز')}</span></div>
    <button onClick={onExit}><kbd>E</kbd>{tx('پیاده شدن')}</button>
  </section>;
}
