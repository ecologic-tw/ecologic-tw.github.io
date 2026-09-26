import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const KEY = 'ecologic:v1';
const stored = async (page: Page) =>
  JSON.parse((await page.evaluate((k) => localStorage.getItem(k), KEY)) ?? 'null');

const answer = async (page: Page, id: string, label: string) => {
  await page.goto(`/scenario/${id}/`);
  await page.getByLabel(label, { exact: true }).check();
  await page.getByRole('button', { name: '送出判讀' }).click();
  await expect(page.locator('[data-quiz-result]')).toBeVisible();
};

const importFile = (page: Page, name: string, content: string) =>
  page.locator('[data-import]').setInputFiles({
    name,
    mimeType: 'application/json',
    buffer: Buffer.from(content),
  });

const validProgress = {
  version: 1,
  mode: 'basic',
  answered: { 'daily-001': { correct: true, at: '2026-09-26T00:00:00.000Z' } },
  rewrites: 0,
  collected: ['modus-ponens'],
  read: [],
  badges: [],
};

test.describe('卡內小檢核與收集', () => {
  test('wrong answers can be retried; the right one lights the card on /me/', async ({ page }) => {
    await page.goto('/guide/modus-ponens/');
    const box = page.locator('[data-quick-check]');
    await box.getByLabel('活動沒有改到室內').check();
    await box.getByRole('button', { name: '送出' }).click();
    await expect(box.locator('[data-qc-result]')).toContainText('再想想看');
    expect((await stored(page))?.collected ?? []).not.toContain('modus-ponens');

    await box.getByLabel('活動改到室內').check();
    await box.getByRole('button', { name: '送出' }).click();
    await expect(box.locator('[data-qc-result]')).toContainText('答對了');
    expect((await stored(page)).collected).toContain('modus-ponens');

    await page.goto('/me/');
    await expect(page.locator('[data-entry-id="modus-ponens"]')).toHaveClass(/is-lit/);
    await expect(page.locator('[data-entry-id="modus-ponens"]')).toContainText('已點亮');
  });

  test('a correct scenario answer lights its card and earns 初入步道', async ({ page }) => {
    await answer(page, 'daily-001', '稻草人謬誤');
    await page.goto('/me/');
    await expect(page.locator('[data-entry-id="straw-man"]')).toHaveClass(/is-lit/);
    await expect(page.locator('[data-lit-count]')).toHaveText(/^1／/);
    await expect(page.locator('[data-badge-id="first-step"]')).toContainText('已獲得');
    expect((await stored(page)).badges).toContain('first-step');
  });

  test('reading the fallacy-fallacy card to the end is recorded', async ({ page }) => {
    await page.goto('/guide/fallacy-fallacy/');
    await page.locator('[data-read-marker]').scrollIntoViewIfNeeded();
    await expect.poll(async () => (await stored(page))?.read ?? []).toContain('fallacy-fallacy');
  });
});

