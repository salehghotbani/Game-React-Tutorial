import { expect, test, type Page } from '@playwright/test';
import { challenges } from '../../packages/challenges/src';
import { translate, translateAuthoredCode } from '../../packages/localization/src';

test.use({ storageState: { cookies: [], origins: [] }, locale: 'fa-IR', timezoneId: 'Asia/Tehran' });
async function location(page: Page, country: string | null) {
  await page.route('**/api/locale', route => route.fulfill({ json: { country } }));
}
async function start(page: Page, language: 'fa' | 'en') {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', language);
  await page.getByRole('button', { name: language === 'fa' ? 'انتخاب تم روشن' : 'Choose Light theme', exact: true }).click();
  await expect(page.locator('.scene-loading')).toHaveCount(0, { timeout: 30000 });
  await expect(page.getByTestId('player-marker')).toBeVisible({ timeout: 30000 });
}
async function computer(page: Page, language: 'fa' | 'en') {
  await page.locator('.room-dock-toggle').click();
  await page.locator('.world-dock').getByRole('button', { name: language === 'fa' ? 'رفتن به کامپیوتر یادگیری' : 'Go to Learning computer', exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator('.interaction-prompt')).toContainText(language === 'fa' ? 'استفاده از کامپیوتر' : 'Use the computer');
  if (language === 'en') {
    await page.locator('.world-tools').getByRole('combobox', { name: 'Site language' }).focus();
    await page.keyboard.press('e');
    await expect(page.locator('.computer-screen')).toHaveCount(0);
  }
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.computer-screen')).toBeVisible({ timeout: 30000 });
}

test('Iran defaults to Persian; manually choosing English survives reload', async ({ page }) => {
  await location(page, 'IR');
  let publicRequests = 0; page.on('request', request => { if (request.url().startsWith('https://api.country.is/')) publicRequests++; });
  await start(page, 'fa');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('button', { name: 'تنظیمات', exact: true })).toBeVisible();
  await page.locator('.world-tools').getByRole('combobox', { name: 'زبان سایت' }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeVisible();
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByTestId('player-marker')).toBeVisible({ timeout: 30000 });
  expect(await page.evaluate(() => localStorage.getItem('react-quest-language-v1'))).toBe('en');
  expect(publicRequests).toBe(0);
  await page.screenshot({ path: 'artifacts/bilingual-world-english.png' });
});

test('outside Iran uses English lessons, examples and grading; language changes preserve code, XP and splitter state', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await location(page, 'DE'); await start(page, 'en');
  await page.getByRole('button', { name: 'Knowledge map ↗', exact: true }).click();
  await expect(page.locator('.chapter-card')).toHaveCount(15);
  expect(await page.locator('.learning-hub').innerText()).not.toMatch(/[\u0600-\u06ff]/);
  await page.getByRole('button', { name: 'Library', exact: true }).click();
  await expect(page.locator('.library-teaching')).toContainText('What is React and what does it do?');
  expect(await page.locator('.library-teaching').innerText()).not.toMatch(/[\u0600-\u06ff]/);
  await page.getByRole('button', { name: 'Close map ×', exact: true }).click();
  await computer(page, 'en');
  await expect(page.locator('.teaching-article')).toContainText('React is a JavaScript library');
  await page.getByTestId('lesson-next').click();
  await page.getByRole('button', { name: '▶ Run example', exact: true }).click();
  await expect(page.frameLocator('iframe[title="React teaching example"]').getByRole('heading', { name: 'Hello, I am Sara' })).toBeVisible({ timeout: 30000 });
  for (let step = 0; step < 10 && await page.locator('.teaching-screen').count(); step++) await page.getByTestId('lesson-next').click();
  const editor = page.getByRole('textbox', { name: 'React code editor' }); await expect(editor).toBeVisible({ timeout: 30000 });
  const code = 'export default function App(){return <main><h1>My own greeting</h1><p>No final period required</p></main>;}\n// bilingual saved draft';
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(code);
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.getByTestId('total-xp')).toHaveText('200', { timeout: 30000 });
  const path = page.locator('[data-panel="path"]'); const before = (await path.boundingBox())!.width;
  await page.getByRole('separator', { name: 'Resize Learning path', exact: true }).press('ArrowRight');
  await expect.poll(async () => (await path.boundingBox())!.width).toBeGreaterThan(before + 10);
  await page.getByRole('button', { name: 'Close Editor window', exact: true }).click();
  await page.getByRole('button', { name: 'Open Editor window', exact: true }).click();
  await expect(page.locator('.monaco-editor')).toContainText('bilingual saved draft');
  await page.screenshot({ path: 'artifacts/bilingual-learning-english.png' });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['hello-react']);
  await page.getByRole('button', { name: 'Back to room', exact: true }).click();
  await page.locator('.world-tools').getByRole('combobox', { name: 'Site language' }).selectOption('fa');
  await computer(page, 'fa');
  await expect(page.getByTestId('total-xp')).toHaveText('200');
  await expect(page.locator('.monaco-editor')).toContainText('bilingual saved draft');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-progress-v1')!).drafts['hello-react'])).toBe(saved);
  await expect(page.locator('.panel-strip')).toHaveCSS('direction', 'rtl');
  expect(errors).toEqual([]);
});

