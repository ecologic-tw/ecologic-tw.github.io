// 建置期內容檢查（docs/sdd/03「建置期檢查」、07 XSS 對策）。純函式，檔案讀取在 scripts/check-content.ts。
import type { z } from 'astro/zod';
import {
  NO_PROBLEM,
  THEMES,
  entrySchema,
  scenarioSchema,
  scenarioTexts,
  termSchema,
  type EntryData,
  type ScenarioData,
  type TermData,
} from './content-schema.ts';
import { TERM_MARKER } from './markdown-ecologic.ts';
import { collectableEntries } from './quiz.ts';
import { validateScenarioBody } from './scenario-sections.ts';

export type SourceDoc = {
  /** 供錯誤訊息顯示的路徑 */
  file: string;
  /** 以檔名推得的 id；名詞為 undefined */
  fileId?: string;
  data: unknown;
  body: string;
};

export type ContentInput = {
  entries: SourceDoc[];
  scenarios: SourceDoc[];
  terms: SourceDoc[];
};

export type CheckResult = { errors: string[]; warnings: string[] };

export const CONTROL_RATIO = { min: 0.15, max: 0.3 };

const PRIVATE_INFO_PATTERNS: [string, RegExp][] = [
  ['網址', /https?:\/\/|www\./i],
  ['Email', /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ['電話', /(?:\+886|\b0)\d(?:[\s-]?\d){7,9}\b/],
];

const RAW_HTML = /<\/?[a-z][^>]*>|<!--/i;

/** 本文中 [[名詞]] 標記的 id */
function bodyTermIds(body: string): string[] {
  return [...body.matchAll(TERM_MARKER)].map((m) => m[1] ?? '');
}

type Parsed<T> = { doc: SourceDoc; data: T };

function validate<T>(docs: SourceDoc[], schema: z.ZodType<T>, errors: string[]): Parsed<T>[] {
  const ok: Parsed<T>[] = [];
  for (const doc of docs) {
    const result = schema.safeParse(doc.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${doc.file}: ${issue.path.join('.') || '(root)'} — ${issue.message}`);
      }
      continue;
    }
    ok.push({ doc, data: result.data });
  }
  return ok;
}

function indexById<T extends { id: string }>(
  items: Parsed<T>[],
  errors: string[],
): Map<string, Parsed<T>> {
  const map = new Map<string, Parsed<T>>();
  for (const item of items) {
    const { doc, data } = item;
    if (doc.fileId !== undefined && doc.fileId !== data.id) {
      errors.push(`${doc.file}: id「${data.id}」與檔名「${doc.fileId}」不一致`);
    }
    const dup = map.get(data.id);
    if (dup) {
      errors.push(`${doc.file}: id「${data.id}」重複（亦見 ${dup.doc.file}）`);
      continue;
    }
    map.set(data.id, item);
  }
  return map;
}

export function checkContent(input: ContentInput): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const entries = indexById(validate<EntryData>(input.entries, entrySchema, errors), errors);
  const scenarios = indexById(
    validate<ScenarioData>(input.scenarios, scenarioSchema, errors),
    errors,
  );
  const terms = indexById(validate<TermData>(input.terms, termSchema, errors), errors);

  function checkRef(
    from: { doc: SourceDoc; data: { status: string } },
    field: string,
    target: Map<string, { data: { status: string } }>,
    targetLabel: string,
    id: string,
  ) {
    const found = target.get(id);
    if (!found) {
      errors.push(`${from.doc.file}: ${field} 參照的${targetLabel}「${id}」不存在`);
      return;
    }
    if (from.data.status === 'reviewed' && found.data.status !== 'reviewed') {
      errors.push(
        `${from.doc.file}: 已審內容的 ${field} 不得參照未審（${found.data.status}）${targetLabel}「${id}」`,
      );
    }
  }

  for (const item of entries.values()) {
    const { data } = item;
    for (const id of data.related) checkRef(item, 'related', entries, '圖鑑卡', id);
    if (data.pairWith) checkRef(item, 'pairWith', entries, '圖鑑卡', data.pairWith);
    for (const id of data.terms) checkRef(item, 'terms', terms, '名詞', id);
    for (const id of bodyTermIds(item.doc.body)) checkRef(item, '本文 [[名詞]]', terms, '名詞', id);
    if (RAW_HTML.test(item.doc.body)) {
      errors.push(`${item.doc.file}: 本文不得含原生 HTML（docs/sdd/07）`);
    }
  }

  for (const item of scenarios.values()) {
    const { data, doc } = item;
    errors.push(...validateScenarioBody(doc.body).map((issue) => `${doc.file}: ${issue}`));
    if (data.format === 'judge') {
      if (data.answer !== NO_PROBLEM) checkRef(item, 'answer', entries, '圖鑑卡', data.answer);
      if (new Set(data.distractors).size !== data.distractors.length) {
        errors.push(`${doc.file}: distractors 不可重複`);
      }
      for (const id of data.distractors) {
        if (id === data.answer) errors.push(`${doc.file}: distractors 不可包含正解「${id}」`);
        else checkRef(item, 'distractors', entries, '圖鑑卡', id);
      }
    }
    // multi 題的重複與重疊由 schema 檢查，這裡只檢查參照（ADR-0022）
    if (data.format === 'multi') {
      for (const field of ['answers', 'acceptable', 'distractors'] as const) {
        for (const id of data[field]) checkRef(item, field, entries, '圖鑑卡', id);
      }
    }
    for (const id of data.terms) checkRef(item, 'terms', terms, '名詞', id);
    for (const id of bodyTermIds(item.doc.body)) checkRef(item, '本文 [[名詞]]', terms, '名詞', id);

    const text = [data.title, ...scenarioTexts(data), doc.body].join('\n');
    for (const [label, pattern] of PRIVATE_INFO_PATTERNS) {
      if (pattern.test(text)) errors.push(`${doc.file}: 情境題文字不得含${label}`);
    }
    if (RAW_HTML.test(doc.body)) errors.push(`${doc.file}: 本文不得含原生 HTML（docs/sdd/07）`);
  }

  // 對照題比例：已發布（reviewed）集合不合格 → 錯誤；含草稿的集合不合格 → 僅警告，避免撰寫途中卡住。
  for (const theme of THEMES) {
    const inTheme = [...scenarios.values()].filter(
      (s) => s.data.theme === theme && s.data.status !== 'retired',
    );
    const published = inTheme.filter((s) => s.data.status === 'reviewed');
    const ratio = (list: typeof inTheme) =>
      list.filter((s) => s.data.isControl).length / list.length;
    const outOfRange = (r: number) => r < CONTROL_RATIO.min || r > CONTROL_RATIO.max;
    const pct = (r: number) => `${Math.round(r * 100)}%`;

    if (published.length > 0 && outOfRange(ratio(published))) {
      errors.push(`主題 ${theme} 已審情境題的對照題比例 ${pct(ratio(published))}，需介於 15%–30%`);
    } else if (inTheme.length > 0 && outOfRange(ratio(inTheme))) {
      warnings.push(
        `主題 ${theme} 情境題（含草稿）的對照題比例 ${pct(ratio(inTheme))}，目標 15%–30%`,
      );
    }
  }

  // 每張已發布的圖鑑卡都要能點亮（docs/sdd/02 規則 4），否則「圖鑑收藏家」徽章無法達成：
  // 有卡內小檢核，或至少一題已發布情境題答對後會點亮它（judge 的正解、multi 的 answers）。
  const collectable = new Set(
    [...scenarios.values()]
      .filter((s) => s.data.status === 'reviewed')
      .flatMap((s) => collectableEntries(s.data)),
  );
  for (const { doc, data } of entries.values()) {
    if (data.status === 'reviewed' && !data.quickCheck && !collectable.has(data.id)) {
      errors.push(
        `${doc.file}: 已審圖鑑卡無法點亮：需要 quickCheck，或至少一題已審情境題以它為正解（docs/sdd/02 規則 4）`,
      );
    }
  }

  return { errors, warnings };
}
