import { expect, test, type Page } from '@playwright/test';
import { finishLesson, openComputer } from './teachingHelpers';

async function start(page:Page, practice = true) {
  await page.goto('/');
  await openComputer(page);
  await expect(page.locator('.teaching-screen')).toBeVisible({timeout:30000});
  if (practice) await finishLesson(page);
}
const pane = (page:Page,id:string) => page.locator(`[data-panel="${id}"]`);
async function drag(page:Page,label:string,dx:number,dy=0) {
  const separator = page.getByRole('separator',{name:label,exact:true});
  await separator.scrollIntoViewIfNeeded();
  const box = (await separator.boundingBox())!;
  const x=box.x+box.width/2, y=box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:8});await page.mouse.up();
  await expect(page.locator('.workspace-drag-shield')).toHaveCount(0);
}

test('resizes RTL panes by pointer and keyboard, constrains sizes and persists the layout',async({page})=>{
  await start(page);
  const initial=(await pane(page,'editor').boundingBox())!.width;
  await drag(page,'تغییر اندازهٔ ویرایشگر',-100);
  const resized=(await pane(page,'editor').boundingBox())!.width;
  expect(resized-initial).toBeGreaterThan(85);
  const separator=page.getByRole('separator',{name:'تغییر اندازهٔ ویرایشگر',exact:true});
  await separator.focus();await page.keyboard.press('ArrowRight');
  const keyboard=(await pane(page,'editor').boundingBox())!.width;
  expect(resized-keyboard).toBeGreaterThan(15);
  await page.keyboard.press('End');
  expect((await pane(page,'preview').boundingBox())!.width).toBeGreaterThanOrEqual(240);
  const saved=(await pane(page,'editor').boundingBox())!.width;
  await page.getByRole('button',{name:'بازگشت به اتاق',exact:true}).click();
  await page.reload();await openComputer(page);
  await expect(pane(page,'editor')).toBeVisible({timeout:30000});
  expect((await pane(page,'editor').boundingBox())!.width).toBeCloseTo(saved,0);
  await page.getByRole('button',{name:'بازنشانی چیدمان',exact:true}).click();
  expect((await pane(page,'editor').boundingBox())!.width).toBeCloseTo(initial,0);
  await page.screenshot({path:'artifacts/react-quest-splitter-desktop.png'});
});

test('closing editor/preview retains the draft and live React state; a hidden preview still judges',async({page})=>{
  test.setTimeout(90000);
  await start(page);
  const source='import {useState} from "react"; export default function App(){const[n,setN]=useState(0);return <main><h1>My layout</h1><p>My draft</p><output>{n}</output><button onClick={()=>setN(v=>v+1)}>Add</button></main>}';
  await page.getByRole('textbox',{name:'ویرایشگر کد React'}).focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText(source);
  const draft=await page.evaluate(()=>JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['hello-react']);
  await page.getByRole('button',{name:'اجرای کد'}).click();
  const frame=page.frameLocator('iframe[title="پیش‌نمایش React"]');
  await expect(frame.locator('output')).toHaveText('0',{timeout:30000});await frame.getByRole('button',{name:'Add'}).click();
  await pane(page,'preview').getByRole('button',{name:'بستن پنجرهٔ پیش‌نمایش و اجرا',exact:true}).click();
  await expect(pane(page,'preview')).toBeHidden();
  await page.getByRole('button',{name:'باز کردن پنجرهٔ پیش‌نمایش و اجرا',exact:true}).click();
  await expect(frame.locator('output')).toHaveText('1');
  await pane(page,'editor').getByRole('button',{name:'بستن پنجرهٔ ویرایشگر',exact:true}).click();
  await expect(page.getByRole('textbox',{name:'ویرایشگر کد React'})).toHaveCount(0);
  await page.getByRole('button',{name:'باز کردن پنجرهٔ ویرایشگر',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['hello-react'])).toBe(draft);
  await expect(frame.locator('output')).toHaveText('1');
  await pane(page,'preview').getByRole('button',{name:'بستن پنجرهٔ پیش‌نمایش و اجرا',exact:true}).click();
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible({timeout:30000});
  await expect(page.getByTestId('total-xp')).toHaveText('200');
  await page.getByRole('button',{name:'باز کردن پنجرهٔ پیش‌نمایش و اجرا',exact:true}).click();
  await expect(frame.getByRole('heading',{name:'My layout'})).toBeVisible();
});

