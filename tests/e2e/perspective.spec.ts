import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// ADR-0029：「換個位置想」在作答後、解說之後出現；e2e 使用含草稿的建置
test.describe('換個位置想（ADR-0029）', () => {
  test('appears only after answering, after the explanation', async ({ page }) => {
    await page.goto('/scenario/cons-018/');
    const perspective = page.locator('[data-perspective]');
    await expect(perspective).toBeHidden();

    await page.getByLabel('稻草人謬誤').check();
    await page.getByRole('button', { name: '送出判讀' }).click();

    await expect(perspective).toBeVisible();
    await expect(perspective.getByRole('heading', { name: '換個位置想' })).toBeVisible();
    await expect(perspective).toContainText('理解不等於同意');
    await expect(perspective).toContainText('可以怎麼問');
  });

  test('pages without the section do not render it', async ({ page }) => {
    await page.goto('/scenario/daily-001/');
    await expect(page.locator('[data-perspective]')).toHaveCount(0);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`answered state has no serious issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/scenario/cons-018/');
      await page.getByLabel('稻草人謬誤').check();
      await page.getByRole('button', { name: '送出判讀' }).click();
      await expect(page.locator('[data-perspective]')).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});
