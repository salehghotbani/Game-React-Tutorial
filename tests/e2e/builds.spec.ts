import { expect, test, type Page } from '@playwright/test';
import { getChallenge } from '../../packages/challenges/src';

async function chooseProject(page: Page, id: string) {
  await page.goto('/');
  await page.getByRole('button', {name:'نقشهٔ دانش ↗',exact:true}).click();
  await page.getByRole('button', {name:'پروژه‌های واقعی',exact:true}).click();
  const challenge = getChallenge(id)!;
  await page.locator('.project-card').getByRole('button', {name:new RegExp(challenge.title)}).click();
  await expect(page.locator('.teaching-screen')).toHaveAttribute('data-lesson', id);
  await page.getByRole('button', {name:'رفتن مستقیم به تمرین ←',exact:true}).click();
  await expect(page.getByRole('textbox', {name:'ویرایشگر کد React'})).toBeVisible();
}
async function write(page: Page, code: string) {
  await page.getByRole('textbox', {name:'ویرایشگر کد React'}).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

test('starts an advanced build without earlier lessons; grades real behavior and reopens the saved creation', async ({page}) => {
  test.setTimeout(120000);
  await chooseProject(page, 'build-board');
  await expect(page.getByTestId('total-xp')).toHaveText('0');
  await write(page, 'export default function App(){return <h1>My Project Board</h1>}');
  await page.getByRole('button', {name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result')).toBeVisible({timeout:30000});
  await expect(page.locator('.evaluation-result')).not.toHaveClass(/passed/);
  await expect(page.getByTestId('total-xp')).toHaveText('0');
  await write(page, getChallenge('build-board')!.solution!);
  await page.getByRole('button', {name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible({timeout:30000});
  await expect(page.getByTestId('total-xp')).toHaveText('400');
  await page.getByRole('button', {name:'نمایش ساختهٔ من در سایت ↗',exact:true}).click();
  const preview = page.frameLocator('iframe[title="برنامهٔ ساخته‌شدهٔ من"]');
  await expect(preview.getByRole('heading', {name:'My Project Board',exact:true})).toBeVisible({timeout:30000});
  await preview.getByLabel('Card title').fill('My saved creation');
  await preview.locator('[data-add]').click();
  await preview.getByLabel('Status').selectOption('done');
  await expect(preview.locator('[data-column="done"] article h2')).toHaveText('My saved creation');
  await page.getByRole('button', {name:'بستن نمایش ×',exact:true}).click();
  await expect(page.getByTestId('total-xp')).toHaveText('400');
  await page.reload();
  await page.getByRole('button', {name:'نقشهٔ دانش ↗',exact:true}).click();
  await page.getByRole('button', {name:'پروژه‌های واقعی',exact:true}).click();
  await page.locator('.project-card').filter({has:page.getByRole('heading',{name:'My Project Board',exact:true})}).getByRole('button', {name:'نمایش ساختهٔ من در سایت ↗',exact:true}).click();
  await expect(preview.locator('[data-column="done"] article h2')).toHaveText('My saved creation',{timeout:30000});
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-progress-v1')!));
  expect(saved.completedLessons).toEqual(['build-board']);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog',{name:'ساختهٔ من'})).toHaveCount(0);
});

test('the advanced budget assessment checks addition, validation, filtering, deletion and persistence', async ({page}) => {
  test.setTimeout(90000);
  await chooseProject(page, 'build-budget');
  await write(page, getChallenge('build-budget')!.solution!);
  await page.getByRole('button', {name:'ارسال پاسخ',exact:true}).click();
  await expect(page.locator('.evaluation-result.passed')).toBeVisible({timeout:30000});
  await expect(page.locator('.evaluation-result li')).toHaveCount(4);
  await expect(page.getByTestId('total-xp')).toHaveText('400');
});
