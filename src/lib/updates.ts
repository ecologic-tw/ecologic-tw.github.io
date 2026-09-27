// 更新紀錄與 Atom 訂閱源（ADR-0024、docs/sdd/04）。純函式，供頁面、訂閱源與測試共用。
import { canonicalUrl, FEED_PATH, SITE_URL } from './site.ts';

export type UpdateItemKind = 'entry' | 'scenario' | 'term' | 'note';
export type NoteKind = 'feature' | 'content' | 'fix' | 'notice';

export type UpdateItem = {
  /** 全站唯一，用於 Atom id */
  key: string;
  /** YYYY-MM-DD */
  date: string;
  kind: UpdateItemKind;
  noteKind?: NoteKind;
  title: string;
  summary?: string;
  /** 站內路徑 */
  path?: string;
};

export type PublishableDoc = {
  id: string;
  data: { title?: string; term?: string; summary?: string; definition?: string; published?: Date };
};

export const FEED_LIMIT = 50;
/** 沒有任何項目時 Atom 仍需 updated；固定值讓建置結果可重現 */
export const FEED_EPOCH = '2026-09-27';

export const itemKindLabel: Record<UpdateItemKind, string> = {
  entry: '圖鑑卡',
  scenario: '情境題',
  term: '名詞',
  note: '說明',
};

export const noteKindLabel: Record<NoteKind, string> = {
  feature: '功能',
  content: '內容',
  fix: '勘誤',
  notice: '公告',
};

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const ORDER: Record<UpdateItemKind, number> = { note: 0, entry: 1, scenario: 2, term: 3 };

function pathFor(kind: Exclude<UpdateItemKind, 'note'>, id: string): string {
  if (kind === 'entry') return `/guide/${id}/`;
  if (kind === 'scenario') return `/scenario/${id}/`;
  return `/terms/#${id}`;
}

/** 已發布內容中有 published 的項目轉成更新項目；沒有的算「首批內容」 */
export function contentUpdates(
  kind: Exclude<UpdateItemKind, 'note'>,
  docs: readonly PublishableDoc[],
): { items: UpdateItem[]; baseline: number } {
  const items: UpdateItem[] = [];
  let baseline = 0;
  for (const doc of docs) {
    if (!doc.data.published) {
      baseline += 1;
      continue;
    }
    items.push({
      key: `${kind}/${doc.id}`,
      date: isoDate(doc.data.published),
      kind,
      title: doc.data.title ?? doc.data.term ?? doc.id,
      summary: doc.data.summary ?? doc.data.definition,
      path: pathFor(kind, doc.id),
    });
  }
  return { items, baseline };
}

export function noteUpdates(
  notes: readonly {
    id: string;
    data: { date: Date; kind: NoteKind; title: string; summary: string; link?: string };
  }[],
): UpdateItem[] {
  return notes.map((note) => ({
    key: `note/${note.id}`,
    date: isoDate(note.data.date),
    kind: 'note',
    noteKind: note.data.kind,
    title: note.data.title,
    summary: note.data.summary,
    path: note.data.link,
  }));
}

/** 新到舊；同一天先放說明，再依卡片、題目、名詞與標題排序 */
export function sortUpdates(items: readonly UpdateItem[]): UpdateItem[] {
  return [...items].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      ORDER[a.kind] - ORDER[b.kind] ||
      a.title.localeCompare(b.title, 'zh-Hant-TW'),
  );
}

export function groupByMonth(
  items: readonly UpdateItem[],
): { month: string; items: UpdateItem[] }[] {
  const groups = new Map<string, UpdateItem[]>();
  for (const item of sortUpdates(items)) {
    const month = item.date.slice(0, 7);
    groups.set(month, [...(groups.get(month) ?? []), item]);
  }
  return [...groups].map(([month, grouped]) => ({ month, items: grouped }));
}

export function monthLabel(month: string): string {
  const [year, m] = month.split('-');
  return `${year} 年 ${Number(m)} 月`;
}

export function itemHeading(item: UpdateItem): string {
  if (item.kind === 'note') return item.title;
  return `新上架${itemKindLabel[item.kind]}：${item.title}`;
}

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const HOST = new URL(SITE_URL).host;

export function atomFeed(items: readonly UpdateItem[]): string {
  const sorted = sortUpdates(items).slice(0, FEED_LIMIT);
  const updated = `${sorted[0]?.date ?? FEED_EPOCH}T00:00:00Z`;
  const pageUrl = canonicalUrl('/updates/');
  const entries = sorted
    .map((item) => {
      const url = item.path ? new URL(item.path, SITE_URL).href : pageUrl;
      const summary = item.summary ? `<summary>${escapeXml(item.summary)}</summary>` : '';
      const category =
        item.kind === 'note' && item.noteKind
          ? noteKindLabel[item.noteKind]
          : itemKindLabel[item.kind];
      return [
        '<entry>',
        `<title>${escapeXml(itemHeading(item))}</title>`,
        `<link rel="alternate" type="text/html" href="${escapeXml(url)}"/>`,
        `<id>tag:${HOST},${item.date}:${escapeXml(item.key)}</id>`,
        `<updated>${item.date}T00:00:00Z</updated>`,
        `<category term="${escapeXml(category)}"/>`,
        summary,
        '</entry>',
      ].join('');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-Hant-TW">
<title>邏生門更新紀錄</title>
<subtitle>新上架的圖鑑卡、情境題、名詞與網站更新。</subtitle>
<link rel="self" type="application/atom+xml" href="${SITE_URL}${FEED_PATH}"/>
<link rel="alternate" type="text/html" href="${pageUrl}"/>
<id>${pageUrl}</id>
<updated>${updated}</updated>
<author><name>邏生門貢獻者們</name></author>
<rights>內容以 CC BY-SA 4.0 授權</rights>
${entries}
</feed>
`;
}
