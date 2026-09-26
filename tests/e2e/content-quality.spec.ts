import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('source bibliography and scope remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/guide/law-of-identity/');
  await page.getByText('參考資料', { exact: true }).click();
  const sources = page.locator('details.sources');
  await expect(sources.locator('a').first()).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(sources.locator('[aria-label="引用範圍"]')).not.toHaveCount(0);
  await page.goto('/terms/');
  await expect(page.locator('#premise details.sources')).toHaveCount(1);
  await context.close();
});

test('scenario sources stay inside the answer reveal', async ({ page }) => {
  await page.goto('/scenario/cons-008/');
  const sources = page.locator('[data-quiz-reveal] details.sources');
  await expect(sources).toHaveCount(1);
  await expect(sources).not.toBeVisible();
  await page.locator('input[name="choice"][value="none"]').check();
  await page.locator('[data-quiz-form] button[type="submit"]').click();
  await expect(sources).toBeVisible();
});

test('metadata uses official canonical URLs and draft previews are not indexed', async ({
  page,
  request,
}) => {
  await page.goto('/guide/law-of-identity/?mode=advanced');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://ecologic-tw.github.io/guide/law-of-identity/',
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://ecologic-tw.github.io/guide/law-of-identity/',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  expect((await request.get('/social-card.png')).ok()).toBeTruthy();
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<loc>');
});

test('expanded sources fit a mobile screen and remain accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guide/law-of-identity/');
  const sources = page.locator('details.sources');
  await sources.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(sources).toHaveAttribute('open', '');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  const result = await new AxeBuilder({ page }).include('details.sources').analyze();
  expect(result.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual(
    [],
  );
  await sources.screenshot({ path: 'test-results/sources-mobile.png' });
});
