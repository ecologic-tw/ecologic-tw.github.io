// 桌機寬版版面：列表類頁面放寬並多欄，內文頁維持易讀寬度、相關連結放右側（DESIGN.md「Layout」）。
import { expect, test, type Page } from '@playwright/test';

const pages = [
  '/',
  '/practice/daily/',
  '/guide/',
  '/guide/straw-man/',
  '/scenario/daily-001/',
  '/scenario/daily-013/',
  '/terms/',
  '/me/',
  '/about/',
];

const noHorizontalScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const box = async (page: Page, selector: string) => {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`${selector} 沒有顯示`);
  return found;
};

for (const width of [375, 768, 1024, 1600]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const overflowing: string[] = [];
    for (const path of pages) {
      await page.goto(path);
      if (!(await noHorizontalScroll(page))) overflowing.push(path);
    }
    expect(overflowing).toEqual([]);
  });
}

test.describe('desktop (1600px)', () => {
  test.use({ viewport: { width: 1600, height: 1000 } });

  test('header and list pages use the wide container', async ({ page }) => {
    await page.goto('/practice/daily/');
    expect((await box(page, '.site-header')).width).toBeGreaterThan(1100);
    // 兩欄：前兩題在同一列
    const first = await box(page, '.scenarios li:nth-child(1)');
    const second = await box(page, '.scenarios li:nth-child(2)');
    expect(Math.abs(first.y - second.y)).toBeLessThan(2);
  });

  test('home page puts the mission and the themes side by side', async ({ page }) => {
    await page.goto('/');
    const hero = await box(page, '.hero');
    const themes = await box(page, '.themes');
    expect(themes.x).toBeGreaterThan(hero.x + hero.width);
  });

  test('detail pages keep a readable column and move related links to the side', async ({
    page,
  }) => {
    for (const path of ['/guide/straw-man/', '/scenario/daily-001/']) {
      await page.goto(path);
      const text = await box(page, 'article > header');
      const links = await box(page, 'article > .links');
      expect(text.width).toBeLessThan(700);
      expect(links.x).toBeGreaterThan(text.x + text.width);
    }
  });

  test('the about page stays a single readable column', async ({ page }) => {
    await page.goto('/about/');
    expect((await box(page, 'main')).width).toBeLessThan(700);
  });
});

test('phones keep the related links below the text', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/scenario/daily-001/');
  const header = await box(page, 'article > header');
  const links = await box(page, 'article > .links');
  expect(links.y).toBeGreaterThan(header.y + header.height);
});
