// ADR-0022 第 2 階段：進階題型的作答頁。
// 使用草稿題：daily-013（multi）、daily-014（choice）、cons-014（validity-soundness）。
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const KEY = 'ecologic:v1';
const answered = async (page: Page, id: string) =>
  page.evaluate(([k, i]) => JSON.parse(localStorage.getItem(k) ?? '{}').answered?.[i], [
    KEY,
    id,
  ] as const);
const submit = (page: Page) => page.getByRole('button', { name: '送出判讀' }).click();
const option = (page: Page, id: string) => page.locator(`li[data-option-id="${id}"]`);

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

test.describe('multi：多重判讀', () => {
  test('marks every option with icon and text, and needs every answer', async ({ page }) => {
    await page.goto('/scenario/daily-013/');
    await expect(page.getByText('選出所有適用的，可能只有一個。')).toBeVisible();

    await submit(page);
    await expect(page.getByText('至少選一項，再送出。')).toBeVisible();

    await page.getByLabel('人身攻擊').check();
    await page.getByLabel('滑坡謬誤').check();
    await submit(page);

    const result = page.locator('[data-quiz-result]');
    await expect(result).toContainText('換個角度看看');
    await expect(result).toContainText('你的選擇：');
    await expect(result).toBeFocused();
    await expect(option(page, 'ad-hominem')).toContainText('正解，你選到了');
    await expect(option(page, 'false-dilemma')).toContainText('正解，這次沒選到');
    await expect(option(page, 'slippery-slope')).toContainText('這項不適用');
    await expect(option(page, 'straw-man')).toContainText('可接受');
    await expect(page.locator('[data-quiz-options] input').first()).toBeDisabled();

    const reveal = page.locator('[data-quiz-reveal]');
    await expect(reveal).toHaveAttribute('open', '');
    await expect(reveal.locator('.option-notes li')).toHaveCount(5);
    await expect(page.locator('[data-quiz-rewrite]')).toBeVisible();
    expect((await answered(page, 'daily-013')).correct).toBe(false);
  });

  test('acceptable options can be left out or chosen', async ({ page }) => {
    await page.goto('/scenario/daily-013/');
    await page.getByLabel('人身攻擊').check();
    await page.getByLabel('假兩難').check();
    await page.getByLabel('稻草人謬誤').check();
    await submit(page);
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    expect((await answered(page, 'daily-013')).correct).toBe(true);
  });

  test('a fully correct multi answer lights every answer card', async ({ page }) => {
    await page.goto('/scenario/daily-013/');
    await page.getByLabel('人身攻擊').check();
    await page.getByLabel('假兩難').check();
    await submit(page);
    await page.goto('/me/');
    await expect(page.locator('[data-entry-id="ad-hominem"]')).toHaveClass(/is-lit/);
    await expect(page.locator('[data-entry-id="false-dilemma"]')).toHaveClass(/is-lit/);
    await expect(page.locator('[data-entry-id="straw-man"]')).not.toHaveClass(/is-lit/);
  });
});

test.describe('validity-soundness：有效 × 健全', () => {
  test('needs both axes and marks each one', async ({ page }) => {
    await page.goto('/scenario/cons-014/');
    await page.getByLabel('有效', { exact: true }).check();
    await submit(page);
    await expect(page.getByText('兩個問題都要選，再送出。')).toBeVisible();

    await page.getByLabel('無法從題幹判斷').check();
    await submit(page);
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    await expect(page.locator('.axes')).toContainText('還不能說它健全');
    expect((await answered(page, 'cons-014')).correct).toBe(true);
  });

  test('one wrong axis is not fully correct', async ({ page }) => {
    await page.goto('/scenario/cons-014/');
    await page.getByLabel('有效', { exact: true }).check();
    await page.getByLabel('可信', { exact: true }).check();
    await submit(page);
    await expect(page.locator('[data-quiz-result]')).toContainText('換個角度看看');
    await expect(option(page, 'uncertain')).toContainText('正解');
    await expect(option(page, 'credible')).toContainText('你的判讀');
  });
});

test.describe('choice：隱藏前提', () => {
  test('shows the task, grades the choice and hides the optional rewrite', async ({ page }) => {
    await page.goto('/scenario/daily-014/');
    await expect(page.locator('[data-quiz-form] legend')).toContainText('找出沒說出口的前提');
    await page.getByLabel('好吃的店，評價一定高。').check();
    await submit(page);
    await expect(page.locator('[data-quiz-result]')).toContainText('換個角度看看');
    await expect(option(page, '0')).toContainText('正解');
    await expect(page.locator('[data-quiz-reveal] .option-notes li')).toHaveCount(3);
    await expect(page.locator('[data-quiz-rewrite]')).toHaveCount(0);
  });
});

test.describe('進階題型只在進階模式出現', () => {
  test('practice list hides them in basic mode', async ({ page }) => {
    await page.goto('/practice/daily/');
    await expect(page.locator('[data-scenario-id="daily-013"]')).toBeHidden();
    await page.getByText('進階', { exact: true }).first().click();
    await expect(page.locator('[data-scenario-id="daily-013"]')).toBeVisible();
  });
});

test.describe('關閉 JavaScript 仍可讀到答案與逐項解說', () => {
  test.use({ javaScriptEnabled: false });

  for (const [id, text] of [
    ['daily-013', '這段推理的問題'],
    ['daily-014', '正解：評價高的店，東西就好吃。'],
    ['cons-014', '所以這個論證'],
  ] as const) {
    test(id, async ({ page }) => {
      await page.goto(`/scenario/${id}/`);
      await expect(page.locator('[data-quiz-form]')).toBeHidden();
      await page.getByText('看答案與解說').click();
      await expect(page.locator('[data-quiz-reveal]')).toContainText(text);
    });
  }
});

test.describe('axe：作答後的進階題型', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`answered states have no serious issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const found: string[] = [];

      await page.goto('/scenario/daily-013/');
      await page.getByLabel('人身攻擊').check();
      await page.getByLabel('滑坡謬誤').check();
      await submit(page);
      found.push(...(await seriousViolations(page)));

      await page.goto('/scenario/cons-014/');
      await page.getByLabel('無效').check();
      await page.getByLabel('不可信').check();
      await submit(page);
      found.push(...(await seriousViolations(page)));

      await page.goto('/scenario/daily-014/');
      await page.getByLabel('這家店的價格很便宜。').check();
      await submit(page);
      found.push(...(await seriousViolations(page)));

      expect(found).toEqual([]);
    });
  }
});
