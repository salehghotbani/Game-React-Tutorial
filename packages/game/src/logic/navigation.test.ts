import { describe, expect, it } from 'vitest';
import { getRoomColliders, PLAYER_CONFIG, ROOM_SPOTS } from '../config';
import { findWalkingPath } from './navigation';

describe('walking to room objects',()=>{
  it('returns from the house rooms and courtyard to the learning desk', () => {
    for (const start of [{ x: -7, z: 2.5 }, { x: 0, z: 8.5 }, { x: -2, z: -7 }, { x: 1.4, z: -9 }]) {
      const path = findWalkingPath(start, ROOM_SPOTS.computer.approach);
      expect(path.length, JSON.stringify(start)).toBeGreaterThan(0);
      expect(path.at(-1)!.x).toBeCloseTo(ROOM_SPOTS.computer.approach.x, 1);
    }
  });
  it('finds reachable approaches around furniture, including the unlocked arcade',()=>{
    for(const id of ['computer','books','sofa','plant','television','key','door','arcade','yard','kitchen','quietRoom'] as const) {
      const path=findWalkingPath({x:PLAYER_CONFIG.spawn[0],z:PLAYER_CONFIG.spawn[2]},ROOM_SPOTS[id].approach,false,true);
      expect(path.length,id).toBeGreaterThan(0);
      for(const p of path)for(const c of getRoomColliders(false,true).filter(c=>!c.id.endsWith('floor') && !c.id.endsWith('ceiling')))expect(Math.abs(p.x-c.position[0])<c.halfExtents[0]+.35&&Math.abs(p.z-c.position[2])<c.halfExtents[2]+.35,`${id} / ${c.id}`).toBe(false);
    }
  });
  it('cannot navigate through a locked door; opening creates a continuous physical route',()=>{
    expect(findWalkingPath({x:0,z:2.2},ROOM_SPOTS.greenhouse.approach)).toEqual([]);
    const path=findWalkingPath({x:0,z:2.2},ROOM_SPOTS.greenhouse.approach,true,true);
    expect(path.some(p=>p.x>5.3)).toBe(true);
    expect(path.at(-1)!.x).toBeCloseTo(7.2,1);
  });
});
