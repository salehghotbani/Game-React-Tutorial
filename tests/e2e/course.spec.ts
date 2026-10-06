import { expect, test, type Page } from '@playwright/test';
import { chapters, getChapterLesson } from '../../packages/challenges/src';
import { chapterSupplements } from '../../packages/challenges/src/courseDetails';
import { translate, type Language } from '../../packages/localization/src';

test.use({ viewport: { width: 960, height: 640 }, actionTimeout: 15000 });
const text = (source: string, language: Language = 'fa') => translate(source, language);

async function openCourse(page: Page, language: Language = 'fa', resume = false) {
  await page.goto('/');
  await page.getByRole('button', { name: text('نقشهٔ دانش ↗', language), exact: true }).click();
  await page.getByRole('button', { name: text(resume ? 'ادامهٔ مطالعه ←' : 'کتابخانه', language), exact: true }).click();
  await expect(page.locator('.course-library')).toBeVisible();
}

async function chooseSection(page: Page, chapterId: number, stepId: string, language: Language = 'fa') {
  const chapter = chapters.find(item => item.id === chapterId)!;
  await page.getByRole('navigation', { name: text('فصل‌های آموزش', language), exact: true }).getByRole('button', { name: `${chapterId}. ${text(chapter.title, language)}`, exact: true }).click();
  const step = getChapterLesson(chapterId).steps.find(item => item.id === stepId)!;
  await page.getByRole('navigation', { name: text('بخش‌های این فصل', language), exact: true }).getByRole('button').filter({ hasText: text(step.title, language) }).click();
  await expect(page.locator(`[data-course-step="${stepId}"]`)).toBeVisible();
}

