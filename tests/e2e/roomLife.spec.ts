import { expect, test, type Page } from '@playwright/test';
import { challenges } from '../../packages/challenges/src/index';
import { finishLesson, openComputer } from './teachingHelpers';

async function load(page:Page,completed=0) {
  if(completed)await page.addInitScript(ids=>{if(!localStorage.getItem('react-quest-progress-v1'))localStorage.setItem('react-quest-progress-v1',JSON.stringify({version:3,completedLessons:ids}));},challenges.slice(0,completed).map(c=>c.id));
  await page.goto('/');await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({timeout:30000});
}
async function go(page:Page,title:string,interaction:string) {
  await page.getByRole('button',{name:/خانهٔ تو/}).click();
  await page.locator('.world-dock').getByRole('button',{name:`رفتن به ${title}`,exact:true}).click();
  await expect(page.locator('.room-destination')).toHaveCount(0,{timeout:30000});
  await expect(page.locator('.interaction-prompt')).toContainText(interaction,{timeout:10000});
  await page.locator('.interaction-prompt').click();
}
test('a real completed exercise earns a drop; watering blooms and persists without repeated rewards',async({page})=>{
  test.setTimeout(120000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await load(page);
  await page.screenshot({path:'artifacts/react-quest-living-room-start.png'});
  await go(page,'آب دادن به گل‌ها','آب دادن به گل‌ها');
  await expect(page.getByText('هر تمرین را با تمام تست‌های موفق کامل کن تا یک قطرهٔ دانش بگیری.')).toBeVisible();
  await expect(page.locator('main.game-page')).toHaveAttribute('data-world-blooms','0');
  await openComputer(page);await finishLesson(page);
  await page.getByRole('textbox',{name:'ویرایشگر کد React'}).focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText(challenges[0]!.solution!);
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();await expect(page.getByTestId('total-xp')).toHaveText('200',{timeout:30000});
  await page.getByRole('button',{name:'بازگشت به اتاق',exact:true}).click();
  await go(page,'آب دادن به گل‌ها','آب دادن به گل‌ها');
  await expect(page.locator('main.game-page')).toHaveAttribute('data-world-blooms','1');
  await page.screenshot({path:'artifacts/react-quest-flowers-watered.png'});
  await expect(page.locator('.interaction-prompt')).toContainText('آب دادن به گل‌ها',{timeout:5000});await page.locator('.interaction-prompt').click();
  await expect(page.locator('main.game-page')).toHaveAttribute('data-world-blooms','1');
  await page.reload();await expect(page.locator('main.game-page')).toHaveAttribute('data-world-blooms','1');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('react-quest-progress-v1')!).roomLife.wateredLessons)).toEqual(['hello-react']);
  expect(errors).toEqual([]);
});
test('books turn real teaching pages; collecting a key physically opens the greenhouse',async({page})=>{
  test.setTimeout(120000);await load(page,3);
  await go(page,'کتابخانهٔ React','ورق زدن کتاب‌های React');
  const book=page.getByRole('dialog',{name:'کتابخانهٔ اتاق'});
  await book.getByRole('button',{name:'ورق بعدی ←',exact:true}).click();
  await expect(book.getByRole('heading',{name:'تگ چیست؟ عنوان و متن روی صفحه',exact:true})).toBeVisible();
  await expect(book.locator('.book-page')).toHaveCSS('opacity','1');
  await page.screenshot({path:'artifacts/react-quest-room-book.png'});
  await book.getByRole('button',{name:'بستن کتابخانهٔ اتاق',exact:true}).click();
  await go(page,'برداشتن کلید','برداشتن کلید گلخانه');await expect(page.locator('main.game-page')).toHaveAttribute('data-room-key','true');
  await go(page,'باز کردن درِ گلخانه','باز کردن قفل گلخانه');await expect(page.locator('main.game-page')).toHaveAttribute('data-greenhouse-open','true');
  await go(page,'رفتن به گلخانه','آبیاری باغچهٔ گلخانه');
  await expect.poll(async()=>Number(await page.getByTestId('player-marker').getAttribute('data-player-x'))).toBeGreaterThan(6.5);
  await page.screenshot({path:'artifacts/react-quest-greenhouse.png'});
  // Stop navigating before reload; the doorway and bookmark persist, movement does not.
  await page.reload();await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({timeout:30000});
  await expect(page.locator('main.game-page')).toHaveAttribute('data-greenhouse-open','true');
  await go(page,'کتابخانهٔ React','ورق زدن کتاب‌های React');
  await expect(page.getByRole('dialog').getByRole('heading',{name:'تگ چیست؟ عنوان و متن روی صفحه',exact:true})).toBeVisible();
});
test('television seats the player, loads the real video URL on demand, and restores the walking position',async({page})=>{
  test.setTimeout(90000);await load(page,2);
  // External streaming is not part of deterministic CI; verify the player contract and real source URL.
  await page.route('https://www.youtube-nocookie.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'<p>Test video host</p>'}));
  await page.getByRole('button',{name:/خانهٔ تو/}).click();await page.locator('.world-dock').getByRole('button',{name:'رفتن به نشستن پای تلویزیون',exact:true}).click();
  await expect(page.locator('.room-destination')).toHaveCount(0,{timeout:20000});
  const before={x:Number(await page.getByTestId('player-marker').getAttribute('data-player-x')),z:Number(await page.getByTestId('player-marker').getAttribute('data-player-z'))};
  await page.locator('.interaction-prompt').click();
  const cinema=page.getByRole('dialog',{name:'سینمای React'});await expect(cinema).toBeVisible({timeout:15000});
  await expect(page.locator('main.game-page')).toHaveAttribute('data-game-mode','watching');
  await expect.poll(async()=>Number(await page.getByTestId('player-marker').getAttribute('data-player-x'))).toBeCloseTo(2.5,1);
  await expect(cinema.locator('iframe')).toHaveCount(0);
  await page.screenshot({path:'artifacts/react-quest-room-cinema.png'});
  await cinema.getByRole('button',{name:'پخش فیلم آموزشی',exact:true}).click();
  await expect(cinema.locator('iframe')).toHaveAttribute('src',/youtube-nocookie\.com\/embed\/x4rFhThSX04/);
  await expect(cinema.locator('iframe')).toHaveAttribute('credentialless','');
  await cinema.getByRole('button',{name:'بستن سینمای React',exact:true}).click();
  await expect.poll(async()=>Number(await page.getByTestId('player-marker').getAttribute('data-player-x'))).toBeCloseTo(before.x,1);
  await expect.poll(async()=>Number(await page.getByTestId('player-marker').getAttribute('data-player-z'))).toBeCloseTo(before.z,1);
  await expect(page.locator('iframe[title="فیلم آموزشی React از freeCodeCamp"]')).toHaveCount(0);
});
test('room activities and the book are usable on mobile without horizontal overflow',async({page})=>{
  test.setTimeout(90000);await page.setViewportSize({width:390,height:844});await load(page);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await go(page,'کتابخانهٔ React','ورق زدن کتاب‌های React');
  await page.getByRole('button',{name:'ورق بعدی ←',exact:true}).click();
  await expect(page.getByRole('heading',{name:'تگ چیست؟ عنوان و متن روی صفحه',exact:true})).toBeVisible();
  await expect(page.locator('.book-page')).toHaveCSS('opacity','1');
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({path:'artifacts/react-quest-room-book-mobile.png'});
  await page.getByRole('button',{name:'بستن کتابخانهٔ اتاق',exact:true}).click();
  await page.screenshot({path:'artifacts/react-quest-living-room-mobile.png'});
});
