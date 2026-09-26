import { readdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const entryIds = readdirSync('src/content/entries/zh-TW')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

const pages = ['/', '/guide/', '/terms/', ...entryIds.map((id) => `/guide/${id}/`)];

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

test.describe('axe：無嚴重無障礙問題（M1 驗收）', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`all pages (${scheme})`, async ({ page }) => {
      // 逐頁跑 axe 需要較長時間，平行執行時容易超過預設 30 秒
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const found: string[] = [];
      for (const path of pages) {
        await page.goto(path);
        for (const v of await seriousViolations(page)) found.push(`${path} ${v}`);
      }
      expect(found).toEqual([]);
    });
  }

  test('open popover has no serious issues', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    await page.locator('.term-trigger').first().click();
    expect(await seriousViolations(page)).toEqual([]);
  });
});

test.describe('名詞 popover 鍵盤操作（M1 驗收）', () => {
  test('Tab to a term, Enter opens, Escape closes and returns focus', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    const trigger = page.locator('.term-trigger').first();
    const popover = page.locator('.term-popover').first();

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(popover).toBeVisible();
    await expect(popover).toContainText('條件句');

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('close button inside the popover closes it', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    await page.locator('.term-trigger').first().click();
    const popover = page.locator('.term-popover').first();
    await popover.getByRole('button', { name: '關閉' }).click();
    await expect(popover).toBeHidden();
  });

  test('"看名詞表" leads to the term on /terms/', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    await page.locator('.term-trigger').first().click();
    await page.locator('.term-popover').first().getByRole('link', { name: '看名詞表' }).click();
    await expect(page).toHaveURL(/\/terms\/#conditional$/);
    await expect(page.locator('#conditional')).toBeVisible();
  });
});

test.describe('關閉 JavaScript 仍可閱讀（M1 驗收）', () => {
  test.use({ javaScriptEnabled: false });

  test('guide lists every card and hides the filter', async ({ page }) => {
    await page.goto('/guide/');
    await expect(page.locator('[data-filter-item]')).toHaveCount(entryIds.length);
    await expect(page.locator('[data-filter-field]')).toBeHidden();
  });

  test('card body, advanced section and popover work without JS', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    await expect(page.getByRole('heading', { name: '說明' })).toBeVisible();
    await page.getByText('進階', { exact: true }).last().click();
    await expect(page.locator('details.advanced').last()).toHaveAttribute('open', '');
    await page.locator('.term-trigger').first().click();
    await expect(page.locator('.term-popover').first()).toBeVisible();
  });

  test('terms page lists definitions', async ({ page }) => {
    await page.goto('/terms/');
    await expect(page.locator('#premise dd')).toContainText('支持結論');
  });
});

test.describe('列表篩選', () => {
  test('filters the guide and shows an empty message when nothing matches', async ({ page }) => {
    await page.goto('/guide/');
    const input = page.getByLabel('篩選');
    await input.fill('稻草');
    await expect(page.locator('[data-filter-item]:visible')).toHaveCount(1);
    await expect(page.locator('[data-filter-item]:visible')).toContainText('稻草人謬誤');

    await input.fill('zzzz');
    await expect(page.locator('[data-filter-item]:visible')).toHaveCount(0);
    await expect(page.getByText('沒有符合的項目')).toBeVisible();
  });
});
