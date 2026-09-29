import { readFileSync, readdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const scenarioIds = readdirSync('src/content/scenarios/zh-TW')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));
// 多方觀點案例的小題不列在題目列表（ADR-0036 §5）
const listedIds = scenarioIds.filter(
  (id) => !/^case: /m.test(readFileSync(`src/content/scenarios/zh-TW/${id}.md`, 'utf8')),
);

const KEY = 'ecologic:v1';
const stored = (page: Page) => page.evaluate((k) => localStorage.getItem(k), KEY);

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

test.describe('作答流程（M2 驗收：e2e 走完一題）', () => {
  test('answer wrong: feedback in text, explanation and rewrite revealed, progress saved', async ({
    page,
  }) => {
    await page.goto('/scenario/daily-001/');
    await expect(page.locator('[data-quiz-reveal]')).toBeHidden();
    await expect(page.locator('[data-quiz-rewrite]')).toBeHidden();

    // 未選擇就送出 → 提示
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.getByText('先選一個判讀')).toBeVisible();

    await page.getByLabel('人身攻擊').check();
    await page.getByRole('button', { name: '送出判讀' }).click();

    const result = page.locator('[data-quiz-result]');
    await expect(result).toContainText('換個角度看看');
    await expect(result).toContainText('你的判讀：人身攻擊');
    await expect(result).toBeFocused();
    // 對錯不只靠顏色：選項上有文字標記
    await expect(page.locator('li[data-option-id="straw-man"]')).toContainText('正解');
    await expect(page.locator('li[data-option-id="ad-hominem"]')).toContainText('你的判讀');
    await expect(page.locator('[data-quiz-options] input').first()).toBeDisabled();

    await expect(page.locator('[data-quiz-reveal]')).toHaveAttribute('open', '');
    await expect(page.locator('[data-quiz-reveal]')).toContainText('稻草人謬誤');
    await expect(page.locator('[data-quiz-rewrite]')).toBeVisible();

    const saved = JSON.parse((await stored(page)) ?? '{}');
    expect(saved.answered['daily-001'].correct).toBe(false);
  });

  test('answer right, then self-check a rewrite counts once', async ({ page }) => {
    await page.goto('/scenario/daily-001/');
    await page.getByLabel('稻草人謬誤').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');

    await page.getByLabel('試著改寫看看', { exact: false }).fill('我的改寫');
    await page.locator('.checklist input').first().check();
    const reference = page.locator('[data-reference] summary');
    await reference.click();
    await expect(page.locator('[data-reference] li').first()).toBeVisible();
    await reference.click();
    await reference.click();

    const saved = JSON.parse((await stored(page)) ?? '{}');
    expect(saved.answered['daily-001'].correct).toBe(true);
    expect(saved.rewrites).toBe(1);
    // 改寫內容不儲存
    expect(await stored(page)).not.toContain('我的改寫');
  });

  test('control question accepts "沒有問題"', async ({ page }) => {
    await page.goto('/scenario/daily-004/');
    await page.getByLabel('沒有問題').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    await expect(page.locator('[data-quiz-reveal]')).toContainText('對照題');
  });

  test('options contain the answer and "沒有問題", each exactly once', async ({ page }) => {
    await page.goto('/scenario/cons-003/');
    const ids = await page
      .locator('[data-option-id]')
      .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.optionId));
    expect(ids).toContain('slippery-slope');
    expect(ids).toContain('none');
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('list page shows the answered status', async ({ page }) => {
    await page.goto('/scenario/daily-002/');
    await page.getByLabel('人身攻擊').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await page.goto('/practice/daily/');
    await expect(page.locator('[data-scenario-id="daily-002"] [data-status]')).toHaveText(/已答對/);
  });
});

test.describe('模式切換', () => {
  test('advanced items and explanations show only in advanced mode, and the choice persists', async ({
    page,
  }) => {
    await page.goto('/practice/daily/');
    const advancedItem = page.locator('[data-scenario-id="daily-010"]');
    await expect(advancedItem).toBeHidden();

    await page.getByText('進階', { exact: true }).first().click();
    await expect(advancedItem).toBeVisible();

    await page.goto('/scenario/daily-004/');
    await page.getByLabel('沒有問題').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.locator('.advanced-block')).toBeVisible();

    const saved = JSON.parse((await stored(page)) ?? '{}');
    expect(saved.mode).toBe('advanced');
  });

  test('still works when localStorage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
    await page.goto('/scenario/daily-001/');
    await page.getByLabel('稻草人謬誤').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
  });
});

test.describe('關閉 JavaScript 仍可閱讀情境與解說（NFR-07）', () => {
  test.use({ javaScriptEnabled: false });

  test('scenario, answer and explanation are readable', async ({ page }) => {
    await page.goto('/scenario/daily-001/');
    await expect(page.locator('.situation')).toContainText('小芳');
    await expect(page.locator('[data-quiz-form]')).toBeHidden();
    await page.getByText('看答案與解說').click();
    await expect(page.locator('[data-quiz-reveal]')).toContainText('稻草人謬誤');
    await expect(page.locator('[data-quiz-rewrite]')).toBeVisible();
  });

  test('practice list shows every question', async ({ page }) => {
    await page.goto('/practice/conservation/');
    const count = listedIds.filter((id) => id.startsWith('cons-')).length;
    await expect(page.locator('[data-scenario-id]')).toHaveCount(count);
  });
});

test.describe('axe：情境題相關頁面', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`practice and scenario pages (${scheme})`, async ({ page }) => {
      // 逐頁跑 axe 需要較長時間，平行執行時容易超過預設 30 秒
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const paths = [
        '/practice/daily/',
        '/practice/conservation/',
        ...scenarioIds.map((id) => `/scenario/${id}/`),
      ];
      const found: string[] = [];
      for (const path of paths) {
        await page.goto(path);
        for (const v of await seriousViolations(page)) found.push(`${path} ${v}`);
      }
      expect(found).toEqual([]);
    });
  }

  test('answered state has no serious issues', async ({ page }) => {
    await page.goto('/scenario/cons-001/');
    await page.getByLabel('沒有問題').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    expect(await seriousViolations(page)).toEqual([]);
  });
});

test.describe('結果框的下一題', () => {
  const nextInResult = (page: Page) =>
    page.locator('[data-quiz-next] a:visible', { hasText: '下一題' });

  test('appears after answering and skips advanced-only questions in basic mode', async ({
    page,
  }) => {
    await page.goto('/scenario/daily-012/');
    await expect(page.locator('[data-quiz-next]')).toBeHidden();
    await page.getByLabel('沒有問題').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(nextInResult(page)).toHaveCount(1);
    await expect(nextInResult(page)).toHaveAttribute('href', '/scenario/daily-015/');
  });

  test('goes to the very next question in advanced mode', async ({ page }) => {
    await page.goto('/scenario/daily-012/');
    await page.getByText('進階', { exact: true }).first().click();
    await page.getByLabel('沒有問題').check();
    await page.getByRole('button', { name: '送出判讀' }).click();
    await expect(nextInResult(page)).toHaveCount(1);
    await expect(nextInResult(page)).toHaveAttribute('href', '/scenario/daily-013/');
  });
});
