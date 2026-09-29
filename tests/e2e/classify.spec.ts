import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// 爭點地圖（ADR-0034）；e2e 使用含草稿的建置
const ANSWERS = {
  'trial-result': 'fact',
  'face-to-face': 'value',
  efficiency: 'definition',
  'office-cost': 'interest',
} as const;

async function answer(page: Page, picks: Partial<Record<keyof typeof ANSWERS, string>>) {
  for (const [id, kind] of Object.entries({ ...ANSWERS, ...picks })) {
    await page.locator(`[data-classify-item="${id}"] input[value="${kind}"]`).check();
  }
  await page.getByRole('button', { name: '送出判讀' }).click();
}

const item = (page: Page, id: string) => page.locator(`[data-classify-item="${id}"]`);

test.describe('爭點地圖（ADR-0034）', () => {
  test('all right: marks each statement and reveals the notes', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await expect(page.getByText('下面每一句，比較像哪一種分歧？')).toBeVisible();
    await answer(page, {});
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    await expect(item(page, 'trial-result').locator('.is-answer')).toContainText('✓ 正解');
    // 不顯示答對幾句
    await expect(page.locator('[data-result-choice]')).toHaveText('');
    await expect(page.getByRole('heading', { name: '各句的分歧種類' })).toBeVisible();
  });

  test('an acceptable alternative still counts as right', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await answer(page, { efficiency: 'value' });
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    await expect(item(page, 'efficiency').locator('.is-acceptable')).toContainText('△ 可接受');
    await expect(item(page, 'efficiency').locator('.is-answer')).toContainText('正解');
  });

  test('a wrong statement shows the answer without a score', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await answer(page, { 'office-cost': 'fact' });
    await expect(page.locator('[data-quiz-result]')).toContainText('換個角度看看');
    await expect(item(page, 'office-cost').locator('.is-wrong')).toContainText('✗ 你的選擇');
    await expect(item(page, 'office-cost').locator('.is-answer')).toContainText('正解');
    await expect(page.locator('[data-quiz-result]')).not.toContainText('句');
  });

  test('asks for every statement before submitting', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await page.locator('[data-classify-item="trial-result"] input[value="fact"]').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.getByText('每一句都選一種分歧，再送出。')).toBeVisible();
    await expect(page.locator('[data-quiz-result]')).toBeHidden();
  });

  test('shuffles the kinds for each statement', async ({ page }) => {
    // 固定亂數：Fisher–Yates 每次都和第一個交換 → 價值、定義、利益、事實
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
    await page.goto('/scenario/daily-023/');
    for (const id of Object.keys(ANSWERS)) {
      const order = await item(page, id)
        .locator('[data-option-id]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('data-option-id')));
      expect(order).toEqual(['value', 'definition', 'interest', 'fact']);
    }
  });

  test('a correct answer lights the kinds-of-disagreement card', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await answer(page, {});
    await page.goto('/me/');
    await expect(page.locator('[data-entry-id="kinds-of-disagreement"]')).toHaveClass(/is-lit/);
  });

  test('appears in basic mode; the conservation pilot is advanced only', async ({ page }) => {
    await page.goto('/practice/daily/');
    await expect(page.locator('[data-scenario-id="daily-023"]')).toBeVisible();
    await page.goto('/practice/conservation/');
    await expect(page.locator('[data-scenario-id="cons-022"]')).toHaveClass(/mode-advanced/);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`answered state has no serious issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/scenario/daily-023/');
      await answer(page, { efficiency: 'value', 'office-cost': 'fact' });
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});

test.describe('爭點地圖：沒有 JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('answers and notes are readable in the reveal', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await page.getByText('看答案與解說').click();
    await expect(page.getByRole('heading', { name: '各句的分歧種類' })).toBeVisible();
    await expect(page.locator('[data-quiz-reveal]')).toContainText('也可以接受價值分歧');
  });
});