test('every pane can close and reopen; the all-closed state stays recoverable after reload',async({page})=>{
  await start(page);
  for(const id of ['path','mission','editor','preview']) await pane(page,id).getByRole('button',{name:/بستن پنجره/}).click();
  await expect(page.getByText('همهٔ پنجره‌ها بسته‌اند',{exact:true})).toBeVisible();
  await page.reload();await openComputer(page);
  await expect(page.getByText('همهٔ پنجره‌ها بسته‌اند',{exact:true})).toBeVisible({timeout:30000});
  await page.getByRole('button',{name:'باز کردن پنجرهٔ ویرایشگر',exact:true}).click();
  await expect(pane(page,'editor')).toBeVisible();expect((await pane(page,'editor').boundingBox())!.width).toBeGreaterThan(1300);
  await page.getByRole('button',{name:'بازنشانی چیدمان',exact:true}).click();
  for(const id of ['path','mission','editor','preview']) await expect(pane(page,id)).toBeVisible();
});

test('teaching panes resize and closing them does not reset the current explanation',async({page})=>{
  await start(page,false);
  const initial=(await pane(page,'path').boundingBox())!.width;
  await drag(page,'تغییر اندازهٔ بخش‌های درس',-80);
  expect((await pane(page,'path').boundingBox())!.width-initial).toBeGreaterThan(70);
  await pane(page,'path').getByRole('button',{name:'بستن پنجرهٔ بخش‌های درس',exact:true}).click();
  await page.getByTestId('lesson-next').click();
  await expect(page.locator('.teaching-article h1')).toHaveText('تگ چیست؟ عنوان و متن روی صفحه');
  await pane(page,'lesson').getByRole('button',{name:'بستن پنجرهٔ آموزش و مثال',exact:true}).click();
  await page.getByRole('button',{name:'باز کردن پنجرهٔ آموزش و مثال',exact:true}).click();
  await expect(page.locator('.teaching-article h1')).toHaveText('تگ چیست؟ عنوان و متن روی صفحه');
  await page.getByRole('button',{name:'باز کردن پنجرهٔ بخش‌های درس',exact:true}).click();
  await page.screenshot({path:'artifacts/react-quest-splitter-teaching.png'});
});

test('a new teaching step returns into view inside the mobile workspace',async({page})=>{
  await page.setViewportSize({width:390,height:844});await start(page,false);
  await page.getByTestId('lesson-next').click();
  const heading=page.locator('.teaching-article h1');
  await expect(heading).toHaveText('تگ چیست؟ عنوان و متن روی صفحه');
  await expect(heading).toBeInViewport();
  const box=(await heading.boundingBox())!, viewport=(await page.locator('.workspace-viewport').boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(viewport.y);
  expect(box.y+box.height).toBeLessThanOrEqual(viewport.y+viewport.height);
});

test('mobile panes resize vertically, close/reopen and keep the editor usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});await start(page);
  const initial=(await pane(page,'mission').boundingBox())!.height;
  await expect(page.getByRole('separator',{name:'تغییر اندازهٔ شرح تمرین',exact:true})).toHaveAttribute('aria-orientation','horizontal');
  await drag(page,'تغییر اندازهٔ شرح تمرین',0,90);
  expect((await pane(page,'mission').boundingBox())!.height-initial).toBeGreaterThan(80);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await pane(page,'editor').getByRole('button',{name:'بستن پنجرهٔ ویرایشگر',exact:true}).click();
  await page.getByRole('button',{name:'باز کردن پنجرهٔ ویرایشگر',exact:true}).click();
  await page.getByRole('textbox',{name:'ویرایشگر کد React'}).scrollIntoViewIfNeeded();
  await expect(page.getByRole('textbox',{name:'ویرایشگر کد React'})).toBeVisible();
  await page.screenshot({path:'artifacts/react-quest-splitter-mobile.png'});
});
