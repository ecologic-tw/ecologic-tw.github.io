import { mkdirSync, writeFileSync } from 'node:fs';
import { loadContent } from './load-content.ts';
import { checkLinks } from '../src/lib/link-checks.ts';

const input = loadContent();
const urls = Object.values(input).flatMap((docs) =>
  docs.flatMap((doc) => {
    const data = doc.data as { sources?: { url?: string }[] };
    return data.sources?.flatMap((source) => (source.url ? [source.url] : [])) ?? [];
  }),
);
const results = await checkLinks(urls);
mkdirSync('reports', { recursive: true });
writeFileSync(
  'reports/source-links.json',
  JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n',
);
const failed = results.filter((result) => result.outcome !== 'ok');
const report = [
  '# 來源連結檢查',
  '',
  `共 ${results.length} 個不同 URL；${failed.length} 個需處理。HTTP 成功不代表來源支持主張或非驗證頁。`,
  '',
  ...failed.map(
    (result) =>
      `- ${result.outcome}／${result.status ?? 'network'}：${result.url}（${result.detail}）`,
  ),
  '',
].join('\n');
writeFileSync('reports/source-links.md', report);
console.log(report);
if (results.some((result) => result.outcome === 'broken')) process.exitCode = 1;
