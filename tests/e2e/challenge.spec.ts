import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// 綜合挑戰（ADR-0032）；e2e 使用含草稿的建置
const KEY = 'ecologic:v1';
type Item = { id: string; answer: string; control: boolean };

const items = async (page: Page): Promise<Item[]> =>
  JSON.parse((await page.locator('[data-challenge]').getAttribute('data-items')) ?? '[]');

const currentId = async (page: Page) =>
  (await page.locator('[data-question]:visible').getAttribute('data-question')) ?? '';

/** 目前這題選正解，或選一個錯的答案 */
async function choose(page: Page, correct: boolean) {
  const id = await currentId(page);
  const item = (await items(page)).find((i) => i.id === id);
  const question = page.locator(`[data-question="${id}"]`);
  const value = `[value="${item?.answer}"]`;
  if (correct) await question.locator(`input${value}`).check();
  else await question.locator(`input[type="radio"]:not(${value})`).first().check();
  return id;
}

async function answerAll(page: Page, correct: boolean) {
  const ids: string[] = [];
  for (let i = 1; i <= 5; i++) {
    await expect(page.locator('[data-challenge-progress]')).toHaveText(`第 ${i}／5 題`);
    ids.push(await choose(page, correct));
    // 作答中不公布對錯
    await expect(page.getByText('判讀正確')).toBeHidden();
    await expect(page.getByText('換個角度看看')).toBeHidden();
    if (i < 5) await page.getByRole('button', { name: '下一題' }).click();
  }
  await page.getByRole('button', { name: '全部送出' }).click();
  return ids;
}

test.describe('綜合挑戰（ADR-0032）', () => {
  test('a full round shows only the count and a per-question review', async ({ page }) => {
    await page.goto('/challenge/');
    await page.getByRole('button', { name: '開始' }).click();
    const all = await items(page);
    const ids = await answerAll(page, true);

    // 恰好 1 題對照題，題目不重複
    expect(new Set(ids).size).toBe(5);
    expect(ids.filter((id) => all.find((i) => i.id === id)?.control)).toHaveLength(1);

    const result = page.locator('[data-challenge-result]');
    await expect(result).toBeVisible();
    await expect(result.locator('[data-challenge-count]')).toHaveText('這次答對 5 題（共 5 題）');
    await expect(result.locator('[data-review]:visible')).toHaveCount(5);
    await expect(result.locator('[data-review]:visible').first()).toContainText('你的判讀');
    // 不做判讀習慣、混淆配對與卡別表現，也不附評語
    await expect(result).not.toContainText('滿分');
    await expect(result).not.toContainText('擅長');

    // 與一般作答相同寫入進度，並點亮正解的圖鑑卡
    const stored = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY)) ?? '{}');
    for (const id of ids) expect(stored.answered[id]?.correct).toBe(true);
    const lit = all.find((i) => ids.includes(i.id) && !i.control);
    await page.goto('/me/');
    await expect(page.locator(`[data-entry-id="${lit?.answer}"]`)).toHaveClass(/is-lit/);
  });

  test('wrong answers are counted without judgement', async ({ page }) => {
    await page.goto('/challenge/');
    await page.getByRole('button', { name: '開始' }).click();
    await answerAll(page, false);
    await expect(page.locator('[data-challenge-count]')).toHaveText('這次答對 0 題（共 5 題）');
    await expect(page.locator('[data-review]:visible').first()).toContainText('換個角度看看');
  });

  test('asks for a choice before moving on, and keeps choices when going back', async ({
    page,
  }) => {
    await page.goto('/challenge/');
    await page.getByRole('button', { name: '開始' }).click();
    await page.getByRole('button', { name: '下一題' }).click();
    await expect(page.locator('[data-challenge-error]')).toBeVisible();
    await expect(page.locator('[data-challenge-progress]')).toHaveText('第 1／5 題');

    const first = await choose(page, true);
    await page.getByRole('button', { name: '下一題' }).click();
    await page.getByRole('button', { name: '上一題' }).click();
    await expect(page.locator(`[data-question="${first}"] input:checked`)).toHaveCount(1);
  });

  test('a reload resumes the challenge in progress', async ({ page }) => {
    await page.goto('/challenge/');
    await page.getByRole('button', { name: '開始' }).click();
    const first = await choose(page, true);
    await page.getByRole('button', { name: '下一題' }).click();
    await page.reload();
    await expect(page.locator('[data-challenge-progress]')).toHaveText('第 2／5 題');
    await page.getByRole('button', { name: '上一題' }).click();
    expect(await currentId(page)).toBe(first);
    await expect(page.locator(`[data-question="${first}"] input:checked`)).toHaveCount(1);
  });

  test('entry links on the home page and question lists', async ({ page }) => {
    for (const path of ['/', '/practice/daily/', '/practice/conservation/']) {
      await page.goto(path);
      await page.getByRole('link', { name: '綜合挑戰（5 題）' }).click();
      await expect(page).toHaveURL(/\/challenge\/$/);
    }
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`question and result views have no serious issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/challenge/');
      const scan = async () => {
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
          [],
        );
      };
      await page.getByRole('button', { name: '開始' }).click();
      await scan();
      await answerAll(page, false);
      await expect(page.locator('[data-challenge-result]')).toBeVisible();
      await scan();
    });
  }
});

test.describe('綜合挑戰：沒有 JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('explains that JavaScript is needed and links to the lists', async ({ page }) => {
    await page.goto('/challenge/');
    // getByText 不比對 <noscript> 內的文字，改用屬性定位
    await expect(page.locator('[data-challenge-nojs]')).toBeVisible();
    await expect(page.locator('[data-challenge-nojs]')).toContainText('綜合挑戰需要 JavaScript');
    await expect(page.getByRole('button', { name: '開始' })).toBeHidden();
    await expect(page.locator('[data-challenge-form]')).toBeHidden();
    await expect(page.locator('[data-challenge-nojs] a[href="/practice/daily/"]')).toBeVisible();
  });
});
