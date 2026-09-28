// npm run check:docs：檢查 docs/、根目錄與 .github/ 的 Markdown 相對連結（ADR-0028）。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { brokenDocLinks, type DocFile } from '../src/lib/doc-links.ts';

const toPosix = (path: string) => path.split(sep).join('/');

const paths = [
  ...readdirSync('.').filter((name) => name.endsWith('.md')),
  ...readdirSync('.github')
    .filter((name) => name.endsWith('.md'))
    .map((name) => `.github/${name}`),
  ...readdirSync('docs', { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.md'))
    .map((name) => toPosix(join('docs', name))),
];

const files: DocFile[] = paths.map((path) => ({ path, text: readFileSync(path, 'utf8') }));
const errors = brokenDocLinks(files, (path) => existsSync(path));

for (const e of errors) console.error(`✖ ${e}`);
if (errors.length > 0) {
  console.error(`\n文件連結檢查失敗：${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(`文件連結檢查通過（${files.length} 個 Markdown 檔）`);
