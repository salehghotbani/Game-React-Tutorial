import { getChallenge, getTeachingLesson } from '@react-quest/challenges';
import type { RoomLife } from '@react-quest/shared';

export const emptyRoomLife: RoomLife = {wateredLessons:[], keyCollected:false, greenhouseOpen:false, bookPages:{}};
export const roomMilestones = [
  {count:1, label:'آبیاری و اولین شکوفه', detail:'یک تمرین کامل → یک قطرهٔ دانش'},
  {count:2, label:'سینمای React', detail:'روی صندلی بنشین و آموزش ببین'},
  {count:3, label:'کلید گلخانه', detail:'کلید را از کنار میز بردار و در را باز کن'}
];
export function getRoomRewards(completed: string[], life: RoomLife) {
  const ids = [...new Set(completed.filter(id => !!getChallenge(id)))];
  return {drops:ids.filter(id => !life.wateredLessons.includes(id)).length, blooms:life.wateredLessons.filter(id => ids.includes(id)).length, television:ids.length>=2, keyEarned:ids.length>=3, cards:ids.length};
}
export function restoreRoomLife(value: unknown, completed: string[]): RoomLife {
  const life = structuredClone(emptyRoomLife);
  if (!value || typeof value !== 'object') return life;
  const data = value as Record<string, unknown>;
  if (Array.isArray(data.wateredLessons)) life.wateredLessons=completed.filter(id=>data.wateredLessons instanceof Array && data.wateredLessons.includes(id));
  life.keyCollected = completed.length>=3 && data.keyCollected===true;
  life.greenhouseOpen = life.keyCollected && data.greenhouseOpen===true;
  if(data.bookPages && typeof data.bookPages==='object') for(const [id,page] of Object.entries(data.bookPages)) {
    const challenge=getChallenge(id);
    if(challenge && (id==='hello-react'||completed.includes(id)) && typeof page==='number' && Number.isInteger(page) && page>=0) life.bookPages[id]=Math.min(page,getTeachingLesson(challenge).steps.length-1);
  }
  return life;
}
