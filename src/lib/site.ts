export const SITE_URL = 'https://ecologic-tw.github.io';
export const INDEX_PATHS = [
  '/',
  '/about/',
  '/guide/',
  '/terms/',
  '/practice/daily/',
  '/practice/conservation/',
  '/challenge/',
  '/cases/',
  '/updates/',
];

export const FEED_PATH = '/updates/feed.xml';

export function canonicalUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  const canonical = new URL(SITE_URL);
  canonical.pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  return canonical.href;
}

export function sitemapXml(paths: string[]): string {
  const escape = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;')
      .replaceAll('>', '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((path) => `<url><loc>${escape(canonicalUrl(path))}</loc></url>`).join('')}</urlset>\n`;
}
