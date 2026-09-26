import { expect, it } from 'vitest';
import { checkSearchPage, checkSitemap } from '../../src/lib/search-checks.ts';
import { sitemapXml } from '../../src/lib/site.ts';

it('detects draft or personal pages entering a production sitemap', () => {
  expect(checkSitemap(sitemapXml(['/', '/guide/draft/', '/me/']), ['/', '/me/']).join()).toContain(
    '/guide/draft/',
  );
  expect(checkSitemap(sitemapXml(['/']), ['/', '/me/'])).toEqual([]);
  expect(checkSitemap(sitemapXml(['/']), ['/', '/guide/reviewed/']).join()).toContain('缺少');
});
it('detects missing canonical and social metadata', () => {
  expect(checkSearchPage('/', '<html></html>').join()).toContain('canonical');
  expect(checkSearchPage('/', '<meta name="robots" content="noindex">').join()).toContain(
    '索引設定',
  );
});
