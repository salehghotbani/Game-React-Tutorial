import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GAME_NET, CAR, canDrive, findCarApproach, NEIGHBORS, ROOM_SPOTS, canUseGameNet, getNearestInteraction, type NeighborId, type PlayerPosition, type RoomSpotId, type VehicleState } from '@react-quest/game';
import type { InteractionObject } from '@react-quest/shared';
import { useAppDispatch, useAppSelector } from '../store';
import { setDestination, setMode, startDriving } from '../store/gameSlice';
import { collectRoomKey, openGreenhouse, waterPlant } from '../store/progressSlice';
import { getRoomRewards } from '../store/roomLife';

type NeighborSpeech = { id: NeighborId; text: string };
type Options = { position: PlayerPosition; vehicle: VehicleState; hubOpen: boolean; xp: number };

export function useRoomActivities({ position, vehicle, hubOpen, xp }: Options) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.game);
  const progress = useAppSelector(state => state.progress);
  const life = progress.roomLife;
  const rewards = useMemo(() => getRoomRewards(progress.completedLessons, life), [progress.completedLessons, life]);
  const [wateringSpot, setWateringSpot] = useState<'plant' | 'greenhouse'>('plant');
  const [watering, setWatering] = useState(false);
  const [toast, setToast] = useState('');
  const [activeSpot, setActiveSpot] = useState<RoomSpotId>();
  const [speech, setSpeech] = useState<NeighborSpeech>();
  const neighborVisits = useRef(new Map<NeighborId, { at: number; count: number }>());
  const latestPosition = useRef(position);
  const latestVehicle = useRef(vehicle);
  const canInteract = settings.mode === 'explore' && !settings.paused && !hubOpen;
  const arcadeUnlocked = canUseGameNet(xp);
  useEffect(() => { latestPosition.current = position; }, [position]);
  useEffect(() => { latestVehicle.current = vehicle; }, [vehicle]);

  useEffect(() => {
    if (!watering) return;
    const timer = setTimeout(() => setWatering(false), 2200);
    return () => clearTimeout(timer);
  }, [watering]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 6500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!speech) return;
    const timer = setTimeout(() => setSpeech(undefined), 4000);
    return () => clearTimeout(timer);
  }, [speech]);

  const onNavigate = useCallback((id: RoomSpotId) => {
    if (!canInteract) return;
    setActiveSpot(id);
    const destination = id === 'car' ? findCarApproach(latestPosition.current, latestVehicle.current, life.greenhouseOpen, arcadeUnlocked) : ROOM_SPOTS[id].approach;
    if (!destination) { setToast('مسیر ماشین بسته است؛ از سمت دیگری نزدیک شو.'); return; }
    dispatch(setDestination(destination));
  }, [canInteract, dispatch, life.greenhouseOpen, arcadeUnlocked]);
  const onTravelEnd = useCallback(() => dispatch(setDestination(undefined)), [dispatch]);
  const speak = useCallback((id: NeighborId) => {
    const person = NEIGHBORS.find(neighbor => neighbor.id === id)!;
    const previous = neighborVisits.current.get(id);
    const count = previous?.count ?? 0;
    neighborVisits.current.set(id, { at: performance.now(), count: count + 1 });
    setSpeech({ id, text: person.phrases[count % person.phrases.length]! });
  }, []);
  const onTalk = useCallback((id: NeighborId) => {
    if (!canInteract) return;
    const person = NEIGHBORS.find(neighbor => neighbor.id === id)!;
    const current = latestPosition.current;
    if (Math.hypot(current.x - person.position[0], current.z - person.position[2]) <= 2.2) speak(id);
    else dispatch(setDestination({ x: person.position[0], z: person.position[2] + 1.2 }));
  }, [canInteract, speak, dispatch]);

  useEffect(() => {
    if (!canInteract || speech) return;
    const neighbor = NEIGHBORS.find(person => Math.hypot(position.x - person.position[0], position.z - person.position[2]) < 2 && performance.now() - (neighborVisits.current.get(person.id)?.at ?? -Infinity) > 15000);
    if (neighbor) speak(neighbor.id);
  }, [canInteract, position.x, position.z, speech, speak]);

  const water = useCallback((spot: 'plant' | 'greenhouse') => {
    if (watering) return;
    if (!rewards.drops) {
      setToast('هر تمرین را با تمام تست‌های موفق کامل کن تا یک قطرهٔ دانش بگیری.');
      return;
    }
    dispatch(waterPlant());
    setWateringSpot(spot);
    setWatering(true);
    setToast('یک قطرهٔ دانش مصرف شد؛ باغچه‌ات رشد کرد و شکوفه زد.');
  }, [dispatch, rewards.drops, watering]);

  const objects = useMemo<InteractionObject[]>(() => [
    { id: 'car', position: [vehicle.x, 0, vehicle.z], interactionRadius: 2.3, label: canDrive(xp) ? 'سوار شدن و رانندگی' : 'ماشین · ۲۰۰۰ XP', onInteract: () => canDrive(xp) ? dispatch(startDriving(xp)) : setToast(`برای رانندگی ${CAR.requiredXp} XP لازم داری؛ ${Math.max(0, CAR.requiredXp - xp)} XP دیگر یاد بگیر.`) },
    { id: 'computer', position: ROOM_SPOTS.computer.position, interactionRadius: 1.6, label: 'استفاده از کامپیوتر', onInteract: () => dispatch(setMode('enteringComputer')) },
    { id: 'books', position: ROOM_SPOTS.books.position, interactionRadius: 1.65, label: 'ورق زدن کتاب‌های React', onInteract: () => dispatch(setMode('reading')) },
    { id: 'sofa', position: ROOM_SPOTS.sofa.position, interactionRadius: 1.65, label: 'نشستن روی مبل و خواندن React', onInteract: () => dispatch(setMode('enteringReading')) },
    { id: 'plant', position: ROOM_SPOTS.plant.position, interactionRadius: 1.5, label: watering ? 'گل‌ها در حال شکفتن‌اند…' : 'آب دادن به گل‌ها', onInteract: () => water('plant') },
    { id: 'television', position: ROOM_SPOTS.television.position, interactionRadius: 1.65, label: 'نشستن و تماشای آموزش React', onInteract: () => rewards.television ? dispatch(setMode('enteringTV')) : setToast('با کامل کردن ۲ تمرین، سینمای React باز می‌شود.') },
    { id: 'key', position: ROOM_SPOTS.key.position, interactionRadius: 1.45, label: 'برداشتن کلید گلخانه', onInteract: () => {
      if (life.keyCollected) setToast('کلید را داری؛ حالا به درِ گلخانه برو.');
      else if (rewards.keyEarned) { dispatch(collectRoomKey()); setToast('کلید گلخانه به کوله‌پشتی اضافه شد.'); }
      else setToast('با کامل کردن ۳ تمرین، کلید روی میز ظاهر می‌شود.');
    } },
    { id: 'door', position: ROOM_SPOTS.door.position, interactionRadius: 1.6, label: life.greenhouseOpen ? 'ورود به گلخانه' : 'باز کردن قفل گلخانه', onInteract: () => {
      if (life.greenhouseOpen) onNavigate('greenhouse');
      else if (life.keyCollected) { dispatch(openGreenhouse()); setToast('قفل باز شد! از در عبور کن و گلخانه را بگرد.'); }
      else setToast(rewards.keyEarned ? 'کلید آماده است؛ اول آن را از میز بردار.' : 'برای گرفتن کلید، ۳ تمرین را کامل کن.');
    } },
    { id: 'gameNet', position: ROOM_SPOTS.gameNet.position, interactionRadius: 1.9, label: 'شروع نوبت گیم‌نت', onInteract: () => arcadeUnlocked ? dispatch(setMode('gameNet')) : setToast(`برای بازی در گیم‌نت ${GAME_NET.requiredXp} XP لازم داری؛ ${Math.max(0, GAME_NET.requiredXp - xp)} XP دیگر یاد بگیر.`) },
    ...(arcadeUnlocked ? [{ id: 'arcade', position: ROOM_SPOTS.arcade.position, interactionRadius: 1.75, label: 'بازی Bug Hunter', onInteract: () => dispatch(setMode('arcade')) }] : []),
    ...(life.greenhouseOpen ? [{ id: 'greenhouse', position: ROOM_SPOTS.greenhouse.position, interactionRadius: 1.65, label: 'آبیاری باغچهٔ گلخانه', onInteract: () => water('greenhouse') }] : []),
    ...NEIGHBORS.map(person => ({ id: person.id, position: [...person.position] as [number, number, number], interactionRadius: 2.2, label: `گفتگو با ${person.name}`, onInteract: () => speak(person.id) }))
  ], [dispatch, watering, water, rewards.television, rewards.keyEarned, life.keyCollected, life.greenhouseOpen, onNavigate, arcadeUnlocked, xp, speak, vehicle.x, vehicle.z]);

  return {
    life, rewards, watering, wateringSpot, toast, setToast, activeSpot, speech,
    onTalk, onNavigate, onTravelEnd, arcadeUnlocked,
    nearest: getNearestInteraction(position, objects)
  };
}
