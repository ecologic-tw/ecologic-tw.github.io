import { expect, test } from '@playwright/test';

test('all external links preserve the current page and announce a new window', async ({ page }) => {
  await page
    .context()
    .route(/^https:\/\//, (route) =>
      route.fulfill({ body: '<p>External page stub</p>', contentType: 'text/html' }),
    );
  for (const path of ['/about/', '/guide/law-of-identity/', '/terms/']) {
    await page.goto(path);
    const links = page.locator('a[href^="https://"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
  await page.goto('/guide/law-of-identity/');
  await page.locator('details.sources > summary').click();
  const link = page.locator('details.sources a').first();
  await expect(link).toContainText('另開視窗');
  const popup = page.waitForEvent('popup');
  await link.click();
  const opened = await popup;
  await opened.waitForLoadState();
  await expect(page).toHaveURL(/\/guide\/law-of-identity\/$/);
  expect(await opened.evaluate(() => window.opener)).toBeNull();
  await opened.close();
});
