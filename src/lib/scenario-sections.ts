// 情境題本文分段（docs/sdd/03：`## 情境`、`## 解說`、`## 進階解說`）。
// 作答頁要把情境與解說放在不同位置（解說在作答後才揭露），所以在建置時分段各自轉成 HTML。
import { markdownToHtml } from 'satteri';
import {
  ecologicAdvanced,
  ecologicTerms,
  ecologicExternalLinks,
  type TermInfo,
} from './markdown-ecologic.ts';

export const SECTIONS = { scenario: '情境', explanation: '解說', advanced: '進階解說' } as const;

/** 依二級標題切成「標題 → Markdown」；標題前的文字與未列出的標題會被忽略。 */
export function splitSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  let current: string | undefined;
  let lines: string[] = [];
  const flush = () => {
    if (current !== undefined) sections.set(current, lines.join('\n').trim());
  };
  for (const line of body.split(/\r?\n/)) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      current = heading[1];
      lines = [];
    } else {
      lines.push(line);
    }
  }
  flush();
  return sections;
}

/** 以與全站相同的外掛轉換；idPrefix 讓同頁不同段落的 popover id 不重複。 */
export function renderMarkdown(
  markdown: string,
  terms: ReadonlyMap<string, TermInfo>,
  idPrefix: string,
): string {
  const result = markdownToHtml(markdown, {
    hastPlugins: [ecologicTerms(terms, idPrefix), ecologicExternalLinks, ecologicAdvanced],
  });
  if (result instanceof Promise) throw new Error('unexpected async markdown result');
  return result.html;
}
