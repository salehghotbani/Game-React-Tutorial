import { expect, test } from '@playwright/test';

test.skip(process.env.PLAYWRIGHT_STATIC_HOST !== 'true', 'Run against a static Pages build with its project subpath.');
test.use({ storageState: { cookies: [], origins: [] }, locale: 'fa-IR', timezoneId: 'Asia/Tehran' });

test('static project site loads assets, server clock and local grading without an API or isolation headers', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [], failedAssets: string[] = [], apiRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(process.env.PLAYWRIGHT_BASE_URL!) && response.status() >= 400) failedAssets.push(response.url());
  });
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  await page.route('https://api.country.is/', route => route.fulfill({ json: { country: 'DE' } }));
  // A wrong browser clock must not become the world clock.
  await page.addInitScript(() => { Date.now = () => 0; });
  const response = await page.goto('.'); expect(response?.status()).toBe(200);
  const serverTime = Date.parse(response!.headers()['date']!);
  expect(Number.isFinite(serverTime)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Choose Light theme', exact: true }).click();
  await expect(page.getByTestId('player-marker')).toBeVisible({ timeout: 30000 });
  await expect.poll(async () => Number(await page.getByTestId('server-clock').getAttribute('data-server-timestamp'))).toBeGreaterThan(serverTime - 2000);
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(false);
  expect(await page.locator('.brand-mark img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('.brand-mark img').getAttribute('src')).toContain('/site-icon.png');

  await page.locator('.room-dock-toggle').click();
  await page.locator('.world-dock').getByRole('button', { name: 'Go to Learning computer', exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 30000 });
  await page.locator('.interaction-prompt').click();
  await expect(page.locator('.teaching-article')).toContainText('React is a JavaScript library');
  await page.getByTestId('lesson-next').click();
  await page.getByRole('button', { name: '▶ Run example', exact: true }).click();
  await expect(page.frameLocator('iframe[title="React teaching example"]').getByRole('heading', { name: 'Hello, I am Sara' })).toBeVisible({ timeout: 30000 });
  for (let i = 0; i < 12 && await page.locator('.teaching-screen').count(); i++) await page.getByTestId('lesson-next').click();
  const editor = page.getByRole('textbox', { name: 'React code editor' }); await expect(editor).toBeVisible({ timeout: 30000 });
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText('export default function App(){return <main><h1>Learning on Pages</h1><p>My own greeting</p></main>;}');
  await page.locator('#runtime-kind').selectOption('auto');
  await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  await expect(page.getByTestId('total-xp')).toHaveText('200', { timeout: 30000 });
  await expect(page.frameLocator('iframe[title="React preview"]').getByRole('heading', { name: 'Learning on Pages' })).toBeVisible();
  await expect(page.locator('.runtime-status')).toContainText('cross-origin isolated');
  await page.screenshot({ path: 'artifacts/pages-learning.png' });
  await page.getByRole('button', { name: 'Back to room', exact: true }).click();
  await page.reload();
  await expect(page.getByTestId('room-xp')).toHaveText('200');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.locator('.settings-panel')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'artifacts/pages-mobile.png' });
  expect(apiRequests).toEqual([]); expect(failedAssets).toEqual([]); expect(errors).toEqual([]);
});
