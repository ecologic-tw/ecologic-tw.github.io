import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/updates/（ADR-0024）', () => {
  test('is reachable from the footer and links to the feed', async ({ page }) => {
    await page.goto('/guide/');
    await page.getByRole('link', { name: '更新紀錄' }).click();
    await expect(page).toHaveURL(/\/updates\/$/);
    await expect(page.getByRole('heading', { level: 1, name: '更新紀錄' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'RSS／Atom 訂閱源' })).toHaveAttribute(
      'href',
      '/updates/feed.xml',
    );
    await expect(page.locator('link[rel="alternate"][type="application/atom+xml"]')).toHaveCount(1);
  });

  test('feed is served as Atom without draft content', async ({ request }) => {
    const res = await request.get('/updates/feed.xml');
    expect(res.ok()).toBe(true);
    const body = await res.text();
    expect(body).toContain('<feed xmlns="http://www.w3.org/2005/Atom"');
    // e2e 使用含草稿的建置，訂閱源必須是空的
    expect(body).not.toContain('<entry>');
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`has no serious accessibility issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/updates/');
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});
