// 從磁碟讀取內容原始檔，交給 src/lib/content-checks.ts 檢查。
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import type { ContentInput, SourceDoc } from '../src/lib/content-checks.ts';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readMarkdownDir(dir: string): SourceDoc[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const file = join(dir, name);
      const text = readFileSync(file, 'utf8');
      const match = FRONTMATTER.exec(text);
      return {
        file,
        fileId: basename(name, '.md'),
        data: match ? parse(match[1] ?? '') : undefined,
        body: match ? (match[2] ?? '') : text,
      };
    });
}

function readYamlList(file: string): SourceDoc[] {
  if (!existsSync(file)) return [];
  const items: unknown = parse(readFileSync(file, 'utf8'));
  if (items == null) return [];
  if (!Array.isArray(items)) return [{ file, data: items, body: '' }];
  return items.map((data: unknown, i) => ({ file: `${file}[${i}]`, data, body: '' }));
}

/** @param root 內容根目錄，預設 src/content（測試時可指向 fixtures） */
export function loadContent(root = 'src/content', locale = 'zh-TW'): ContentInput {
  return {
    entries: readMarkdownDir(join(root, 'entries', locale)),
    scenarios: readMarkdownDir(join(root, 'scenarios', locale)),
    terms: readYamlList(join(root, 'terms', locale, 'terms.yaml')),
    updates: readYamlList(join(root, 'updates', locale, 'updates.yaml')),
  };
}
