import { expect, test, type Page } from '@playwright/test';

async function playerPosition(page: Page) {
  const marker = page.getByTestId('player-marker');
  return { x: Number(await marker.getAttribute('data-player-x')), z: Number(await marker.getAttribute('data-player-z')) };
}

test('loads the 3D room, moves, pauses, resumes and resets without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
  await page.waitForTimeout(1200);
  const start = await playerPosition(page);
  await page.keyboard.down('w');
  await expect.poll(async () => (await playerPosition(page)).z).toBeLessThan(start.z - 0.5);
  await page.keyboard.up('w');
  await page.keyboard.press('Escape');
  await expect(page.getByText('یک نفس تازه کن.')).toBeVisible();
  // Map telemetry is sampled; wait for the stopped position to be published.
  await page.waitForTimeout(300);
  const paused = await playerPosition(page);
  await page.keyboard.down('d');
  await page.waitForTimeout(600);
  await page.keyboard.up('d');
  const still = await playerPosition(page);
  expect(still.x).toBeCloseTo(paused.x, 1);
  expect(still.z).toBeCloseTo(paused.z, 1);
  await page.getByRole('button', { name: 'ادامهٔ ماجراجویی' }).click();
  await page.keyboard.down('d');
  await expect.poll(async () => (await playerPosition(page)).x).toBeGreaterThan(still.x + 0.4);
  await page.keyboard.up('d');
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  await expect(page.getByLabel('سرعت حرکت')).toBeVisible();
  await page.getByLabel('نمایش محدودهٔ برخورد').check();
  await page.getByLabel('نمایش محدودهٔ برخورد').uncheck();
  await page.getByRole('button', { name: 'بازگشت به نقطهٔ شروع' }).click();
  await expect.poll(async () => (await playerPosition(page)).x).toBeCloseTo(0, 1);
  await expect.poll(async () => (await playerPosition(page)).z).toBeCloseTo(2.2, 1);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'artifacts/react-quest-desktop.png' });
});

test('blocks the solid house walls and clears input on focus loss', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.keyboard.down('s');
  await page.waitForTimeout(4500);
  await page.keyboard.up('s');
  const wall = await playerPosition(page);
  expect(wall.x).toBeLessThan(4.7);
  expect(wall.z).toBeLessThan(4.7);
  expect(wall.z).toBeGreaterThan(4.5);
  await page.keyboard.down('a');
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.waitForTimeout(300);
  const lostFocus = await playerPosition(page);
  await page.waitForTimeout(600);
  const after = await playerPosition(page);
  expect(after.x).toBeCloseTo(lostFocus.x, 1);
  expect(after.z).toBeCloseTo(lostFocus.z, 1);
  await page.keyboard.up('a');
  await page.screenshot({ path: 'artifacts/react-quest-wall.png' });
});

test('keeps controls accessible at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('button', { name: 'تنظیمات', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تنظیمات', exact: true }).click();
  const panel = page.getByRole('region', { name: 'تنظیمات بازی' });
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'بستن تنظیمات' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'توقف بازی' }).click();
  await expect(page.getByRole('button', { name: 'ادامهٔ ماجراجویی' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/react-quest-mobile.png' });
});
