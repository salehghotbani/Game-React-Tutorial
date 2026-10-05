import { expect, test, type Page } from '@playwright/test';
import { challenges } from '../../packages/challenges/src/index';
import { finishLesson } from './teachingHelpers';

async function openLearning(page:Page) {
 await page.goto('/');
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).click();
 await page.locator('.chapter-card').filter({has:page.getByRole('heading',{name:'پایه‌های React',exact:true})}).getByRole('button',{name:'درس و تمرین ←',exact:true}).click();
 await expect(page.getByRole('region',{name:'محیط آموزش React'})).toBeVisible({timeout:30000});
 await finishLesson(page);
}
async function write(page:Page,code:string){
 const editor=page.getByRole('textbox',{name:'ویرایشگر کد React'});await editor.focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText(code);
}
async function choose(page:Page,id:string){
 await page.getByLabel('فصل آموزشی').selectOption('all');
 await page.locator(`[data-challenge="${id}"]`).click();
 await finishLesson(page);
 await expect(page.locator('.challenge-heading h1')).toHaveText(challenges.find(c=>c.id===id)!.title);
}

test('all curriculum reference solutions pass actual React behavior, questions and source checks',async({page})=>{
 test.setTimeout(600000);
 test.info().annotations.push({type:'coverage',description:challenges.length+' complete curriculum solutions'});
 await page.addInitScript(ids=>localStorage.setItem('react-quest-progress-v1',JSON.stringify({version:1,completedLessons:ids,selectedChallengeId:'hello-react'})),challenges.map(c=>c.id));
 await openLearning(page);
 const failures:string[]=[];
 const only=process.env.CURRICULUM_IDS?.split(',');
 for(const c of challenges.filter(c=>!only||only.includes(c.id))){
  await choose(page,c.id);
  if(!c.tests.every(t=>t.questionId)) await write(page,c.solution!);
  for(let i=0;i<(c.questions?.length??0);i++) await page.locator('.knowledge-questions fieldset').nth(i).getByRole('radio').nth(c.questions![i]!.answer).check();
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
  await expect(page.getByRole('button',{name:'ارسال پاسخ',exact:true})).toBeEnabled({timeout:30000});
  const result=page.locator('.evaluation-result');
  if(!await result.count() || !await result.evaluate(el=>el.classList.contains('passed'))) failures.push(`${c.id}: ${await result.count()?await result.innerText():await page.locator('.runtime-status').innerText()}`);
  console.info(`[curriculum] ${c.id}: ${failures.at(-1)?.startsWith(c.id+':')?'FAILED':'PASS'}`);
 }
 expect(failures).toEqual([]);
 await page.screenshot({path:'artifacts/react-quest-final-project.png'});
});

test('guidance persists, reduces XP, and quiz feedback unlocks a fresh assessment',async({page})=>{
 await openLearning(page);
 // Start recommendation may be the JavaScript quiz; select the original first code mission.
 await choose(page,'hello-react');
 await page.getByRole('button',{name:/راهنمایی مرحله‌ای/}).click();
 await write(page,challenges.find(c=>c.id==='hello-react')!.solution!);
 await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
 await expect(page.getByTestId('total-xp')).toHaveText('180',{timeout:30000});
 await page.getByRole('button',{name:'بازگشت به اتاق',exact:true}).click();
 await page.reload();
 await openLearning(page);await choose(page,'hello-react');
 await expect(page.locator('.hint-box button span')).toHaveText('1/4');
 await choose(page,'js-map');
 await page.getByRole('radio').nth(0).check();await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
 await expect(page.getByText('یک قدم تا موفقیت',{exact:true})).toBeVisible();
 await expect(page.getByTestId('total-xp')).toHaveText('180');
 await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
 await expect(page.getByTestId('total-xp')).toHaveText('240');
 await choose(page,'js-immutable');
 await expect(page.getByRole('button',{name:/راهنمایی مرحله‌ای/})).toBeDisabled();
 await write(page,challenges.find(c=>c.id==='js-immutable')!.solution!);await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
 await expect(page.getByText('تسلط ثبت شد!',{exact:true})).toBeVisible({timeout:30000});
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).last().click();
 await expect(page.locator('.skill-card.mastered').filter({hasText:'JavaScript'})).toBeVisible();
 await page.screenshot({path:'artifacts/react-quest-knowledge-map.png'});
});

