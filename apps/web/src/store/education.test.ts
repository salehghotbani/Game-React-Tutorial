import { describe, expect, it } from 'vitest';
import { challenges, getChallenge } from '@react-quest/challenges';
import { answerQuestion, completeChallenge, progressSlice, revealHint, revealSolution, saveDraft, saveProjectStorage, selectChallenge, visitRoom } from './progressSlice';
import { dailyChallenge, dayKey, dueChallenges, emptyProgress, getProgressTotals, getSkillStatus, getStreak, isRoomAvailable, restoreProgress } from './progression';
import { learn } from './progressTestHelpers';
const result = (id:string) => ({passed:true,score:100,tests:getChallenge(id)!.tests.map(t=>({id:t.id,name:t.name,passed:true}))});
const accessible = (id:string) => restoreProgress({version:1,completedLessons:challenges.filter(c=>c.id!==id).map(c=>c.id)});
function finish(state:typeof emptyProgress,id:string,options:{at?:number;daily?:boolean}={}) {
  state = learn(state, id);
  const c=getChallenge(id)!;
  return progressSlice.reducer(state,completeChallenge({id,source:state.drafts[id]??c.starterFiles['src/App.jsx']!,result:result(id),answers:state.answers[id]??{},...options}));
}
describe('mastery, guidance, migration and learning recommendations',()=>{
 it('migrates old progress without incorrectly granting mastery',()=>{
  const state=accessible('js-immutable');
  expect(getProgressTotals(state).xp).toBeGreaterThan(1000);
  expect(getSkillStatus(state,'components')).toBe('practiced');
  expect(isRoomAvailable(state,'workshop')).toBe(true);
  expect(state.receipts['components-mastery']?.mastery).toBe(false);
 });
 it('persists assistance and reduced reward across reopening and reload',()=>{
  let state=progressSlice.reducer(emptyProgress,revealHint('hello-react'));
  state=progressSlice.reducer(state,revealHint('hello-react'));
  state=restoreProgress({version:2,...state});
  state=finish(state,'hello-react');
  expect(getProgressTotals(state).xp).toBe(150);
  expect(finish(state,'hello-react').receipts).toEqual(state.receipts);
  let solution=progressSlice.reducer(emptyProgress,revealSolution('hello-react'));
  solution=finish(solution,'hello-react');
  expect(getProgressTotals(solution).xp).toBe(60);
 });
 it('keeps mastery earned while rooms remain freely accessible',()=>{
  let state=accessible('components-mastery');
  state=progressSlice.reducer(state,revealHint('components-mastery'));
  state=progressSlice.reducer(state,revealSolution('components-mastery'));
  expect(state.assistance['components-mastery']).toBeUndefined();
  expect(progressSlice.reducer(state,visitRoom('workshop')).selectedRoom).toBe('workshop');
  expect(getSkillStatus(state,'components')).toBe('practiced');
  state=finish(state,'components-mastery');
  expect(getSkillStatus(state,'components')).toBe('mastered');
  expect(progressSlice.reducer(state,visitRoom('workshop')).selectedRoom).toBe('workshop');
  expect(getSkillStatus(restoreProgress({version:2,...state}),'props')).toBe('mastered');
 });
 it('carries the learner project draft to the next mission without overwriting a saved draft',()=>{
  let state=accessible('todo-render');
  state=progressSlice.reducer(state,saveDraft({id:'todo-item',code:'// My own project\nexport default function App(){return <p>mine</p>}'}));
  state=progressSlice.reducer(state,selectChallenge('todo-render'));
  expect(state.drafts['todo-render']).toBe(state.drafts['todo-item']);
  state=progressSlice.reducer(state,saveDraft({id:'todo-render',code:'edited'}));
  expect(progressSlice.reducer(state,selectChallenge('todo-render')).drafts['todo-render']).toBe('edited');
 });
 it('saves a reopened creation independently of the currently selected lesson without changing progress',()=>{
  let state=progressSlice.reducer(emptyProgress,saveDraft({id:'build-board',code:'export default function App(){return <main>My board</main>}'}));
  state=progressSlice.reducer(state,selectChallenge('build-budget'));
  const reopened=progressSlice.reducer(state,saveProjectStorage({id:'board',values:{board:'[{"title":"Saved creation"}]'}}));
  expect(reopened.projectStorage.board).toEqual({board:'[{"title":"Saved creation"}]'});
  expect(reopened.selectedChallengeId).toBe('build-budget');
  expect(reopened.completedLessons).toEqual([]);
  expect(getProgressTotals(reopened).xp).toBe(0);
  expect(progressSlice.reducer(reopened,saveProjectStorage({id:'unknown-project',values:{bad:'value'}}))).toEqual(reopened);
 });
 it('rejects a stale quiz answer even when the earlier answer was right',()=>{
  let state=progressSlice.reducer(learn(emptyProgress,'js-map'),answerQuestion({id:'js-map',question:'map',answer:1}));
  state=progressSlice.reducer(state,answerQuestion({id:'js-map',question:'map',answer:0}));
  const c=getChallenge('js-map')!;
  const next=progressSlice.reducer(state,completeChallenge({id:c.id,source:c.starterFiles['src/App.jsx']!,result:result(c.id),answers:{map:1}}));
  expect(next.completedLessons).not.toContain(c.id);
 });
 it('awards daily bonus once and reviews practiced skills after three days',()=>{
  const at=Date.now(), c=dailyChallenge(emptyProgress,at);
  let state=structuredClone(emptyProgress);
  for(const q of c.questions??[]) state=progressSlice.reducer(state,answerQuestion({id:c.id,question:q.id,answer:q.answer}));
  state=finish(state,c.id,{at,daily:true});
  expect(state.dailyDays).toEqual([dayKey(at)]);
  const xp=getProgressTotals(state).xp;
  expect(getProgressTotals(finish(state,c.id,{at,daily:true})).xp).toBe(xp);
  expect(getStreak(state,at)).toBe(1);
  expect(dueChallenges(state,at+4*86400000).map(c=>c.id)).toContain(c.id);
  expect(getSkillStatus(state,c.skills![0]!)).toBe('practiced');
 });
});
