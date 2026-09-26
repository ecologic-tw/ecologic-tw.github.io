// 人工審核者專用；AI 不得在正式內容上執行標記（AGENTS.md 紅線 4）。
// npm run review -- --reviewer alice [--reviewer bob] <id> ... [--dry-run]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseDocument, isSeq, isMap } from 'yaml';
import { entrySchema, scenarioSchema, termSchema } from '../src/lib/content-schema.ts';

export type ReviewPlan = { writes: { file: string; text: string }[]; ids: string[] };

/** 先驗證所有候選變更，全部通過才由呼叫端寫入；不代替人工審核或交叉參照檢查。 */
export function prepareReview(
  root: string,
  ids: string[],
  reviewers: string[],
  today: string,
): ReviewPlan {
  if (
    !ids.length ||
    !reviewers.length ||
    reviewers.some((r) => !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(r))
  ) {
    throw new Error('請提供內容 id 與有效的 GitHub 審核帳號');
  }
  const wanted = new Set(ids);
  const found = new Set<string>();
  const plan: ReviewPlan = { writes: [], ids: [] };
  const schemas = { entries: entrySchema, scenarios: scenarioSchema, terms: termSchema };

  function mark(data: Record<string, unknown>, kind: keyof typeof schemas, file: string) {
    const id = String(data.id);
    if (!wanted.has(id)) return undefined;
    if (found.has(id)) throw new Error(`重複的 id：${id}`);
    found.add(id);
    if (data.status !== 'draft') throw new Error(`${id} 不是草稿，不變更整批內容`);
    const existing = schemas[kind].parse(data).reviewers;
    const people = [
      ...new Map([...existing, ...reviewers].map((r) => [r.toLowerCase(), r])).values(),
    ];
    const candidate = { ...data, status: 'reviewed', reviewers: people, updated: today };
    const checked = schemas[kind].safeParse(candidate);
    if (!checked.success) {
      throw new Error(
        `${file} (${id}): ${checked.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
      );
    }
    plan.ids.push(id);
    return people;
  }

  for (const kind of ['entries', 'scenarios'] as const) {
    const dir = join(root, kind, 'zh-TW');
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const file = join(dir, name);
      const text = readFileSync(file, 'utf8');
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
      if (!match?.[1]) throw new Error(`${file}: 找不到 frontmatter`);
      const doc = parseDocument(match[1]);
      if (doc.errors.length) throw new Error(`${file}: ${doc.errors[0]?.message}`);
      const people = mark(doc.toJS() as Record<string, unknown>, kind, file);
      if (!people) continue;
      doc.set('status', 'reviewed');
      doc.set('reviewers', people);
      doc.set('updated', today);
      plan.writes.push({ file, text: text.replace(match[1], doc.toString().trimEnd()) });
    }
  }
  const file = join(root, 'terms', 'zh-TW', 'terms.yaml');
  const doc = parseDocument(readFileSync(file, 'utf8'));
  if (doc.errors.length || !isSeq(doc.contents)) throw new Error(`${file}: 名詞必須是 YAML 陣列`);
  let changed = false;
  for (const [index, item] of doc.contents.items.entries()) {
    if (!isMap(item)) throw new Error(`${file}: 名詞必須是物件`);
    const people = mark(item.toJSON() as Record<string, unknown>, 'terms', file);
    if (!people) continue;
    doc.setIn([index, 'status'], 'reviewed');
    doc.setIn([index, 'reviewers'], people);
    doc.setIn([index, 'updated'], today);
    changed = true;
  }
  if (changed) plan.writes.push({ file, text: doc.toString() });
  const missing = [...wanted].filter((id) => !found.has(id));
  if (missing.length) throw new Error(`找不到內容：${missing.join(', ')}`);
  return plan;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const reviewers: string[] = [];
    const ids: string[] = [];
    let dryRun = false;
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      const arg = args[i] ?? '';
      if (arg === '--dry-run') dryRun = true;
      else if (arg === '--reviewer') reviewers.push(args[++i] ?? '');
      else if (arg.startsWith('-')) throw new Error(`未知選項：${arg}`);
      else ids.push(arg);
    }
    const plan = prepareReview(
      'src/content',
      ids,
      reviewers,
      new Date().toISOString().slice(0, 10),
    );
    if (!dryRun) for (const item of plan.writes) writeFileSync(item.file, item.text);
    console.log(`${dryRun ? '試跑通過（未寫入）' : '已標記'}：${plan.ids.join(', ')}`);
    console.log('接著執行 npm run check，確認交叉參照與對照題比例；PR 人工核准仍不可省略。');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
