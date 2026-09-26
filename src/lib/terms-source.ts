// 建置期讀取名詞定義，供 Markdown 的 [[名詞]] 標記使用。只在 Node（建置時）執行。
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import type { TermInfo } from './markdown-ecologic.ts';

export const TERMS_FILE = './src/content/terms/zh-TW/terms.yaml';

export function loadTermInfo(file = TERMS_FILE): Map<string, TermInfo> {
  const items = (parse(readFileSync(file, 'utf8')) ?? []) as (TermInfo & { id: string })[];
  return new Map(items.map((t) => [t.id, { term: t.term, en: t.en, definition: t.definition }]));
}
