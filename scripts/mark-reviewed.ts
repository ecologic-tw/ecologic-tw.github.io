// 審核通過後，把指定內容改為 reviewed（docs/review/review-guide.md）。
// 必須由人工審核者本人執行：紅線 4 規定 AI 產出的內容只能是 draft，AI 不可自行改為 reviewed。
//
// 用法：npm run review -- --reviewer <GitHub 帳號> <id> [<id> …]
//   id 可以是圖鑑卡（straw-man）、情境題（daily-001）或名詞（premise）。
//   --dry-run 只顯示會改哪些檔案，不寫入。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content';
const LOCALE = 'zh-TW';
const TERMS_FILE = join(ROOT, 'terms', LOCALE, 'terms.yaml');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const reviewerIndex = args.indexOf('--reviewer');
const reviewer = reviewerIndex >= 0 ? args[reviewerIndex + 1] : undefined;
const ids = args.filter((a, i) => !a.startsWith('--') && i !== reviewerIndex + 1);

if (!reviewer || !/^[A-Za-z0-9-]+$/.test(reviewer) || ids.length === 0) {
  console.error('用法：npm run review -- --reviewer <GitHub 帳號> <id> [<id> …] [--dry-run]');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const changed: string[] = [];
const missing = new Set(ids);

/** 圖鑑卡、情境題：改 frontmatter 的 status、reviewers、updated */
function markMarkdown(file: string, id: string) {
  const text = readFileSync(file, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match?.[1]) throw new Error(`${file}: 找不到 frontmatter`);
  let fm = match[1];
  if (!/^status: draft$/m.test(fm)) {
    console.warn(`略過 ${id}：狀態不是 draft`);
    return;
  }
  fm = fm.replace(/^status: draft$/m, 'status: reviewed');
  fm = fm.replace(/^reviewers: \[(.*)\]$/m, (_all, list: string) => {
    const people = list
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!people.includes(reviewer as string)) people.push(reviewer as string);
    return `reviewers: [${people.join(', ')}]`;
  });
  if (!/^reviewers:/m.test(fm)) fm += `\nreviewers: [${reviewer}]`;
  fm = fm.replace(/^updated: .*$/m, `updated: ${today}`);
  if (!dryRun) writeFileSync(file, text.replace(match[1], fm));
  changed.push(file);
}

for (const kind of ['entries', 'scenarios']) {
  const dir = join(ROOT, kind, LOCALE);
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const id = name.replace(/\.md$/, '');
    if (!missing.has(id)) continue;
    missing.delete(id);
    markMarkdown(join(dir, name), id);
  }
}

// 名詞：terms.yaml 以「- id: xxx」分段，只改該段的 status
if (missing.size > 0) {
  const lines = readFileSync(TERMS_FILE, 'utf8').split('\n');
  let current: string | undefined;
  let touched = false;
  for (let i = 0; i < lines.length; i++) {
    const idLine = /^- id: ([a-z0-9-]+)\s*$/.exec(lines[i] ?? '');
    if (idLine) current = idLine[1];
    if (current && missing.has(current) && /^ {2}status: draft\s*$/.test(lines[i] ?? '')) {
      lines[i] = '  status: reviewed';
      missing.delete(current);
      changed.push(`${TERMS_FILE}（${current}）`);
      touched = true;
    }
  }
  if (touched && !dryRun) writeFileSync(TERMS_FILE, lines.join('\n'));
}

for (const file of changed) console.log(`${dryRun ? '（試跑）' : '✓'} ${file}`);
if (missing.size > 0) console.warn(`找不到或不是草稿：${[...missing].join(', ')}`);
console.log(
  `\n${dryRun ? '試跑完成' : '已標記'} ${changed.length} 項為 reviewed，審核者 ${reviewer}。接著執行 npm run check 確認沒有引用到草稿。`,
);