test('a fresh mastery unlocks a real themed room; component traces follow actual interactions',async({page})=>{
 await page.addInitScript(ids=>localStorage.setItem('react-quest-progress-v1',JSON.stringify({version:1,completedLessons:ids,selectedChallengeId:'components-mastery'})),challenges.filter(c=>c.id!=='components-mastery').map(c=>c.id));
 await openLearning(page);await choose(page,'components-mastery');
 await write(page,challenges.find(c=>c.id==='components-mastery')!.solution!);await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
 await expect(page.getByText('تسلط ثبت شد!',{exact:true})).toBeVisible({timeout:30000});
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).last().click();await page.getByRole('button',{name:'اتاق‌های دانش',exact:true}).click();
 await page.locator('.knowledge-room').filter({hasText:'کارگاه کامپوننت'}).getByRole('button',{name:'ورود به اتاق ←',exact:true}).click();
 await expect(page.locator('.location strong')).toHaveText('کارگاه کامپوننت');
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).click();await page.locator('.chapter-card').filter({has:page.getByRole('heading',{name:'پایه‌های React',exact:true})}).getByRole('button',{name:'درس و تمرین ←',exact:true}).click();await choose(page,'state-counter');
 await write(page,challenges.find(c=>c.id==='state-counter')!.solution!);await page.getByRole('button',{name:'اجرای کد'}).click();
 const frame=page.frameLocator('iframe[title="پیش‌نمایش React"]');await expect(frame.locator('output')).toHaveText('0');
 await frame.getByRole('button',{name:'+1',exact:true}).click();await expect(frame.locator('output')).toHaveText('1');
 await expect(page.locator('.trace-events')).toContainText('state');
 await page.getByRole('button',{name:'درخت و Props',exact:true}).click();await expect(page.locator('.component-nodes')).toContainText('App');
 await page.screenshot({path:'artifacts/react-quest-render-inspector.png'});
});



test('daily assignment survives reload, pays once, and the learning hub fits mobile',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).click();
 await page.getByRole('button',{name:'تمرین امروز ←',exact:true}).click();
 await expect(page.getByRole('region',{name:'محیط آموزش React'})).toBeVisible({timeout:30000});
 const teaching=page.locator('.teaching-screen');
 const id=await teaching.count()?await teaching.getAttribute('data-lesson'):await page.locator('.lesson-nav.selected').getAttribute('data-challenge');const c=challenges.find(c=>c.id===id)!;
 await page.reload();await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).click();await page.getByRole('button',{name:'تمرین امروز ←',exact:true}).click();
 await finishLesson(page);
 await expect(page.locator('.challenge-heading h1')).toHaveText(c.title);
 if(!c.tests.every(t=>t.questionId))await write(page,c.solution!);
 for(let i=0;i<(c.questions?.length??0);i++)await page.locator('.knowledge-questions fieldset').nth(i).getByRole('radio').nth(c.questions![i]!.answer).check();
 await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();await expect(page.getByTestId('total-xp')).toHaveText(String(c.xp+20),{timeout:30000});
 await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();await expect(page.getByRole('button',{name:'ارسال پاسخ',exact:true})).toBeEnabled();await expect(page.getByTestId('total-xp')).toHaveText(String(c.xp+20));
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).last().click();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 const hub=page.getByRole('region',{name:'مرکز یادگیری'});expect(await hub.evaluate(el=>el.scrollWidth)).toBe(390);
 await page.screenshot({path:'artifacts/react-quest-learning-hub-mobile.png'});
 await page.getByRole('button',{name:'پروژه‌های واقعی',exact:true}).click();await expect(page.locator('.project-card').first()).toBeVisible();
 await page.screenshot({path:'artifacts/react-quest-projects-mobile.png'});
});

test('project missions carry the learner draft; library browsing alone does not mark a skill learned',async({page})=>{
 await page.addInitScript(ids=>localStorage.setItem('react-quest-progress-v1',JSON.stringify({version:1,completedLessons:ids})),challenges.slice(0,5).map(c=>c.id));
 await openLearning(page);await choose(page,'todo-item');
 const own=challenges.find(c=>c.id==='todo-item')!.solution!+'\n// This is my project draft';await write(page,own);
 await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();await expect(page.getByText('مأموریت انجام شد!',{exact:true})).toBeVisible({timeout:30000});
 const actualDraft=await page.evaluate(()=>JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['todo-item']);
 expect(actualDraft).toContain('// This is my project draft');
 await page.getByRole('button',{name:'مأموریت بعدی: Todo ۲: نمایش لیست ←',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['todo-render'])).toBe(actualDraft);
 await page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).last().click();await page.getByRole('button',{name:'کتابخانه',exact:true}).click();
 await page.locator('.library-layout nav').getByRole('button',{name:'0. پیش‌نیازهای JavaScript',exact:true}).click();
 await expect(page.getByRole('heading',{name:'متغیر، شیء و آرایه یعنی چه؟',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'نقشهٔ دانش',exact:true}).click();await expect(page.locator('.skill-card.new').filter({hasText:'JavaScript'})).toBeVisible();
 await page.screenshot({path:'artifacts/react-quest-project-learning.png'});
});

test('mobile neighborhood keeps the canvas full screen with compact learning access',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({timeout:30000});
 await expect(page.locator('.journey-card,.world-learning-card,.topbar')).toHaveCount(0);
 const canvas=(await page.locator('canvas').boundingBox())!;
 expect(canvas.y).toBe(0);expect(canvas.height).toBe(844);
 await expect(page.getByRole('button',{name:'نقشهٔ دانش ↗',exact:true})).toBeVisible();
 await page.screenshot({path:'artifacts/react-quest-education-room-mobile.png'});
});
