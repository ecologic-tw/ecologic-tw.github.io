import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const FORM_HOST = 'https://docs.google.com/forms/';
const ISSUE_HOST = 'https://github.com/ecologic-tw/ecologic-tw.github.io/issues/';
const ENTRY = { type: 'entry.1967567927', contentId: 'entry.1393954149', mode: 'entry.868715057' };

// 不實際連到 Google／GitHub：攔截外部請求，只檢查開啟的網址
async function stubExternal(page: Page) {
  await page
    .context()
    .route(/^https:\/\/(docs\.google\.com|github\.com)\//, (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<p>stub</p>' }),
    );
}

async function openPopup(page: Page, name: RegExp) {
  const popup = page.waitForEvent('popup');
  await page.getByRole('link', { name }).click();
  const opened = await popup;
  await opened.waitForLoadState();
  return new URL(opened.url());
}

test.describe('回報連結帶入題目 ID（M4 驗收）', () => {
  test.beforeEach(async ({ page }) => stubExternal(page));

  test('scenario page: form opens with type, id and mode prefilled', async ({ page }) => {
    await page.goto('/scenario/cons-003/');
    const url = await openPopup(page, /填回饋表單/);
    expect(url.href.startsWith(FORM_HOST)).toBe(true);
    expect(url.searchParams.get(ENTRY.type)).toBe('這一題／這張卡有問題');
    expect(url.searchParams.get(ENTRY.contentId)).toBe('cons-003');
    expect(url.searchParams.get(ENTRY.mode)).toBe('基礎');
  });

  test('scenario page: GitHub issue opens with the id prefilled', async ({ page }) => {
    await page.goto('/scenario/cons-003/');
    const url = await openPopup(page, /在 GitHub 開勘誤 Issue/);
    expect(url.href.startsWith(ISSUE_HOST)).toBe(true);
    expect(url.searchParams.get('template')).toBe('content-error.yml');
    expect(url.searchParams.get('content-id')).toBe('cons-003');
    expect(url.searchParams.get('title')).toBe('[勘誤] cons-003');
  });

  test('guide card: both links carry the card id', async ({ page }) => {
    await page.goto('/guide/straw-man/');
    const form = await openPopup(page, /填回饋表單/);
    expect(form.searchParams.get(ENTRY.contentId)).toBe('straw-man');
    const issue = await openPopup(page, /在 GitHub 開勘誤 Issue/);
    expect(issue.searchParams.get('content-id')).toBe('straw-man');
  });

  test('form link follows the current mode', async ({ page }) => {
    await page.goto('/scenario/daily-001/');
    await page.getByText('進階', { exact: true }).first().click();
    const url = await openPopup(page, /填回饋表單/);
    expect(url.searchParams.get(ENTRY.mode)).toBe('進階');
  });

  test('footer feedback link prefills only the mode', async ({ page }) => {
    await page.goto('/guide/');
    const url = await openPopup(page, /意見回饋/);
    expect(url.href.startsWith(FORM_HOST)).toBe(true);
    expect(url.searchParams.has(ENTRY.contentId)).toBe(false);
    expect(url.searchParams.has(ENTRY.type)).toBe(false);
    expect(url.searchParams.get(ENTRY.mode)).toBe('基礎');
  });

  test('external links do not leak the referrer or opener', async ({ page }) => {
    await page.goto('/scenario/cons-003/');
    const rels = await page
      .locator('a[target="_blank"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('rel')));
    expect(rels.length).toBeGreaterThan(0);
    for (const rel of rels) expect(rel).toBe('noopener noreferrer');
  });
});

test.describe('關閉 JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('report links still carry the id', async ({ page }) => {
    await page.goto('/scenario/cons-003/');
    const href = await page.getByRole('link', { name: /填回饋表單/ }).getAttribute('href');
    expect(new URL(href ?? '').searchParams.get(ENTRY.contentId)).toBe('cons-003');
  });
});

test.describe('/about/', () => {
  test('covers mission, disclaimer, privacy, licence, participation and official URLs', async ({
    page,
  }) => {
    await page.goto('/about/');
    for (const heading of [
      '我們想做的事',
      '這不是官方網站',
      '隱私：網站本身不蒐集你的資料',
      '回饋與投稿',
      '一起參與',
      '授權',
      '唯一的官方網址',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(page.getByText('ecologic:v1')).toBeVisible();
    await expect(page.getByText('https://forms.gle/ZAacF8i7hQ7QF8LC9')).toBeVisible();
    // 自託管字型須附 SIL OFL 授權全文
    const license = page.getByRole('link', { name: 'SIL Open Font License 1.1' });
    const response = await page.request.get((await license.getAttribute('href')) ?? '');
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('SIL Open Font License');
  });

  test('is reachable from every page footer', async ({ page }) => {
    await page.goto('/practice/daily/');
    await page.getByRole('link', { name: '關於本站' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`has no serious accessibility issues (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/about/');
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
        [],
      );
    });
  }
});