test('automatic mode uses the visitor IP lookup when the host has no country', async ({ page }) => {
  await location(page, null);
  await page.route('https://api.country.is/', route => route.fulfill({ json: { country: 'US', ip: '198.51.100.5' } }));
  await start(page, 'en');
  expect(await page.evaluate(() => localStorage.getItem('react-quest-language-v1'))).toBeNull();
});

test('lookup failures use a local fallback and an explicit choice still works', async ({ page }) => {
  await page.route('**/api/locale', route => route.abort());
  await page.route('https://api.country.is/', route => route.abort());
  await start(page, 'fa');
  await page.locator('.world-tools').getByRole('combobox', { name: 'زبان سایت' }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('mobile English settings and React books use LTR without overflow', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 }); await location(page, 'GB'); await start(page, 'en');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.locator('.settings-panel').getByRole('combobox', { name: 'Site language' })).toBeVisible();
  // Native language names remain recognizable in the language chooser.
  expect((await page.locator('.settings-panel').innerText()).replaceAll('فارسی', '')).not.toMatch(/[\u0600-\u06ff]/);
  await page.screenshot({ path: 'artifacts/bilingual-mobile-settings.png' });
  await page.getByRole('button', { name: 'Close settings', exact: true }).click();
  await page.locator('.room-dock-toggle').click();
  await page.locator('.world-dock').getByRole('button', { name: 'Go to React library', exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 30000 });
  await page.locator('.interaction-prompt').click();
  await page.getByRole('button', { name: 'Next page →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What is a tag? Headings and text on the page', exact: true })).toBeVisible();
  expect(await page.locator('.book-page').innerText()).not.toMatch(/[\u0600-\u06ff]/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.locator('.book-page')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'artifacts/bilingual-mobile-book.png' });
});

test('all English curriculum solutions pass the actual behavior, source and question checks', async ({ page }) => {
  test.setTimeout(600000);
  await page.addInitScript(ids => localStorage.setItem('react-quest-progress-v1', JSON.stringify({
    version: 1, completedLessons: ids, selectedChallengeId: 'hello-react'
  })), challenges.map(challenge => challenge.id));
  await location(page, 'DE'); await start(page, 'en'); await computer(page, 'en');
  const failures: string[] = [];
  for (const challenge of challenges) {
    await page.getByLabel(translate('فصل آموزشی', 'en')).selectOption('all');
    await page.locator(`[data-challenge="${challenge.id}"]`).click();
    if (!challenge.tests.every(check => check.questionId)) {
      const editor = page.getByRole('textbox', { name: 'React code editor' });
      await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText(translateAuthoredCode(challenge.solution!, 'en'));
    }
    for (let index = 0; index < (challenge.questions?.length ?? 0); index++) {
      await page.locator('.knowledge-questions fieldset').nth(index).getByRole('radio').nth(challenge.questions![index]!.answer).check();
    }
    const submit = page.getByRole('button', { name: 'Submit answer', exact: true });
    await submit.click(); await expect(submit).toBeEnabled({ timeout: 30000 });
    const result = page.locator('.evaluation-result');
    if (!await result.count() || !await result.evaluate(element => element.classList.contains('passed'))) {
      failures.push(`${challenge.id}: ${await result.count() ? await result.innerText() : await page.locator('.runtime-status').innerText()}`);
    }
    console.info(`[English curriculum] ${challenge.id}: ${failures.at(-1)?.startsWith(challenge.id + ':') ? 'FAILED' : 'PASS'}`);
  }
  expect(failures).toEqual([]);
});
