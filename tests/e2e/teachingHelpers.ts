import { expect, type Page } from '@playwright/test';

export async function openComputer(page: Page) {
  await expect(page.getByText('در حال آماده‌سازی اتاق…')).toBeHidden({ timeout: 30000 });
  await page.getByRole('button', { name: /اتاق زندهٔ تو/ }).click();
  await page.locator('.world-dock').getByRole('button', { name: 'رفتن به کامپیوتر یادگیری', exact: true }).click();
  await expect(page.locator('.room-destination')).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator('.interaction-prompt')).toContainText('استفاده از کامپیوتر');
  await page.locator('.interaction-prompt').click();
  await expect(page.getByRole('region', { name: 'محیط آموزش React' })).toBeVisible({ timeout: 30000 });
}

export async function finishLesson(page: Page) {
  await expect(page.getByRole('region', {name:'محیط آموزش React'})).toBeVisible({timeout:30000});
  for (let i = 0; i < 20; i++) {
    if (!await page.locator('.teaching-screen').count()) return;
    await page.getByTestId('lesson-next').click();
  }
  await expect(page.locator('.teaching-screen')).toBeHidden();
}