test('search and reading bookmarks allow a middle-course entry; self-checks do not award exercise credit', async ({ page }) => {
  await openCourse(page);
  const search = page.getByRole('searchbox', { name: 'جست‌وجوی درس، مفهوم یا کد' });
  await search.fill('موضوع ناموجود 12345');
  await expect(page.getByText('درسی با این عبارت پیدا نشد.')).toBeVisible();
  await search.fill('Redux');
  await page.locator('.course-search-results').getByRole('button').filter({ hasText: 'دو بخش رابط، یک Store' }).click();
  await expect(page.locator('[data-course-step="redux-demo"]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('react-quest-course-bookmark-v1')!))).toEqual({ chapterId: 9, stepId: 'redux-demo' });
  await openCourse(page, 'fa', true);
  await expect(page.locator('[data-course-step="redux-demo"]')).toBeVisible();
  const before = await page.evaluate(() => localStorage.getItem('react-quest-progress-v1'));
  await chooseSection(page, 9, 'state-owner');
  const check = page.locator('.lesson-checkpoint');
  await expect(check.getByRole('button', { name: 'بررسی درک من' })).toBeDisabled();
  await check.getByRole('radio').nth(0).check();
  await check.getByRole('button', { name: 'بررسی درک من' }).click();
  await expect(check.getByRole('status')).toContainText('دوباره به مفهوم فکر کن.');
  await check.getByRole('button', { name: 'دوباره امتحان کن' }).click();
  await check.getByRole('radio').nth(2).check();
  await check.getByRole('button', { name: 'بررسی درک من' }).click();
  await expect(check.getByRole('status')).toContainText('درست بود.');
  expect(await page.evaluate(() => localStorage.getItem('react-quest-progress-v1'))).toBe(before);
  await chooseSection(page, 14, 'final-contracts');
  await page.locator('.course-practice').getByRole('button', { name: 'آزمون ساخت: داشبورد هزینهٔ من', exact: true }).click();
  await expect(page.locator('.teaching-screen')).toHaveAttribute('data-lesson', 'build-budget');
  await page.locator('.teaching-path').getByRole('button').filter({ hasText: 'اجرای پروژه و مرور نهایی' }).click();
  await expect(page.locator('.teaching-article h1')).toHaveText('اجرای پروژه و مرور نهایی');
  await page.getByRole('button', { name: 'رفتن مستقیم به تمرین ←', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'ویرایشگر کد React' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('total-xp')).toHaveText('0');
});

for (const language of ['fa', 'en'] as const) test(`all new ${language} teaching examples execute actual React libraries and preserve isolated example storage`, async ({ page }) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  if (language === 'en') await page.addInitScript(() => { if (window === window.top) localStorage.setItem('react-quest-language-v1', 'en'); });
  await openCourse(page, language);
  for (const chapter of chapters) for (const step of chapterSupplements[chapter.id]!.filter(item => item.preview)) {
    await chooseSection(page, chapter.id, step.id, language);
    if (language === 'en') expect(await page.locator('.course-library').innerText()).not.toMatch(/[\u0600-\u06ff]/);
    await page.getByRole('button', { name: text('▶ اجرای نمونه', language), exact: true }).click();
    await expect(page.locator('.teaching-example > [role="status"]')).toHaveText(text('پیش‌نمایش آماده است.', language), { timeout: 30000 });
    const frame = page.frameLocator('.teaching-example iframe');
    await expect(frame.locator('html')).toHaveAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
    await expect(frame.locator('#root')).not.toBeEmpty();
    if (step.id === 'js-async') {
      await frame.getByRole('button', { name: text('بارگذاری', language), exact: true }).click();
      await expect(frame.locator('output')).toHaveText('Ada, Grace');
    }
    if (step.id === 'props-callback' || step.id === 'redux-demo') {
      await frame.getByRole('button', { name: 'Add 5', exact: true }).click();
      await expect(frame.locator('output')).toHaveText('5');
    }
    if (step.id === 'state-queue-demo') {
      await frame.getByRole('button', { name: 'Snapshot' }).click(); await expect(frame.locator('output')).toHaveText('1');
      await frame.getByRole('button', { name: 'Reset' }).click();
      await frame.getByRole('button', { name: 'Updater' }).click(); await expect(frame.locator('output')).toHaveText('2');
    }
    if (step.id === 'list-identity') {
      await frame.getByRole('textbox', { name: 'Hooks', exact: true }).fill('My edited book');
      await frame.getByRole('button', { name: 'Remove React', exact: true }).click();
      await expect(frame.getByRole('textbox', { name: 'Hooks', exact: true })).toHaveValue('My edited book');
    }
    if (step.id === 'form-validation') {
      await frame.getByRole('button', { name: 'Add', exact: true }).click(); await expect(frame.getByRole('alert')).toBeVisible();
      await frame.getByRole('textbox', { name: 'Title', exact: true }).fill('Notebook');
      await frame.getByRole('spinbutton', { name: 'Amount', exact: true }).fill('3');
      await frame.getByRole('button', { name: 'Add', exact: true }).click(); await expect(frame.locator('output')).toHaveText('3');
      await expect(frame.getByRole('alert')).toHaveCount(0);
    }
    if (step.id === 'hook-reuse-demo') {
      await frame.getByRole('button', { name: 'A: Off', exact: true }).click();
      await expect(frame.getByRole('button', { name: 'A: On', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(frame.getByRole('button', { name: 'B: Off', exact: true })).toHaveAttribute('aria-pressed', 'false');
      await frame.getByRole('button', { name: 'Focus', exact: true }).click(); await expect(frame.getByRole('textbox', { name: 'Note' })).toBeFocused();
    }
    if (step.id === 'api-retry' || step.id === 'query-weather-demo') {
      await expect(frame.locator('output')).toContainText('Tehran 24');
      await frame.getByRole('combobox', { name: 'City' }).selectOption('Error');
      await expect(frame.locator('output')).toContainText(step.id === 'api-retry' ? 'error' : 'Request failed');
      if (step.id === 'api-retry') await frame.getByRole('button', { name: 'Retry' }).click();
      await frame.getByRole('combobox', { name: 'City' }).selectOption('Shiraz');
      await expect(frame.locator('output')).toContainText('Shiraz 30');
    }
    if (step.id === 'router-params-demo') {
      await frame.getByRole('link', { name: 'React book', exact: true }).click(); await expect(frame.getByRole('heading')).toHaveText('Learning React');
      await frame.getByRole('link', { name: 'Unknown page', exact: true }).click(); await expect(frame.getByRole('heading')).toHaveText('Page not found');
    }
    if (step.id === 'query-mutation-demo') {
      await frame.getByRole('button', { name: 'Save +5', exact: true }).click(); await expect(frame.locator('output')).toHaveText('5');
      await frame.getByRole('button', { name: 'Save +5', exact: true }).click(); await expect(frame.locator('output')).toHaveText('10');
    }
    if (step.id === 'testing-demo') {
      await frame.getByRole('button', { name: 'Run test' }).click(); await expect(frame.getByRole('status')).toHaveText('Passed: initial value and click');
      await frame.getByRole('checkbox', { name: 'Broken' }).check();
      await frame.getByRole('button', { name: 'Run test' }).click(); await expect(frame.getByRole('status')).toHaveText('Failed: Expected 1 after click');
    }
    if (step.id === 'final-mini-project') {
      await frame.getByRole('textbox', { name: 'Goal', exact: true }).fill('My saved goal');
      await frame.getByRole('button', { name: 'Complete a step' }).click(); await expect(frame.locator('output')).toHaveText('1');
      await page.getByRole('button', { name: text('▶ اجرای نمونه', language), exact: true }).click();
      await expect(frame.getByRole('textbox', { name: 'Goal', exact: true })).toHaveValue('My saved goal');
      await expect(frame.locator('output')).toHaveText('1');
    }
    console.info(`[${language} teaching example] ${step.id}: PASS`);
  }
  expect(errors).toEqual([]);
});

for (const language of ['fa', 'en'] as const) test(`${language} course navigation and code remain readable on Android-sized screens`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  if (language === 'en') await page.addInitScript(() => { if (window === window.top) localStorage.setItem('react-quest-language-v1', 'en'); });
  await openCourse(page, language);
  await chooseSection(page, 12, 'testing-demo', language);
  await expect(page.locator('.course-library')).toHaveCSS('direction', language === 'fa' ? 'rtl' : 'ltr');
  await expect(page.locator('.teaching-step-content pre')).toHaveCSS('direction', 'ltr');
  expect(await page.locator('.learning-hub').evaluate(element => element.scrollWidth)).toBe(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: `artifacts/course-mobile-${language}.png` });
});
