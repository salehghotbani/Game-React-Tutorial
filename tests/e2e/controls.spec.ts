import { expect, test, type Page } from '@playwright/test';
import { finishLesson, openComputer } from './teachingHelpers';

async function load(page: Page) {
  await page.goto('/');
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
}
async function go(page: Page, destination: string) {
  await page.getByRole('button', { name: /خانهٔ تو/ }).click();
  await page.locator('.world-dock').getByRole('button', { name: `رفتن به ${destination}`, exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 40000 });
}
async function position(page: Page) {
  const marker = page.getByTestId('player-marker');
  return { x: Number(await marker.getAttribute('data-player-x')), z: Number(await marker.getAttribute('data-player-z')), y: Number(await marker.getAttribute('data-player-y')), yaw: Number(await marker.getAttribute('data-camera-yaw')) };
}

test.describe('first-visit appearance', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('asks for a theme, saves the choice, and follows server day/night only in automatic mode', async ({ page }) => {
    test.setTimeout(90000);
    let timestamp = Date.parse('2026-10-04T08:30:00Z');
    await page.route('**/api/locale', route => route.fulfill({ json: { country: 'IR' } }));
    await page.route('**/api/time', route => route.fulfill({ json: { timestamp, timeZone: 'Asia/Tehran' } }));
    await load(page);
    const chooser = page.getByRole('dialog', { name: 'محله را با چه نوری ببینی؟' });
    await expect(chooser).toBeVisible();
    await page.screenshot({ path: 'artifacts/realistic-theme-picker.png' });
    await page.getByRole('button', { name: 'انتخاب تم روشن', exact: true }).click();
    await expect(chooser).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(chooser).toHaveCount(0);
    await expect(page.locator('main')).toHaveAttribute('data-theme-mode', 'light');
    await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
    await page.getByRole('radio', { name: 'تاریک', exact: true }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'بستن تنظیمات', exact: true }).click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'artifacts/realistic-night.png' });
    await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
    await page.getByRole('radio', { name: 'با ساعت سرور', exact: true }).check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    timestamp = Date.parse('2026-10-04T18:30:00Z');
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => localStorage.getItem('react-quest-theme-v1'))).toBe('auto');
  });
});

test('light and dark appearance reach the lesson panes and editor without losing the draft', async ({ page }) => {
  test.setTimeout(90000);
  await load(page);
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await page.getByRole('radio', { name: 'روشن', exact: true }).check();
  await page.getByRole('button', { name: 'بستن تنظیمات', exact: true }).click();
  await openComputer(page);
  await expect(page.locator('.teaching-article')).toHaveCSS('background-color', 'rgb(255, 254, 247)');
  await finishLesson(page);
  await expect(page.locator('.monaco-editor.vs')).toBeVisible({ timeout: 30000 });
  const editor = page.getByRole('textbox', { name: 'ویرایشگر کد React' });
  await editor.focus(); await page.keyboard.press('ControlOrMeta+End'); await page.keyboard.insertText('\n// saved appearance draft');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('react-quest-progress-v1'))).toContain('saved appearance draft');
  await page.screenshot({ path: 'artifacts/realistic-learning-light.png' });
  await page.getByRole('button', { name: 'بازگشت به اتاق', exact: true }).click();
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await page.getByRole('radio', { name: 'تاریک', exact: true }).check();
  await page.getByRole('button', { name: 'بستن تنظیمات', exact: true }).click();
  await openComputer(page);
  await expect(page.locator('.monaco-editor.vs-dark')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.computer-header')).toHaveCSS('background-color', 'rgb(24, 37, 41)');
  await expect(page.locator('.monaco-editor')).toContainText('saved appearance draft');
  await page.screenshot({ path: 'artifacts/realistic-learning-dark.png' });
});

test('dragging rotates the third-person view and walking follows its changed direction', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await load(page);
  await go(page, 'کوچهٔ یادگیری');
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await page.getByRole('radio', { name: 'روشن', exact: true }).check();
  await page.getByRole('button', { name: 'بستن تنظیمات', exact: true }).click();
  const start = await position(page);
  await page.mouse.move(350, 400); await page.mouse.down(); await page.mouse.move(980, 440, { steps: 12 }); await page.mouse.up();
  await expect.poll(async () => Math.abs((await position(page)).yaw - start.yaw)).toBeGreaterThan(2.5);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'artifacts/realistic-neighborhood-day.png' });
  const before = await position(page);
  await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).z).toBeGreaterThan(before.z + 0.4);
  await page.keyboard.up('w');
  await page.getByRole('button', { name: 'تغییر به اول‌شخص', exact: true }).click();
  const first = await position(page);
  await page.mouse.move(600, 400); await page.mouse.down(); await page.mouse.move(820, 400, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => Math.abs((await position(page)).yaw - first.yaw)).toBeGreaterThan(0.5);
  expect(errors).toEqual([]);
});

test('Space jumps and lands without an air jump; held Shift makes real movement faster', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 960, height: 640 });
  await load(page);
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await page.getByRole('radio', { name: 'روشن', exact: true }).check();
  await page.getByRole('button', { name: 'بستن تنظیمات', exact: true }).click();
  await go(page, 'حیاط خانه');
  await page.getByRole('button', { name: 'تغییر به اول‌شخص', exact: true }).click();
  await expect.poll(async () => (await position(page)).y).toBeCloseTo(0.925, 1);
  await page.keyboard.down('Space');
  await expect.poll(async () => (await position(page)).y, { intervals: [50] }).toBeGreaterThan(1.4);
  await page.keyboard.down('Space');
  await expect.poll(async () => (await position(page)).y, { timeout: 10000 }).toBeCloseTo(0.925, 1);
  await page.waitForTimeout(600);
  expect((await position(page)).y).toBeCloseTo(0.925, 1);
  await page.keyboard.up('Space');
  const beforeWalk = await position(page);
  await page.keyboard.down('d'); await page.waitForTimeout(650); await page.keyboard.up('d');
  const walkDistance = (await position(page)).x - beforeWalk.x;
  await go(page, 'حیاط خانه');
  const beforeRun = await position(page);
  await page.keyboard.down('Shift'); await page.keyboard.down('d');
  await page.waitForTimeout(650); await page.keyboard.up('d'); await page.keyboard.up('Shift');
  const runDistance = (await position(page)).x - beforeRun.x;
  expect(walkDistance).toBeGreaterThan(0.5);
  expect(runDistance).toBeGreaterThan(walkDistance * 1.4);
});

test('mobile offers touch jumping/running and a readable dark settings panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page);
  await expect(page.getByRole('button', { name: 'دویدن', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'پرش', exact: true }).click();
  await expect.poll(async () => (await position(page)).y, { intervals: [50] }).toBeGreaterThan(1.2);
  await expect(page.locator('.movement-guide')).toHaveCSS('opacity', '0');
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await page.getByRole('radio', { name: 'تاریک', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'artifacts/realistic-mobile-settings.png' });
});
