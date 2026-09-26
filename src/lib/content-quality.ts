import type { ContentInput } from './content-checks.ts';
import { entrySchema, scenarioSchema, termSchema } from './content-schema.ts';

// 初始編輯預算；以字元而非英文單字計數，不是閱讀年級評估。
export const READING_LIMITS = {
  entryBasic: 1200,
  entryAdvanced: 900,
  scenarioBasic: 700,
  scenarioAdvanced: 500,
  term: 180,
  sentence: 100,
};

export function readingText(
  markdown: string,
  labels: ReadonlyMap<string, string> = new Map(),
): string {
  return markdown
    .replace(
      /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g,
      (_whole, id: string, label: string | undefined) => label ?? labels.get(id) ?? id,
    )
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/[*_`>#]/g, '');
}

export function textLength(text: string): number {
  return [...text.replace(/\s/g, '')].length;
}

export function makeQualityReport(input: ContentInput) {
  const terms = input.terms.map((doc) => ({ ...doc, data: termSchema.parse(doc.data) }));
  const labels = new Map(terms.map(({ data }) => [data.id, data.term]));
  const entries = input.entries.map((doc) => ({ ...doc, data: entrySchema.parse(doc.data) }));
  const scenarios = input.scenarios.map((doc) => ({
    ...doc,
    data: scenarioSchema.parse(doc.data),
  }));
  const documents = [
    ...entries.map((doc) => ({ ...doc, kind: 'entry' as const })),
    ...scenarios.map((doc) => ({ ...doc, kind: 'scenario' as const })),
    ...terms.map((doc) => ({ ...doc, kind: 'term' as const })),
  ];
  const fraction = (count: number, total: number) => ({
    count,
    total,
    percent: total ? Math.round((count / total) * 1000) / 10 : null,
  });
  const coverage = (docs: typeof documents) => ({
    total: docs.length,
    withSources: fraction(docs.filter(({ data }) => data.sources.length > 0).length, docs.length),
    twoReviewers: fraction(
      docs.filter(({ data }) => new Set(data.reviewers.map((r) => r.toLowerCase())).size >= 2)
        .length,
      docs.length,
    ),
    aiAssisted: fraction(docs.filter(({ data }) => data.aiAssisted).length, docs.length),
  });
  const scopes = Object.fromEntries(
    ['all', 'reviewed', 'entry', 'scenario', 'term'].map((scope) => [
      scope,
      coverage(
        documents.filter(
          (doc) =>
            scope === 'all' ||
            (scope === 'reviewed' ? doc.data.status === 'reviewed' : doc.kind === scope),
        ),
      ),
    ]),
  );
  const reading = documents.map(({ data, body, kind }) => {
    let basic = '';
    let advanced = '';
    let inAdvanced = false;
    for (const line of body.split(/\r?\n/)) {
      if (/^##\s/.test(line)) inAdvanced = /^##\s+進階(?:解說)?\s*$/.test(line);
      if (inAdvanced) advanced += `${line}\n`;
      else basic += `${line}\n`;
    }
    if ('definition' in data) basic = data.definition;
    if ('summary' in data) {
      basic += `\n${data.summary}`;
      if (data.quickCheck)
        basic += `\n${data.quickCheck.question}\n${data.quickCheck.options.join('\n')}\n${data.quickCheck.explanation}`;
    }
    if ('betterPhrasing' in data)
      basic += `\n${data.betterPhrasing.join('\n')}\n${data.checklist.join('\n')}`;
    basic = readingText(basic, labels);
    advanced = readingText(advanced, labels);
    const basicCharacters = textLength(basic);
    const advancedCharacters = textLength(advanced);
    const longestSentence = Math.max(
      0,
      ...`${basic}\n${advanced}`.split(/[。！？!?；;\n]/).map(textLength),
    );
    const basicLimit =
      kind === 'entry'
        ? READING_LIMITS.entryBasic
        : kind === 'scenario'
          ? READING_LIMITS.scenarioBasic
          : READING_LIMITS.term;
    const advancedLimit =
      kind === 'entry' ? READING_LIMITS.entryAdvanced : READING_LIMITS.scenarioAdvanced;
    const warnings = [
      ...(basicCharacters > basicLimit ? [`基礎 ${basicCharacters} 字元超過 ${basicLimit}`] : []),
      ...(advancedCharacters > advancedLimit
        ? [`進階 ${advancedCharacters} 字元超過 ${advancedLimit}`]
        : []),
      ...(longestSentence > READING_LIMITS.sentence
        ? [`最長句 ${longestSentence} 字元超過 ${READING_LIMITS.sentence}`]
        : []),
    ];
    return {
      id: data.id,
      kind,
      status: data.status,
      basicCharacters,
      advancedCharacters,
      longestSentence,
      warnings,
    };
  });
  return { scopes, reading, limits: READING_LIMITS };
}

export function qualityMarkdown(report: ReturnType<typeof makeQualityReport>): string {
  const ratio = (value: { count: number; total: number; percent: number | null }) =>
    `${value.count}/${value.total} (${value.percent === null ? '不適用' : `${value.percent}%`})`;
  return [
    '# 內容品質報告',
    '',
    '比例只反映 metadata，不等於內容正確或實際審核完成。all 含草稿與下架內容；reviewed 為發布集合。',
    '',
    '| 範圍 | 總數 | 有來源 | 兩位不同審核者 | AI 協助 |',
    '|---|---:|---|---|---|',
    ...Object.entries(report.scopes).map(
      ([scope, row]) =>
        `| ${scope} | ${row.total} | ${ratio(row.withSources)} | ${ratio(row.twoReviewers)} | ${ratio(row.aiAssisted)} |`,
    ),
    '',
    '## 閱讀長度',
    '',
    '以去除 Markdown 標記後的非空白 Unicode 字元估計，含標點；排除來源與介面字串，不是閱讀年級。基礎／進階依既有段落區分，超標只提醒人類編輯。',
    '',
    '| ID | 狀態 | 基礎 | 進階 | 最長句 | 提醒 |',
    '|---|---|---:|---:|---:|---|',
    ...report.reading.map(
      (row) =>
        `| ${row.id} | ${row.status} | ${row.basicCharacters} | ${row.advancedCharacters} | ${row.longestSentence} | ${row.warnings.join('；') || '—'} |`,
    ),
    '',
  ].join('\n');
}
