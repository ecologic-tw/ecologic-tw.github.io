// 更新紀錄與 Atom 訂閱源（ADR-0024、docs/sdd/04），以及內容頁的修訂紀錄（ADR-0025）。
// 純函式，供頁面、訂閱源與測試共用。
import { canonicalUrl, FEED_PATH, SITE_URL } from './site.ts';

export type UpdateItemKind = 'entry' | 'scenario' | 'term' | 'note';
export type NoteKind = 'feature' | 'content' | 'fix' | 'notice';
export type Impact = 'none' | 'reread' | 'answer-changed';
type ContentKind = Exclude<UpdateItemKind, 'note'>;

export type NoteDoc = {
  id: string;
  data: {
    date: Date;
    kind: NoteKind;
    title: string;
    summary: string;
    link?: string;
    /** 被修訂的內容，例如 'entry/straw-man'（ADR-0025） */
    about?: string;
    impact?: Impact;
  };
};

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
  impact?: Impact;
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

export const impactLabel: Record<Impact, string> = {
  none: '不影響先前的理解',
  reread: '建議重新閱讀',
  'answer-changed': '正解已修正',
};

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const ORDER: Record<UpdateItemKind, number> = { note: 0, entry: 1, scenario: 2, term: 3 };

function pathFor(kind: ContentKind, id: string): string {
  if (kind === 'entry') return `/guide/${id}/`;
  if (kind === 'scenario') return `/scenario/${id}/`;
  return `/terms/#${id}`;
}

/** 'entry/straw-man' → '/guide/straw-man/' */
function pathForKey(key: string): string {
  const [kind = '', id = ''] = key.split('/');
  return pathFor(kind as ContentKind, id);
}

/** 已發布內容中有 published 的項目轉成更新項目；沒有的算「首批內容」 */
export function contentUpdates(
  kind: ContentKind,
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

/** 已發布內容的 key 集合，例如 'entry/straw-man' */
export function publishedKeys(
  docs: Partial<Record<ContentKind, readonly { id: string }[]>>,
): Set<string> {
  return new Set(
    Object.entries(docs).flatMap(([kind, list]) => (list ?? []).map((doc) => `${kind}/${doc.id}`)),
  );
}

/**
 * 有撤下公告、目前未發布的內容 id（ADR-0025）。
 * 匯入進度時保留這些 id 的紀錄，重新發布後就能接回，不因暫時撤下而遺失。
 */
export function withdrawnIds(
  notes: readonly NoteDoc[],
  published: ReadonlySet<string>,
): { entries: string[]; scenarios: string[] } {
  const keys = new Set(
    notes.flatMap(({ data }) =>
      data.kind === 'notice' && data.about && !published.has(data.about) ? [data.about] : [],
    ),
  );
  const idsOf = (kind: ContentKind) =>
    [...keys].filter((key) => key.startsWith(`${kind}/`)).map((key) => key.slice(kind.length + 1));
  return { entries: idsOf('entry'), scenarios: idsOf('scenario') };
}

/**
 * @param published 目前已發布內容的 key（例如 'entry/straw-man'）。
 *   補充、勘誤說明跟著內容的審核狀態：內容未發布時不列出，發布時沒有 link 就連到內容頁。
 *   撤下公告一律列出，不連到內容頁（ADR-0025）。
 */
export function noteUpdates(
  notes: readonly NoteDoc[],
  published: ReadonlySet<string> = new Set(),
): UpdateItem[] {
  const isRevision = (data: NoteDoc['data']) => data.about && data.kind !== 'notice';
  return notes.flatMap(({ id, data }) => {
    if (isRevision(data) && !published.has(data.about ?? '')) return [];
    const derived = isRevision(data) ? pathForKey(data.about ?? '') : undefined;
    const item: UpdateItem = {
      key: `note/${id}`,
      date: isoDate(data.date),
      kind: 'note',
      noteKind: data.kind,
      title: data.title,
      summary: data.summary,
      path: data.link ?? derived,
      impact: data.impact,
    };
    return [item];
  });
}

export type Revision = {
  date: string;
  kind: NoteKind;
  title: string;
  summary: string;
  impact?: Impact;
};

export type RevisionInfo = {
  /** 歷次修訂，新到舊；含撤下公告 */
  history: Revision[];
  /** 最近一次實質修訂（補充或勘誤），不看 updated */
  latest?: Revision;
  /** 最近一次正解修正的日期 */
  answerChangedOn?: string;
};

/** 某項內容的修訂紀錄（ADR-0025）。key 例如 'scenario/cons-013' */
export function revisionsFor(notes: readonly NoteDoc[], key: string): RevisionInfo {
  const history = notes
    .filter((note) => note.data.about === key)
    .map(({ data }) => ({
      date: isoDate(data.date),
      kind: data.kind,
      title: data.title,
      summary: data.summary,
      impact: data.impact,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return {
    history,
    latest: history.find((r) => r.kind === 'content' || r.kind === 'fix'),
    answerChangedOn: history.find((r) => r.impact === 'answer-changed')?.date,
  };
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
      const text = [item.summary, item.impact && `影響：${impactLabel[item.impact]}`]
        .filter(Boolean)
        .join('　');
      const summary = text ? `<summary>${escapeXml(text)}</summary>` : '';
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
