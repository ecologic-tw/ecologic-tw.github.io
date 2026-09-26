import { mkdirSync, writeFileSync } from 'node:fs';
import { loadContent } from './load-content.ts';
import { makeQualityReport, qualityMarkdown } from '../src/lib/content-quality.ts';

const report = makeQualityReport(loadContent());
mkdirSync('reports', { recursive: true });
writeFileSync('reports/content-quality.json', JSON.stringify(report, null, 2) + '\n');
writeFileSync('reports/content-quality.md', qualityMarkdown(report));
for (const item of report.reading)
  for (const warning of item.warnings) console.warn(`⚠ ${item.id}: ${warning}`);
console.log(`內容品質報告：reports/content-quality.md（${report.reading.length} 項）`);
