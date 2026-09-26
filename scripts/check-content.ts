// npm run check 的一部分：內容交叉參照與寫作規則檢查（docs/sdd/03）。
// 用法：node scripts/check-content.ts [內容根目錄]
import { checkContent } from '../src/lib/content-checks.ts';
import { loadContent } from './load-content.ts';

const { errors, warnings } = checkContent(loadContent(process.argv[2]));

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);

if (errors.length > 0) {
  console.error(`\n內容檢查失敗：${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(`內容檢查通過${warnings.length ? `（${warnings.length} 個警告）` : ''}`);

// 審核進度（docs/review/review-guide.md）
const content = loadContent(process.argv[2]);
const progress = (label: string, docs: { data: unknown }[]) => {
  const reviewed = docs.filter(
    (d) => (d.data as { status?: string } | undefined)?.status === 'reviewed',
  );
  return `${label} ${reviewed.length}／${docs.length}`;
};
console.log(
  `已審：${progress('名詞', content.terms)}、${progress('圖鑑卡', content.entries)}、${progress('情境題', content.scenarios)}`,
);
