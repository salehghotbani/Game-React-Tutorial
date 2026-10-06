import { devices, expect, test, type Page } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

async function position(page: Page) {
  const marker = page.getByTestId('player-marker');
  return { x: Number(await marker.getAttribute('data-player-x')), z: Number(await marker.getAttribute('data-player-z')), y: Number(await marker.getAttribute('data-player-y')) };
}
async function controlsClear(page: Page) {
  const dock = (await page.locator('.world-dock').boundingBox())!;
  for (const selector of ['.touch-joystick', '.touch-actions']) {
    expect(dock.y + dock.height).toBeLessThanOrEqual((await page.locator(selector).boundingBox())!.y);
  }
}

for (const language of ['fa', 'en'] as const) {
  test(`Android joystick supports diagonal movement, multiple fingers and release in ${language}`, async ({ page, context }) => {
    test.setTimeout(120000);
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(lang => {
      localStorage.setItem('react-quest-language-v1', lang);
      localStorage.setItem('react-quest-theme-v1', 'light');
    }, language);
    await page.route('**/api/time', route => route.fulfill({ json: { timestamp: Date.parse('2026-10-04T08:30:00Z'), timeZone: 'Asia/Tehran' } }));
    await page.goto('/');
    await expect(page.getByTestId('player-marker')).toBeVisible({ timeout: 30000 });
    const joystick = page.getByRole('button', { name: language === 'fa' ? 'جوی‌استیک حرکت' : 'Movement joystick', exact: true });
    await expect(joystick).toBeVisible();
    await expect(joystick).toHaveCSS('border-radius', '50%');
    await expect(page.locator('.touch-movement')).toHaveCSS('direction', 'ltr');
    await page.locator('.room-dock-toggle').click();
    await page.locator('.world-dock').getByRole('button', { name: language === 'fa' ? 'رفتن به حیاط خانه' : 'Go to Home courtyard', exact: true }).click();
    await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 40000 });
    await page.getByRole('button', { name: language === 'fa' ? 'تغییر به اول‌شخص' : 'Switch to first person', exact: true }).click();
    await expect.poll(async () => (await position(page)).y).toBeCloseTo(0.925, 1);
    const session = await context.newCDPSession(page);
    const bounds = (await joystick.boundingBox())!;
    const center = { id: 1, x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    const stick = { ...center, x: center.x + 70, y: center.y - 70 };
    const before = await position(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [center] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [stick] });
    await expect.poll(async () => (await position(page)).x).toBeGreaterThan(before.x + 0.2);
    await expect.poll(async () => (await position(page)).z).toBeLessThan(before.z - 0.2);
    const jump = page.getByRole('button', { name: language === 'fa' ? 'پرش' : 'Jump', exact: true });
    const jumpBounds = (await jump.boundingBox())!;
    const jumpPoint = { id: 2, x: jumpBounds.x + jumpBounds.width / 2, y: jumpBounds.y + jumpBounds.height / 2 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [stick, jumpPoint] });
    await expect.poll(async () => (await position(page)).y, { intervals: [50] }).toBeGreaterThan(1.2);
    await expect(joystick).toHaveClass(/active/);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [jumpPoint] });
    await expect(jump).toHaveAttribute('aria-pressed', 'false');
    await expect(joystick).toHaveClass(/active/);
    const sprint = page.getByRole('button', { name: language === 'fa' ? 'دویدن' : 'Run', exact: true });
    const sprintBounds = (await sprint.boundingBox())!;
    const sprintPoint = { id: 3, x: sprintBounds.x + sprintBounds.width / 2, y: sprintBounds.y + sprintBounds.height / 2 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [stick, sprintPoint] });
    await expect(sprint).toHaveAttribute('aria-pressed', 'true');
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await expect(sprint).toHaveAttribute('aria-pressed', 'false');
    await expect(joystick).not.toHaveClass(/active/);
    await expect.poll(async () => (await position(page)).y).toBeCloseTo(0.925, 1);
    await page.waitForTimeout(500);
    const stopped = await position(page);
    await page.waitForTimeout(500);
    const after = await position(page);
    expect(Math.hypot(after.x - stopped.x, after.z - stopped.z)).toBeLessThan(0.08);

    // Leaving exploration while a finger is held must not resume movement on return.
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [center] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...center, y: center.y - 44 }] });
    await page.getByRole('button', { name: language === 'fa' ? 'تنظیمات' : 'Settings', exact: true }).click();
    await expect(joystick).toHaveCount(0);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const selector = page.getByRole('combobox', { name: language === 'fa' ? 'زبان سایت' : 'Site language', exact: true });
    const next = language === 'fa' ? 'en' : 'fa';
    await selector.selectOption(next);
    await expect(page.locator('html')).toHaveAttribute('dir', next === 'fa' ? 'rtl' : 'ltr');
    await page.getByRole('button', { name: next === 'fa' ? 'بستن تنظیمات' : 'Close settings', exact: true }).click();
    await page.waitForTimeout(500);
    const resumed = await position(page);
    await page.waitForTimeout(500);
    expect(Math.hypot((await position(page)).x - resumed.x, (await position(page)).z - resumed.z)).toBeLessThan(0.08);
    const control = page.locator('.touch-joystick');
    expect((await control.boundingBox())!.x).toBeLessThan(page.viewportSize()!.width / 2);
    await controlsClear(page);
    await page.screenshot({ path: `artifacts/android-joystick-${next}-portrait.png` });
    await page.setViewportSize({ width: 915, height: 412 });
    await expect(control).toBeVisible();
    for (const element of [control, page.locator('.touch-actions'), page.locator('.world-dock')]) {
      const rect = (await element.boundingBox())!;
      expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(915); expect(rect.y + rect.height).toBeLessThanOrEqual(412);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(915);
    await controlsClear(page);
    await page.locator('.room-dock-toggle').click();
    await controlsClear(page);
    await expect(page.locator('#world-destinations')).toBeVisible();
    await page.locator('.room-dock-toggle').click();
    await page.screenshot({ path: `artifacts/android-joystick-${next}-landscape.png` });
    expect(errors).toEqual([]);
  });
}