test.describe('匯出、匯入、清除（M3 驗收）', () => {
  test.beforeEach(async ({ page }) => {
    await answer(page, 'daily-002', '人身攻擊');
    await page.goto('/me/');
  });

  test('export downloads the stored progress as JSON', async ({ page }) => {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: '匯出進度檔' }).click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^ecologic-progress-\d{4}-\d{2}-\d{2}\.json$/);
    const content = JSON.parse(readFileSync((await file.path()) ?? '', 'utf8'));
    expect(content.answered['daily-002'].correct).toBe(true);
  });

  test('a valid file replaces progress after confirmation', async ({ page }) => {
    page.once('dialog', (d) => d.accept());
    await importFile(page, 'ok.json', JSON.stringify(validProgress));
    await expect(page.locator('[data-me-message]')).toHaveText('已匯入。');
    const saved = await stored(page);
    expect(Object.keys(saved.answered)).toEqual(['daily-001']);
    await expect(page.locator('[data-entry-id="modus-ponens"]')).toHaveClass(/is-lit/);
  });

  test('declining the confirmation keeps the current progress', async ({ page }) => {
    page.once('dialog', (d) => d.dismiss());
    await importFile(page, 'ok.json', JSON.stringify(validProgress));
    expect(Object.keys((await stored(page)).answered)).toEqual(['daily-002']);
  });

  test('rejects an oversized file without reading it', async ({ page }) => {
    const big = JSON.stringify({ ...validProgress, padding: 'x'.repeat(110 * 1024) });
    await importFile(page, 'big.json', big);
    await expect(page.locator('[data-me-message]')).toContainText('超過 100 KB');
    expect(Object.keys((await stored(page)).answered)).toEqual(['daily-002']);
  });

  test('rejects a non-JSON file', async ({ page }) => {
    await importFile(page, 'evil.json', '<script>alert(1)</script>');
    await expect(page.locator('[data-me-message]')).toContainText('不是有效的進度檔');
    expect(Object.keys((await stored(page)).answered)).toEqual(['daily-002']);
  });

  test('rejects a file with wrong types', async ({ page }) => {
    await importFile(page, 'bad.json', JSON.stringify({ ...validProgress, rewrites: 'lots' }));
    await expect(page.locator('[data-me-message]')).toContainText('不符合本站的進度格式');
    expect(Object.keys((await stored(page)).answered)).toEqual(['daily-002']);
  });

  test('drops unknown ids and never renders strings from the file', async ({ page }) => {
    let alerted = false;
    page.on('dialog', async (d) => {
      if (d.type() === 'alert') alerted = true;
      await d.accept();
    });
    const evil = {
      ...validProgress,
      answered: {
        ...validProgress.answered,
        '<img src=x onerror=alert(1)>': { correct: true, at: 't' },
      },
      collected: ['modus-ponens', '<b>injected</b>'],
      extra: '<img src=x onerror=alert(1)>',
    };
    await importFile(page, 'evil.json', JSON.stringify(evil));
    await expect(page.locator('[data-me-message]')).toContainText('已略過');
    await expect(page.locator('[data-me] img')).toHaveCount(0);
    await expect(page.locator('[data-me]')).not.toContainText('injected');
    expect(alerted).toBe(false);
    expect(JSON.stringify(await stored(page))).not.toMatch(/onerror|injected/);
  });

  test('clear removes everything after confirmation', async ({ page }) => {
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: '清除所有紀錄' }).click();
    await expect(page.locator('[data-me-message]')).toHaveText('已清除。');
    expect(await stored(page)).toBeNull();
    await expect(page.locator('[data-badge-id="first-step"]')).toContainText('尚未獲得');
  });
});

test.describe('localStorage 不可用時網站仍可用（M3 驗收）', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
  });

  test('/me/ explains the situation and disables storage actions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/me/');
    await expect(page.locator('[data-me-unavailable]')).toBeVisible();
    await expect(page.getByRole('button', { name: '清除所有紀錄' })).toBeDisabled();
    await expect(page.locator('[data-import]')).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test('guide quick check, mode switch and answering still work', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/guide/modus-ponens/');
    const box = page.locator('[data-quick-check]');
    await box.getByLabel('活動改到室內').check();
    await box.getByRole('button', { name: '送出' }).click();
    await expect(box.locator('[data-qc-result]')).toContainText('答對了');

    await page.getByText('進階', { exact: true }).first().click();
    await answer(page, 'cons-001', '稻草人謬誤');
    await expect(page.locator('[data-quiz-result]')).toContainText('判讀正確');
    expect(errors).toEqual([]);
  });

  test('a page load with a storage quota error does not break', async ({ page }) => {
    await page.goto('/practice/daily/');
    await expect(page.locator('[data-scenario-id]').first()).toBeVisible();
  });
});

test.describe('關閉 JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/me/ explains that it needs JavaScript', async ({ page }) => {
    await page.goto('/me/');
    await expect(page.locator('[data-me-nojs]')).toBeVisible();
    await expect(page.locator('[data-me-app]')).toBeHidden();
  });

  test('quick check answer is readable without JavaScript', async ({ page }) => {
    await page.goto('/guide/modus-tollens/');
    await page.getByText('看答案').click();
    await expect(page.locator('[data-qc-reveal]')).toContainText('他還沒出門');
  });
});

test.describe('axe：我的圖鑑', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`/me/ with progress (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await answer(page, 'daily-001', '稻草人謬誤');
      await page.goto('/me/');
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      ).toEqual([]);
    });
  }

  test('guide card with quick check (light)', async ({ page }) => {
    await page.goto('/guide/modus-ponens/');
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
  });
});
