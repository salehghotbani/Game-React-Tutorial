import { expect, test, type Page } from '@playwright/test';
import { challenges } from '../../packages/challenges/src/index';

async function load(page: Page, completed = 0) {
  if (completed) await page.addInitScript(ids => {
    if (!localStorage.getItem('react-quest-progress-v1')) localStorage.setItem('react-quest-progress-v1', JSON.stringify({ version: 3, completedLessons: ids }));
  }, challenges.slice(0, completed).map(challenge => challenge.id));
  await page.goto('/');
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
}

async function go(page: Page, title: string) {
  await page.getByRole('button', { name: /اتاق زندهٔ تو/ }).click();
  await page.locator('.world-dock').getByRole('button', { name: `رفتن به ${title}`, exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 40000 });
}

async function position(page: Page) {
  const marker = page.getByTestId('player-marker');
  return { x: Number(await marker.getAttribute('data-player-x')), z: Number(await marker.getAttribute('data-player-z')) };
}

test('full-screen exploration uses server time, fades the guide, and offers real first-person movement', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  // Change the browser's calendar clock without replacing animation/input timers.
  await page.addInitScript(() => { Date.now = () => Date.parse('2040-01-01T00:00:00Z'); });
  const server = await (await page.request.get('/api/time')).json() as { timestamp: number };
  await load(page);
  await expect.poll(async () => Number(await page.getByTestId('server-clock').getAttribute('data-server-timestamp'))).toBeGreaterThanOrEqual(server.timestamp);
  expect(Number(await page.getByTestId('server-clock').getAttribute('data-server-timestamp')) - server.timestamp).toBeLessThan(30000);
  expect(await page.locator('canvas').boundingBox()).toMatchObject({ x: 0, y: 0, width: 1440, height: 1000 });
  await expect(page.locator('.topbar,.journey-card,.world-learning-card')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'رفتن به کامپیوتر · آموزش React', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'راهنمای کنترل' })).toBeVisible();
  const start = await position(page);
  await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).z, { timeout: 15000 }).toBeLessThan(start.z - 0.4);
  await page.keyboard.up('w');
  await expect(page.locator('.movement-guide')).toHaveCSS('opacity', '0');
  await page.getByRole('button', { name: 'تغییر به اول‌شخص', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-camera-view', 'firstPerson');
  await page.mouse.move(700, 450); await page.mouse.down(); await page.mouse.move(870, 450, { steps: 8 }); await page.mouse.up();
  const before = await position(page);
  await page.keyboard.down('w');
  await expect.poll(async () => (await position(page)).x, { timeout: 15000 }).toBeGreaterThan(before.x + 0.35);
  await page.keyboard.up('w');
  await page.screenshot({ path: 'artifacts/neighborhood-first-person.png' });
  await page.reload(); await expect(page.locator('main')).toHaveAttribute('data-camera-view', 'firstPerson');
  await page.getByRole('button', { name: 'تغییر به سوم‌شخص', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-camera-view', 'thirdPerson');
  expect(errors).toEqual([]);
});

test('walks through the yard and street, talks to a child, and enforces the game-net XP gate', async ({ page }) => {
  test.setTimeout(120000);
  await load(page);
  await go(page, 'حیاط خانه');
  expect((await position(page)).z).toBeGreaterThan(7);
  await page.getByRole('button', { name: 'گفتگو با نیما · کودک', exact: true }).click();
  await expect(page.locator('.neighbor-speech')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.neighbor-speech')).toContainText(/سلام همسایه|بازی کنیم/);
  await page.screenshot({ path: 'artifacts/neighborhood-neighbor.png' });
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 15000 });
  await go(page, 'کوچهٔ یادگیری');
  expect((await position(page)).z).toBeGreaterThan(14);
  await page.screenshot({ path: 'artifacts/neighborhood-street.png' });
  await go(page, 'گیم‌نت محله');
  await expect(page.locator('main')).toHaveAttribute('data-world-area', 'گیم‌نت محله');
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.room-toast')).toContainText('1000 XP لازم داری');
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'explore');
});

test('physically sits on the sofa to read React and returns to the approach', async ({ page }) => {
  test.setTimeout(90000);
  await load(page);
  await go(page, 'مطالعه روی مبل');
  const before = await position(page);
  await page.locator('.interaction-prompt').click();
  await expect(page.getByRole('dialog', { name: 'کتابخانهٔ اتاق' })).toBeVisible({ timeout: 15000 });
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'readingOnSofa');
  expect((await position(page)).x).toBeCloseTo(-3.95, 1);
  await page.getByRole('button', { name: 'ورق بعدی ←', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'تگ چیست؟ عنوان و متن روی صفحه', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'بستن کتابخانهٔ اتاق', exact: true }).click();
  await expect.poll(async () => (await position(page)).x).toBeCloseTo(before.x, 1);
  await expect.poll(async () => (await position(page)).z).toBeCloseTo(before.z, 1);
});

test('earned XP opens a three-minute game-net session that expires even while paused', async ({ page }) => {
  test.setTimeout(120000);
  await load(page, 5);
  await expect(page.getByTestId('room-xp')).toHaveText('1000');
  await go(page, 'گیم‌نت محله');
  const before = await position(page);
  await page.locator('.interaction-prompt').click();
  await expect(page.getByRole('region', { name: 'بازی Bug Hunter' })).toBeVisible();
  await page.clock.install();
  await page.getByRole('button', { name: 'شروع بازی', exact: true }).click();
  await expect(page.getByRole('timer')).toContainText('3:00');
  await page.getByRole('button', { name: 'توقف', exact: true }).click();
  await page.clock.fastForward(120000);
  await expect(page.getByRole('timer')).toContainText('1:00');
  await page.clock.fastForward(61000);
  await expect(page.getByRole('region', { name: 'پایان نوبت گیم‌نت' })).toBeVisible();
  await page.getByRole('button', { name: 'بازگشت به محله', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'explore');
  expect((await position(page)).x).toBeCloseTo(before.x, 1);
  await expect(page.getByTestId('room-xp')).toHaveText('1000');
});

test('mobile touch movement and camera choice stay accessible without horizontal overflow', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page);
  expect(await page.locator('canvas').boundingBox()).toMatchObject({ x: 0, y: 0, width: 390, height: 844 });
  await page.getByRole('button', { name: 'تغییر به اول‌شخص', exact: true }).click();
  const before = await position(page);
  const button = await page.getByRole('button', { name: 'حرکت به جلو', exact: true }).boundingBox();
  await page.mouse.move(button!.x + 12, button!.y + 12); await page.mouse.down();
  await expect.poll(async () => (await position(page)).z).toBeLessThan(before.z - 0.25);
  await page.mouse.up();
  await expect(page.locator('.movement-guide')).toHaveCSS('opacity', '0');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'artifacts/neighborhood-mobile.png' });
});
