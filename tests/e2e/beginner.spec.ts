import { expect, test, type Page } from '@playwright/test';
import { finishLesson, openComputer } from './teachingHelpers';

async function start(page: Page) {
  await page.goto('/');
  await openComputer(page);
  await expect(page.locator('.teaching-screen')).toBeVisible({timeout:30000});
}
async function write(page: Page, source: string) {
  await page.getByRole('textbox',{name:'ویرایشگر کد React'}).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(source);
}

test('a novice reads explanations and runs a free example before a personal first exercise', async ({page}) => {
  test.setTimeout(120000);
  await start(page);
  await expect(page.getByRole('heading',{name:'React چیست و چه کاری انجام می‌دهد؟',exact:true})).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByRole('textbox',{name:'ویرایشگر کد React'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'ارسال پاسخ',exact:true})).toHaveCount(0);
  await expect(page.locator('.teaching-path button').filter({hasText:'JSX: نوشتن ظاهر داخل JavaScript'})).toBeEnabled();
  await page.screenshot({path:'artifacts/react-quest-beginner-start.png'});
  await page.getByTestId('lesson-next').click();
  await page.getByRole('button',{name:'اجرای نمونه'}).click();
  await expect(page.frameLocator('iframe[title="نمونهٔ آموزشی React"]').getByRole('heading',{name:'سلام، من سارا هستم'})).toBeVisible({timeout:30000});
  await expect(page.getByTestId('total-xp')).toHaveText('0');
  await page.reload();
  await openComputer(page);
  await expect(page.locator('.teaching-article h1')).toHaveText('تگ چیست؟ عنوان و متن روی صفحه');
  await finishLesson(page);
  await write(page, 'export default function Welcome(){return <main><h1>سلام من رضا هستم</h1><p>دارم React یاد می‌گیرم</p></main>}');
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible({timeout:30000});
  await expect(page.getByTestId('total-xp')).toHaveText('200');
  await page.locator('.challenge-content').getByRole('button',{name:'مرور درس · رایگان',exact:true}).click();
  await finishLesson(page);
  await expect(page.getByTestId('total-xp')).toHaveText('200');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-progress-v1')!));
  expect(saved.assistance['hello-react']).toBeUndefined();
  await page.getByRole('button',{name:'مأموریت بعدی: کارت یک برنامه‌نویس',exact:true}).click();
  await finishLesson(page);
  await write(page,'function ProfileCard(){return <section><h2>ada   lovelace.</h2><p>React Developer!</p><button>Follow</button></section>} export default function App(){return <ProfileCard/>}');
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible({timeout:30000});
  await expect(page.getByTestId('total-xp')).toHaveText('400');
  await page.getByRole('button',{name:'مأموریت بعدی: یک کارت، چند محصول',exact:true}).click();
  await finishLesson(page);
  await page.getByLabel('فصل آموزشی').selectOption('all');
  // The event lesson is gated by the props task, so revisit a taught state example
  // through the library without awarding a new exercise or revealing its answer.
  await page.getByRole('region',{name:'محیط آموزش React'}).getByRole('button',{name:'نقشهٔ دانش ↗',exact:true}).click();
  await page.getByRole('button',{name:'کتابخانه',exact:true}).click();
  await page.locator('.library-layout nav').getByRole('button',{name:'3. State و رویدادها',exact:true}).click();
  await page.getByRole('navigation', {name:'بخش‌های این فصل', exact:true}).getByRole('button', {name:/از کلیک تا تغییر صفحه/}).click();
  const demo = page.locator('.library-teaching > section').filter({has:page.getByRole('heading',{name:'از کلیک تا تغییر صفحه',exact:true})});
  await demo.getByRole('button',{name:'اجرای نمونه'}).click();
  const preview = demo.frameLocator('iframe[title="نمونهٔ آموزشی React"]');
  await expect(preview.locator('output')).toHaveText('0',{timeout:30000});
  await preview.getByRole('button',{name:'پسندیدم',exact:true}).click();
  await expect(preview.locator('output')).toHaveText('1');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-progress-v1')!).assistance['product-props'])).toBeUndefined();
});

test('a prediction is shown after teaching; teaching is readable on a phone', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await start(page);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(await page.locator('.teaching-screen').evaluate(el=>el.scrollWidth)).toBe(390);
  await page.screenshot({path:'artifacts/react-quest-beginner-mobile.png'});
  await finishLesson(page);
  await page.getByLabel('فصل آموزشی').selectOption('all');
  await page.locator('[data-challenge="js-map"]').click();
  await expect(page.locator('.teaching-article h1')).toHaveText('متغیر، شیء و آرایه یعنی چه؟');
  await expect(page.getByRole('radio')).toHaveCount(0);
  await finishLesson(page);
  await expect(page.getByRole('radio')).toHaveCount(4);
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('button',{name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible();
});
