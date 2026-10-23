import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// 思想源流（ADR-0039）：e2e 以含草稿的建置執行，試行的兩則仍是草稿
test.describe('思想源流（ADR-0039）', () => {
  test('is collapsed at the bottom of the linked card and opens to three parts', async ({
    page,
  }) => {
    await page.goto('/guide/appeal-to-authority/');
    const section = page.locator('section.origins');
    await expect(section.getByRole('heading', { name: '思想源流' })).toBeVisible();
    const note = section.locator('[data-origin-id="kant-enlightenment"]');
    await expect(note).not.toHaveAttribute('open', '');
    await expect(note.getByRole('heading', { name: '原典怎麼說' })).toBeHidden();

    await section.locator('[data-origin-id="kant-enlightenment"] > summary').click();
    for (const heading of ['原典怎麼說', '和這張卡的關係', '常見誤讀']) {
      await expect(note.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(note).toContainText('Sapere aude');
    await expect(note.getByRole('link', { name: '訴諸武力' })).toHaveAttribute(
      'href',
      '/guide/appeal-to-force/',
    );
  });

  test('one note can sit under several cards; other cards show nothing', async ({ page }) => {
    await page.goto('/guide/objective-meaning/');
    await expect(page.locator('[data-origin-id="zhuangzi-happy-fish"]')).toBeVisible();
    await page.goto('/guide/straw-man/');
    await expect(page.locator('section.origins')).toHaveCount(0);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`opened note has no serious accessibility issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/guide/subjective-meaning/');
      await page.locator('[data-origin-id="zhuangzi-happy-fish"] > summary').click();
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});
