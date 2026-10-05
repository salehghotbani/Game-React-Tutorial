import { describe, expect, it } from 'vitest';
import { challenges } from '@react-quest/challenges';
import { emptyProgress, restoreProgress } from './progression';
import { getRoomRewards } from './roomLife';
import { progressSlice, waterPlant, collectRoomKey, openGreenhouse, bookmarkRoomBook, completeChallenge, saveDraft } from './progressSlice';
import { learn } from './progressTestHelpers';

describe('room activities are earned by completing exercises',()=>{
  it('awards one drop per successful exercise, never for reading, failing or repeating',()=>{
    let state=learn(structuredClone(emptyProgress),'hello-react');
    const c=challenges[0]!;
    expect(getRoomRewards(state.completedLessons,state.roomLife).drops).toBe(0);
    state=progressSlice.reducer(state,saveDraft({id:c.id,code:c.solution!}));
    const result={passed:true,score:100,tests:c.tests.map(t=>({id:t.id,name:t.name,passed:true}))};
    const award=completeChallenge({id:c.id,source:c.solution!,result});
    state=progressSlice.reducer(state,award);state=progressSlice.reducer(state,award);
    expect(getRoomRewards(state.completedLessons,state.roomLife)).toMatchObject({drops:1,cards:1,television:false,keyEarned:false});
    state=progressSlice.reducer(state,waterPlant());state=progressSlice.reducer(state,waterPlant());
    expect(state.roomLife.wateredLessons).toEqual([c.id]);
    expect(getRoomRewards(state.completedLessons,state.roomLife)).toMatchObject({drops:0,blooms:1});
  });
  it('requires earning, collecting and using the key, in that order',()=>{
    const initial=structuredClone(emptyProgress);
    expect(progressSlice.reducer(initial,collectRoomKey()).roomLife.keyCollected).toBe(false);
    const earned=restoreProgress({version:3,completedLessons:challenges.slice(0,3).map(c=>c.id)});
    expect(getRoomRewards(earned.completedLessons,earned.roomLife).television).toBe(true);
    expect(progressSlice.reducer(earned,openGreenhouse()).roomLife.greenhouseOpen).toBe(false);
    const collected=progressSlice.reducer(earned,collectRoomKey());
    expect(progressSlice.reducer(collected,openGreenhouse()).roomLife.greenhouseOpen).toBe(true);
  });
  it('restores earned room changes and validates bookmarks without trusting forged progress',()=>{
    const completed=challenges.slice(0,3).map(c=>c.id);
    const restored=restoreProgress({version:3,completedLessons:completed,roomLife:{wateredLessons:[...completed,'unknown','state-counter',completed[0]],keyCollected:true,greenhouseOpen:true,bookPages:{'hello-react':99,'state-counter':2,unknown:1}}});
    expect(restored.roomLife.wateredLessons).toEqual(completed);
    expect(restored.roomLife.greenhouseOpen).toBe(true);
    expect(restored.roomLife.bookPages).not.toHaveProperty('state-counter');
    expect(restoreProgress({version:3,roomLife:restored.roomLife}).roomLife).toMatchObject({wateredLessons:[],keyCollected:false,greenhouseOpen:false});
    expect(progressSlice.reducer(restored,bookmarkRoomBook({id:'hello-react',page:1})).roomLife.bookPages['hello-react']).toBe(1);
    expect(progressSlice.reducer(restored,bookmarkRoomBook({id:'state-counter',page:1})).roomLife.bookPages).toEqual(restored.roomLife.bookPages);
  });
  it('every curriculum completion adds a usable room reward independent of hint-adjusted XP',()=>{
    const state=restoreProgress({version:1,completedLessons:challenges.map(c=>c.id)});
    expect(getRoomRewards(state.completedLessons,state.roomLife).drops).toBe(challenges.length);
    let grown=state;for(let i=0;i<state.completedLessons.length;i++)grown=progressSlice.reducer(grown,waterPlant());
    expect(getRoomRewards(grown.completedLessons,grown.roomLife)).toMatchObject({drops:0,blooms:challenges.length,cards:challenges.length});
  });
});
