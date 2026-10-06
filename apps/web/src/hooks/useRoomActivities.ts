import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROOM_SPOTS, canUseGameNet, getNearestInteraction, type PlayerPosition, type RoomSpotId } from '@react-quest/game';
import type { InteractionObject } from '@react-quest/shared';
import { useAppDispatch, useAppSelector } from '../store';
import { setDestination, setMode } from '../store/gameSlice';
import { collectRoomKey, openGreenhouse, waterPlant } from '../store/progressSlice';
import { getRoomRewards } from '../store/roomLife';

type Options = { position: PlayerPosition; hubOpen: boolean; xp: number };

export function useRoomActivities({ position, hubOpen, xp }: Options) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.game);
  const progress = useAppSelector(state => state.progress);
  const life = progress.roomLife;
  const rewards = useMemo(() => getRoomRewards(progress.completedLessons, life), [progress.completedLessons, life]);
  const [wateringSpot, setWateringSpot] = useState<'plant' | 'greenhouse'>('plant');
  const [watering, setWatering] = useState(false);
  const [toast, setToast] = useState('');
  const [activeSpot, setActiveSpot] = useState<RoomSpotId>();
  const canInteract = settings.mode === 'explore' && !settings.paused && !hubOpen;
  const arcadeUnlocked = canUseGameNet(xp);

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
  const onNavigate = useCallback((id: RoomSpotId) => {
    if (!canInteract) return;
    setActiveSpot(id);
    dispatch(setDestination(ROOM_SPOTS[id].approach));
  }, [canInteract, dispatch]);
  const onTravelEnd = useCallback(() => dispatch(setDestination(undefined)), [dispatch]);

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
    ...(arcadeUnlocked ? [{ id: 'arcade', position: ROOM_SPOTS.arcade.position, interactionRadius: 1.75, label: 'بازی Bug Hunter', onInteract: () => dispatch(setMode('arcade')) }] : []),
    ...(life.greenhouseOpen ? [{ id: 'greenhouse', position: ROOM_SPOTS.greenhouse.position, interactionRadius: 1.65, label: 'آبیاری باغچهٔ گلخانه', onInteract: () => water('greenhouse') }] : []),
  ], [dispatch, watering, water, rewards.television, rewards.keyEarned, life.keyCollected, life.greenhouseOpen, onNavigate, arcadeUnlocked]);

  return {
    life, rewards, watering, wateringSpot, toast, setToast, activeSpot,
    onNavigate, onTravelEnd, arcadeUnlocked,
    nearest: getNearestInteraction(position, objects)
  };
}
