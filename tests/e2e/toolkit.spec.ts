import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// 討論引導卡（ADR-0033）；e2e 使用含草稿的建置，正式建置不發布草稿（建置產物檢查把關）
const PATH = '/toolkit/discussion/';

test.describe('討論引導卡（ADR-0033）', () => {
  test('shows both sides with links to the guide cards', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole('heading', { level: 1, name: '討論引導卡' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '正面：回應之前' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '反面：分歧在哪裡' })).toBeVisible();
    await expect(page.getByText('這些是幫助理解的提問，不是讓對方同意的技巧')).toBeVisible();
    for (const id of ['straw-man', 'fallacy-fallacy', 'kinds-of-disagreement']) {
      await expect(page.locator(`.side a[href="/guide/${id}/"]`)).toBeVisible();
    }
    await expect(page.locator('.card-foot')).toContainText('CC BY-SA 4.0');
    await expect(page.getByRole('button', { name: '列印這張卡' })).toBeVisible();
  });

  test('is linked from the guide overview and the about page', async ({ page }) => {
    for (const path of ['/guide/', '/about/']) {
      await page.goto(path);
      await page.getByRole('link', { name: '討論引導卡（可列印）' }).click();
      await expect(page).toHaveURL(new RegExp(`${PATH}$`));
    }
  });

  test('print hides navigation and fits on two A4 pages', async ({ page }) => {
    await page.goto(PATH);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.site-footer')).toBeHidden();
    await expect(page.getByRole('button', { name: '列印這張卡' })).toBeHidden();
    await expect(page.locator('.side-back')).toBeVisible();
    await expect(page.locator('.card-foot')).toBeVisible();

    // 只在測試中產生 PDF 計算頁數，不進建置產物
    const pdf = (await page.pdf({ preferCSSPageSize: true })).toString('latin1');
    const pages = pdf.match(/\/Type\s*\/Page(?!s)/g) ?? [];
    // 正面一頁、反面一頁
    expect(pages).toHaveLength(2);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`has no serious accessibility issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(PATH);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});
