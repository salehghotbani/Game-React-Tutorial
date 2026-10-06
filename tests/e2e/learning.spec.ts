import { expect, test, type Page } from '@playwright/test';
import { solutions } from './solutions';
import { finishLesson } from './teachingHelpers';

async function enterComputer(page: Page) {
  await page.goto('/');
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
  await page.keyboard.down('w');
  await expect(page.getByRole('button', { name: 'استفاده از کامپیوتر' })).toBeVisible({ timeout: 15000 });
  await page.keyboard.up('w');
  await page.keyboard.press('e');
  await expect(page.getByRole('region', { name: 'محیط آموزش React' })).toBeVisible({ timeout: 30000 });
  await finishLesson(page);
  await expect(page.getByRole('textbox', { name: 'ویرایشگر کد React' })).toBeVisible({ timeout: 30000 });
}

async function writeCode(page: Page, code: string) {
  const editor = page.getByRole('textbox', { name: 'ویرایشگر کد React' });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

async function submit(page: Page, code: string, xp: number) {
  await page.getByLabel('روش اجرا').selectOption('local');
  await writeCode(page, code);
  await page.getByRole('button', { name: 'ارسال پاسخ', exact: true }).click();
  await expect(page.getByText('مأموریت انجام شد!', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('total-xp')).toHaveText(String(xp));
}

async function walkToArcade(page: Page) {
  const yaw = Math.atan2(4.5, 7);
  for (let i = 0; i < 45; i++) {
    const marker = page.getByTestId('player-marker');
    const x = Number(await marker.getAttribute('data-player-x'));
    const z = Number(await marker.getAttribute('data-player-z'));
    const dx = 3.9 - x, dz = -1.6 - z;
    if (Math.hypot(dx, dz) < 1.6) break;
    const horizontal = dx * Math.cos(yaw) - dz * Math.sin(yaw);
    const forward = -dx * Math.sin(yaw) - dz * Math.cos(yaw);
    const keys: string[] = [];
    if (Math.abs(horizontal) > Math.abs(forward) * 0.45) keys.push(horizontal > 0 ? 'd' : 'a');
    if (Math.abs(forward) > Math.abs(horizontal) * 0.45) keys.push(forward > 0 ? 'w' : 's');
    for (const key of keys) await page.keyboard.down(key);
    await page.waitForTimeout(180);
    for (const key of keys) await page.keyboard.up(key);
  }
  await expect(page.getByRole('button', { name: 'بازی Bug Hunter' })).toBeVisible({ timeout: 5000 });
  await page.keyboard.press('e');
  await expect(page.getByRole('region', { name: 'بازی Bug Hunter' })).toBeVisible();
}

test('completes the five-lesson loop, persists rewards, unlocks the real arcade and plays Bug Hunter', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await enterComputer(page);
  const lessonNames = ['اولین کامپوننت تو', 'کارت یک برنامه‌نویس', 'یک کارت، چند محصول', 'آمادهٔ پرتاب!', 'شمارندهٔ زنده'];
  await page.getByLabel('فصل آموزشی').selectOption('all');
  await expect(page.getByRole('button', { name: /شمارندهٔ زنده/ })).toBeEnabled();
  for (let i = 0; i < solutions.length; i++) {
    await submit(page, solutions[i]!, (i + 1) * 200);
    if (i === 0) await page.screenshot({ path: 'artifacts/react-quest-learning.png' });
    if (i < 4) await page.getByRole('button', { name: `مأموریت بعدی: ${lessonNames[i + 1]} ←` }).click();
    if (i < 4) await finishLesson(page);
  }
  await expect(page.getByTestId('total-xp')).toHaveText('1000');
  await page.screenshot({ path: 'artifacts/react-quest-counter-complete.png' });
  await page.getByRole('button', { name: 'ارسال پاسخ', exact: true }).click();
  await expect(page.getByText('این تمرین قبلاً پاداش گرفته؛ مرور موفق ثبت شد.')).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('total-xp')).toHaveText('1000');
  await page.getByRole('button', { name: 'بازگشت به اتاق', exact: true }).click();
  await page.getByRole('button', { name: /خانهٔ تو/ }).click();
  await expect(page.locator('.world-dock').getByRole('button', {name:'رفتن به بازی Bug Hunter',exact:true})).toBeVisible();
  await page.getByRole('button', { name: /خانهٔ تو/ }).click();
  await page.screenshot({ path: 'artifacts/react-quest-unlocked-room.png' });
  await page.reload();
  await expect(page.getByTestId('room-xp')).toContainText('1000');
  await page.getByRole('button', { name: /خانهٔ تو/ }).click();
  await expect(page.locator('.world-dock').getByRole('button', {name:'رفتن به بازی Bug Hunter',exact:true})).toBeVisible();
  await page.getByRole('button', { name: /خانهٔ تو/ }).click();
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden();
  await walkToArcade(page);
  await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
  await page.getByTestId('bug-target').first().click({ timeout: 10000, force: true });
  await expect(page.getByText('کدام گزینه تابع را فقط هنگام کلیک اجرا می‌کند؟')).toBeVisible();
  await page.getByTestId('answer-0').click();
  await expect(page.getByTestId('arcade-score')).toHaveText('0');
  await expect(page.getByText(/باگ فرار کرد و سریع‌تر شد/)).toBeVisible();
  await page.getByTestId('bug-target').first().click({ force: true });
  await page.getByTestId('answer-2').click();
  await expect(page.getByTestId('arcade-score')).toHaveText('100');
  await page.screenshot({ path: 'artifacts/react-quest-bug-hunter.png' });
  await page.getByRole('button', { name: 'بازگشت به اتاق ←' }).click();
  await expect(page.getByTestId('room-xp')).toContainText('1000');
  expect(errors).toEqual([]);
});

