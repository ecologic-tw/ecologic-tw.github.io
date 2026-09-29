// 多方觀點情境（ADR-0036）：案例頁、小題頁的案例標示與導覽。
// 使用草稿案例 daily-case-01 與小題 daily-024（共同點）、daily-025（分歧）、daily-026（先問什麼）。
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const CASE = '/cases/daily-case-01/';
const submit = (page: Page) => page.getByRole('button', { name: '送出判讀' }).click();

async function answerAll(page: Page) {
  await page.goto('/scenario/daily-024/');
  await page.getByLabel('「巷子要讓救護車等緊急車輛開得進來。」').check();
  await submit(page);
  await page.goto('/scenario/daily-025/');
  const picks = {
    'parking-time': 'fact',
    'life-first': 'value',
    'which-corner': 'definition',
    'who-pays': 'interest',
  };
  for (const [id, kind] of Object.entries(picks)) {
    await page.locator(`[data-classify-item="${id}"] input[value="${kind}"]`).check();
  }
  await submit(page);
  await page.goto('/scenario/daily-026/');
  await page.getByLabel('「你到底贊不贊成畫紅線？」').check();
  await submit(page);
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

test.describe('案例頁', () => {
  test('shows the background, role cards and questions in order', async ({ page }) => {
    await page.goto(CASE);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('巷口要不要畫紅線');
    await expect(page.getByRole('heading', { name: '背景' })).toBeVisible();
    const roles = page.locator('.role-card');
    await expect(roles).toHaveCount(3);
    await expect(roles.first()).toHaveAttribute('open', '');
    await expect(roles.first()).toContainText('容易被誤解的地方');
    await expect(page.locator('.questions li')).toHaveText([
      /巷口紅線：大家都同意什麼/,
      /巷口紅線：分歧在哪裡/,
      /巷口紅線：先問老吳什麼/,
    ]);
    // 預設是基礎模式：提醒小題屬於進階模式
    await expect(page.getByText('案例的小題屬於進階模式')).toBeVisible();
    // 收尾先收合，答完或從最後一題連回來才展開
    await expect(page.locator('[data-case-closing]')).not.toHaveAttribute('open', '');
    await expect(page.locator('[data-case-progress]')).toHaveText('已作答 0／3 題');
  });

  test('a role card can be collapsed', async ({ page }) => {
    await page.goto(CASE);
    const card = page.locator('.role-card').first();
    await card.locator('summary').click();
    await expect(card).not.toHaveAttribute('open', '');
    await expect(card.getByText('在意什麼')).toBeHidden();
  });

  test('after every question is answered, shows progress and opens the closing', async ({
    page,
  }) => {
    await answerAll(page);
    await page.goto(CASE);
    await expect(page.locator('[data-case-progress]')).toHaveText('已作答 3／3 題');
    await expect(page.locator('[data-case-closing]')).toHaveAttribute('open', '');
    await expect(page.getByRole('link', { name: /討論引導卡/ })).toBeVisible();
    await page.goto('/cases/');
    await expect(page.locator('[data-case-questions]')).toContainText('已作答 3／3 題');
  });

  test('is listed on /cases/ and linked from the practice page', async ({ page }) => {
    await page.goto('/practice/daily/');
    await page.getByRole('link', { name: '多方觀點情境' }).click();
    await expect(page).toHaveURL(/\/cases\/$/);
    await expect(page.getByText('3 位角色・3 題小題')).toBeVisible();
  });
});

test.describe('小題頁', () => {
  test('names the case and keeps the background at hand', async ({ page }) => {
    await page.goto('/scenario/daily-024/');
    await expect(page.locator('[data-case-link]')).toHaveText(
      '多方觀點：巷口要不要畫紅線（第 1／3 題）',
    );
    await expect(page.getByText('找出共同點')).toBeVisible();
    const context = page.locator('[data-case-context]');
    await expect(context).not.toHaveAttribute('open', '');
    await context.locator(':scope > summary').click();
    await expect(context.locator('.role-card')).toHaveCount(3);
  });

  test('next follows the case order, and the last question returns to the closing', async ({
    page,
  }) => {
    await page.goto('/scenario/daily-024/');
    await expect(page.locator('nav.next')).toContainText('下一題：巷口紅線：分歧在哪裡');
    await page.goto('/scenario/daily-026/');
    await expect(page.getByText('先問什麼', { exact: true })).toBeVisible();
    const back = page.locator('nav.next').getByRole('link', { name: '回到案例：換個位置想' });
    await expect(page.locator('nav.next')).not.toContainText('下一題');
    await back.click();
    await expect(page).toHaveURL(/\/cases\/daily-case-01\/#closing$/);
    await expect(page.locator('[data-case-closing]')).toHaveAttribute('open', '');
  });

  test('the practice list, next and random all leave case questions out', async ({ page }) => {
    await page.goto('/scenario/daily-023/');
    await expect(page.locator('nav.next')).not.toContainText('巷口紅線');
    await page.goto('/practice/daily/');
    const items = await page.locator('[data-random-scenario]').getAttribute('data-items');
    expect(items).not.toContain('daily-024');
    // 只從 /cases/ 進入（ADR-0036 §5，2026-09-29 修正）
    await expect(page.locator('[data-scenario-id="daily-024"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: '多方觀點情境' })).toBeVisible();
  });
});

test.describe('沒有 JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the case page is readable', async ({ page }) => {
    await page.goto(CASE);
    await expect(page.locator('.role-card').first()).toContainText('手上的依據');
    await expect(page.locator('.questions li')).toHaveCount(3);
    await expect(page.locator('[data-case-progress]')).toBeHidden();
    await page.locator('[data-case-closing] summary').click();
    await expect(page.getByText('可以怎麼問')).toBeVisible();
  });
});

test.describe('無障礙與手機', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`case and question pages have no serious issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(CASE);
      await page.locator('[data-case-closing] summary').click();
      expect(await seriousViolations(page)).toEqual([]);
      await page.goto('/scenario/daily-024/');
      await page.locator('[data-case-context] > summary').click();
      expect(await seriousViolations(page)).toEqual([]);
    });
  }

  test('fits a phone screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of [CASE, '/scenario/daily-024/']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
