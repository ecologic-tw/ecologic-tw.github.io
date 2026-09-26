// npm run build 的最後一步：檢查 dist/ 每個 HTML（docs/sdd/07）。
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkHtml } from '../src/lib/dist-checks.ts';
import { loadContent } from './load-content.ts';

const DIST = process.argv[2] ?? 'dist';

// 內容 sources 中的網址視為允許（其正確性由內容審核把關）。
const content = loadContent();
const sourceUrls = new Set<string>();
for (const doc of [...content.entries, ...content.scenarios]) {
  const sources = (doc.data as { sources?: { url?: string }[] } | undefined)?.sources ?? [];
  for (const s of sources) if (s.url) sourceUrls.add(s.url);
}

const htmlFiles = readdirSync(DIST, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(DIST, f));

const errors = htmlFiles.flatMap((f) => checkHtml(f, readFileSync(f, 'utf8'), sourceUrls));
for (const e of errors) console.error(`✖ ${e}`);
if (errors.length > 0) {
  console.error(`\n建置產物檢查失敗：${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(`建置產物檢查通過（${htmlFiles.length} 個 HTML）`);