test('fails incorrect JSX and behavior, contains infinite loops and protects the parent document', async ({ page }) => {
  test.setTimeout(120000);
  await enterComputer(page);
  await page.getByLabel('روش اجرا').selectOption('local');
  await writeCode(page, 'export default function App() { return <h1>Hello React</h1>; }');
  await page.getByRole('button', { name: 'ارسال پاسخ', exact: true }).click();
  await expect(page.getByText('یک قدم تا موفقیت', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('total-xp')).toHaveText('0');
  await writeCode(page, 'export default function App() { return <h1>; }');
  await page.getByRole('button', { name: 'ارسال پاسخ', exact: true }).click();
  await expect(page.locator('.runtime-status.error')).toContainText('App.jsx', { timeout: 30000 });
  await expect(page.getByTestId('total-xp')).toHaveText('0');
  await writeCode(page, 'export default function App() { while (true) {} return <p>loop</p>; }');
  await page.getByRole('button', { name: 'اجرای کد' }).click();
  await expect(page.locator('.runtime-status.error')).toContainText('Execution limit exceeded', { timeout: 30000 });
  await writeCode(page, 'export default function App() { const text = window.parent.document.body.innerText; return <p>{text}</p>; }');
  await page.getByRole('button', { name: 'اجرای کد' }).click();
  await expect(page.locator('.runtime-status.error')).toContainText(/Blocked a frame|cross-origin/, { timeout: 30000 });
  await page.getByRole('button', { name: 'بازگشت به اتاق', exact: true }).click();
  await expect(page.getByTestId('room-xp')).toContainText('0');
});

test('attempts WebContainers in automatic mode and keeps the real React preview usable', async ({ page }) => {
  test.setTimeout(150000);
  await enterComputer(page);
  await page.getByLabel('روش اجرا').selectOption('auto');
  await writeCode(page, solutions[0]!);
  await page.getByRole('button', { name: 'ارسال پاسخ', exact: true }).click();
  await expect(page.getByText('مأموریت انجام شد!', { exact: true })).toBeVisible({ timeout: 120000 });
  await expect(page.frameLocator('iframe[title="پیش‌نمایش React"]').getByRole('heading', { name: 'Hello React' })).toBeVisible();
  const status = await page.locator('.runtime-status').innerText();
  const engine = await page.locator('.preview-heading small').innerText();
  test.info().annotations.push({ type: 'runtime', description: `${engine}: ${status}` });
  console.info(`[runtime] ${engine}: ${status}`);
  await page.screenshot({ path: 'artifacts/react-quest-auto-runtime.png' });
});

test('keeps the lesson editor and preview usable at a narrow viewport', async ({ page }) => {
  await enterComputer(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'بازگشت به اتاق', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const screen = page.getByRole('region', { name: 'محیط آموزش React' });
  expect(await screen.evaluate((element) => element.scrollWidth)).toBe(390);
  expect((await page.locator('.challenge-content').boundingBox())!.height).toBeGreaterThan(250);
  await page.screenshot({ path: 'artifacts/react-quest-learning-mobile-top.png' });
  await page.getByRole('button', { name: 'اجرای کد' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('textbox', { name: 'ویرایشگر کد React' })).toBeVisible();
  await page.locator('iframe[title="پیش‌نمایش React"]').scrollIntoViewIfNeeded();
  await expect(page.getByLabel('روش اجرا')).toBeVisible();
  await page.screenshot({ path: 'artifacts/react-quest-learning-mobile.png' });
});
