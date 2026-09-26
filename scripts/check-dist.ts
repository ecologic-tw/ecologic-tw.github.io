// npm run build 的最後一步：檢查 dist/ 每個 HTML（docs/sdd/07）。
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { checkHtml } from '../src/lib/dist-checks.ts';
import { checkSearchPage, checkSitemap } from '../src/lib/search-checks.ts';
import { SITE_URL } from '../src/lib/site.ts';
import { loadContent } from './load-content.ts';

const DIST = process.argv[2] ?? 'dist';

// 內容 sources 中的網址視為允許（其正確性由內容審核把關）。
const content = loadContent();
const sourceUrls = new Set<string>();
for (const doc of [...content.entries, ...content.scenarios, ...content.terms]) {
  const sources = (doc.data as { sources?: { url?: string }[] } | undefined)?.sources ?? [];
  for (const s of sources) if (s.url) sourceUrls.add(s.url);
}

const htmlFiles = readdirSync(DIST, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(DIST, f));

const errors = htmlFiles.flatMap((f) => checkHtml(f, readFileSync(f, 'utf8'), sourceUrls));
const paths = htmlFiles.map(
  (file) =>
    `/${relative(DIST, file)
      .split(sep)
      .join('/')
      .replace(/index\.html$/, '')}`,
);
for (const [index, path] of paths.entries()) {
  errors.push(...checkSearchPage(path, readFileSync(htmlFiles[index] ?? '', 'utf8')));
}
errors.push(...checkSitemap(readFileSync(join(DIST, 'sitemap.xml'), 'utf8'), paths));
if (!readFileSync(join(DIST, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE_URL}/sitemap.xml`))
  errors.push('robots.txt: 缺少 sitemap 網址');
const png = readFileSync(join(DIST, 'social-card.png'));
if (
  png.toString('hex', 0, 8) !== '89504e470d0a1a0a' ||
  png.readUInt32BE(16) !== 1200 ||
  png.readUInt32BE(20) !== 630
)
  errors.push('分享圖必須為 1200 × 630 PNG');
for (const doc of [...content.entries, ...content.scenarios]) {
  const data = doc.data as { id: string; status: string };
  const prefix = content.entries.includes(doc) ? 'guide' : 'scenario';
  if (data.status !== 'reviewed' && paths.includes(`/${prefix}/${data.id}/`))
    errors.push(`${data.id}: 未審或下架內容進入正式產物`);
}
for (const e of errors) console.error(`✖ ${e}`);
if (errors.length > 0) {
  console.error(`\n建置產物檢查失敗：${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(`建置產物檢查通過（${htmlFiles.length} 個 HTML）`);
