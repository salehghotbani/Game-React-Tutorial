import { expect, test, type Page } from '@playwright/test';
import { challenges } from '../../packages/challenges/src';

test.use({ storageState: { cookies: [], origins: [] } });

async function load(page: Page, earned = false) {
  await page.addInitScript(ids => {
    if (window !== window.top) return;
    localStorage.setItem('react-quest-language-v1', 'en');
    localStorage.setItem('react-quest-theme-v1', 'light');
    if (ids.length && !localStorage.getItem('react-quest-progress-v1')) localStorage.setItem('react-quest-progress-v1', JSON.stringify({ version: 1, completedLessons: ids }));
  }, earned ? challenges.map(challenge => challenge.id) : []);
  await page.route('**/api/time', route => route.fulfill({ json: { timestamp: Date.parse('2026-10-06T08:30:00Z') } }));
  await page.goto('/');
  await expect(page.getByTestId('player-marker')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.scene-loading')).toHaveCount(0, { timeout: 30000 });
}

async function go(page: Page, name: string) {
  await page.locator('.room-dock-toggle').click();
  await page.locator('.world-dock').getByRole('button', { name: `Go to ${name}`, exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 60000 });
}

async function car(page: Page) {
  const marker = page.getByTestId('car-marker');
  return { x: Number(await marker.getAttribute('data-car-x')), z: Number(await marker.getAttribute('data-car-z')), y: Number(await marker.getAttribute('data-car-y')), yaw: Number(await marker.getAttribute('data-car-yaw')), speed: Number(await marker.getAttribute('data-car-speed')) };
}

async function player(page: Page) {
  const marker = page.getByTestId('player-marker');
  return { x: Number(await marker.getAttribute('data-player-x')), z: Number(await marker.getAttribute('data-player-z')), y: Number(await marker.getAttribute('data-player-y')) };
}

test('expanded field stays walkable and a new learner cannot drive before earning XP', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await load(page);
  await go(page, 'Car');
  await expect(page.locator('.interaction-prompt')).toContainText('2000 XP');
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.room-toast')).toContainText('2000 XP');
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'explore');
  await expect(page.getByTestId('room-xp')).toHaveText('0');
  await page.screenshot({ path: 'artifacts/landscape-car-locked.png' });
  await go(page, 'Sunshine meadow');
  await expect.poll(async () => (await player(page)).x).toBeLessThan(-31);
  await expect.poll(async () => (await player(page)).z).toBeLessThan(-17);
  expect((await player(page)).y).toBeGreaterThan(0.8);
  await page.getByRole('button', { name: 'Switch to first person', exact: true }).click();
  await page.mouse.move(650, 450); await page.mouse.down(); await page.mouse.move(650, 350, { steps: 8 }); await page.mouse.up();
  await page.screenshot({ path: 'artifacts/landscape-meadow-mountains.png' });
  await go(page, 'Learning computer');
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.teaching-screen')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.monaco-editor,.knowledge-questions')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('earned XP permits driving, braking, both cameras, safe exit and mobile controls without spending XP', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await load(page, true);
  const xp = await page.getByTestId('room-xp').innerText();
  expect(Number(xp)).toBeGreaterThanOrEqual(2000);
  await go(page, 'Car');
  await expect(page.locator('.interaction-prompt')).toContainText('Get in and drive');
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'driving');
  const start = await car(page);
  await page.keyboard.down('w');
  await expect.poll(async () => (await car(page)).z, { timeout: 15000 }).toBeGreaterThan(start.z + 5);
  await page.keyboard.up('w'); await page.keyboard.down('Space');
  await expect.poll(async () => Math.abs((await car(page)).speed)).toBeLessThan(0.05);
  await page.keyboard.up('Space');
  await page.waitForTimeout(1000);
  expect((await car(page)).y).toBeGreaterThan(0.7);
  await page.screenshot({ path: 'artifacts/landscape-driving-third-person.png' });
  await page.getByRole('button', { name: 'Switch to first person', exact: true }).click();
  await expect(page.locator('main')).toHaveAttribute('data-camera-view', 'firstPerson');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/landscape-driving-first-person.png' });
  await page.keyboard.down('w'); await page.keyboard.down('a');
  await expect.poll(async () => Math.abs((await car(page)).yaw - start.yaw), { timeout: 15000 }).toBeGreaterThan(0.15);
  await page.keyboard.up('a'); await page.keyboard.up('w');
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause-overlay')).toBeVisible();
  await expect.poll(async () => Math.abs((await car(page)).speed)).toBeLessThan(0.05);
  const paused = await car(page);
  await page.keyboard.down('w'); await page.waitForTimeout(500); await page.keyboard.up('w');
  expect((await car(page)).z).toBeCloseTo(paused.z, 2);
  await page.getByRole('button', { name: 'Continue exploring', exact: true }).click();
  await page.keyboard.press('e');
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'explore');
  await expect.poll(async () => { const p = await player(page), c = await car(page); return Math.hypot(p.x - c.x, p.z - c.z); }).toBeGreaterThan(1.2);
  await expect.poll(async () => (await player(page)).y).toBeGreaterThan(0.8);
  await expect(page.getByTestId('room-xp')).toHaveText(xp);
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'driving');
  await page.setViewportSize({ width: 390, height: 844 });
  const accelerator = await page.getByRole('button', { name: 'Accelerate', exact: true }).boundingBox();
  await page.mouse.move(accelerator!.x + 15, accelerator!.y + 15); await page.mouse.down();
  await expect.poll(async () => Math.abs((await car(page)).speed), { timeout: 15000 }).toBeGreaterThan(1);
  await page.mouse.up();
  const brake = await page.getByRole('button', { name: 'Brake', exact: true }).boundingBox();
  await page.mouse.move(brake!.x + 15, brake!.y + 15); await page.mouse.down();
  await expect.poll(async () => Math.abs((await car(page)).speed)).toBeLessThan(0.05);
  await page.mouse.up();
  expect((await car(page)).y).toBeGreaterThan(0.7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'artifacts/landscape-driving-mobile.png' });
  await page.locator('.driving-hud').getByRole('button', { name: /Get out/ }).click();
  await expect(page.locator('main')).toHaveAttribute('data-game-mode', 'explore');
  await page.reload();
  await expect(page.getByTestId('room-xp')).toHaveText(xp);
  await go(page, 'Learning computer');
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.computer-screen')).toBeVisible({ timeout: 30000 });
  expect(errors).toEqual([]);
});
