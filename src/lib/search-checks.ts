import { canonicalUrl, SITE_URL } from './site.ts';

/** 驗證正式產物；預覽環境另由 e2e 驗證 noindex 與空 sitemap。 */
export function checkSearchPage(path: string, html: string): string[] {
  const errors: string[] = [];
  const canonical = canonicalUrl(path);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`))
    errors.push(`${path}: canonical 不符正式網址`);
  if (!html.includes(`<meta property="og:url" content="${canonical}"`))
    errors.push(`${path}: og:url 不符 canonical`);
  for (const property of ['og:title', 'og:description', 'og:type', 'og:image', 'og:image:alt']) {
    if (!new RegExp(`<meta property="${property}" content="[^"]+"`).test(html))
      errors.push(`${path}: 缺少 ${property}`);
  }
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (noindex !== (path === '/me/')) errors.push(`${path}: 正式頁面索引設定不符`);
  return errors;
}

export function checkSitemap(xml: string, paths: string[]): string[] {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expected = paths.filter((path) => path !== '/me/').map(canonicalUrl);
  const errors: string[] = [];
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'))
    errors.push('sitemap: 缺少標準 namespace');
  if (new Set(urls).size !== urls.length) errors.push('sitemap: URL 重複');
  for (const url of expected) if (!urls.includes(url)) errors.push(`sitemap: 缺少 ${url}`);
  for (const url of urls)
    if (!url || !url.startsWith(`${SITE_URL}/`) || !expected.includes(url))
      errors.push(`sitemap: 不應索引 ${url}`);
  return errors;
}
