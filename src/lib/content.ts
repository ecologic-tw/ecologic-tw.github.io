// 取內容的唯一入口（docs/sdd/06）：頁面只能透過這裡取內容，確保 draft 不外流。
// 開發環境（npm run dev）或 ECOLOGIC_DRAFTS=1（e2e 測試建置）時包含草稿；正式建置只取 reviewed。
import { getCollection, type CollectionEntry } from 'astro:content';
import { ENTRY_KINDS } from './content-schema.ts';

export type Entry = CollectionEntry<'entries'>;
export type Term = CollectionEntry<'terms'>;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export const showDrafts = import.meta.env.DEV || process.env.ECOLOGIC_DRAFTS === '1';

function isVisible(status: string): boolean {
  return status === 'reviewed' || (showDrafts && status === 'draft');
}

export async function getPublishedEntries(): Promise<Entry[]> {
  const entries = await getCollection('entries', ({ data }) => isVisible(data.status));
  const order = new Map(ENTRY_KINDS.map((kind, i) => [kind, i]));
  return entries.sort(
    (a, b) =>
      (order.get(a.data.kind) ?? 0) - (order.get(b.data.kind) ?? 0) ||
      a.data.title.localeCompare(b.data.title, 'zh-Hant-TW'),
  );
}

export async function getPublishedTerms(): Promise<Term[]> {
  const terms = await getCollection('terms', ({ data }) => isVisible(data.status));
  return terms.sort((a, b) => a.data.term.localeCompare(b.data.term, 'zh-Hant-TW'));
}

export function groupByKind(entries: Entry[]): { kind: EntryKind; entries: Entry[] }[] {
  return ENTRY_KINDS.map((kind) => ({
    kind,
    entries: entries.filter((e) => e.data.kind === kind),
  })).filter((group) => group.entries.length > 0);
}

export type Scenario = CollectionEntry<'scenarios'>;
export type Theme = Scenario['data']['theme'];

/** 依 id 排序（daily-001、daily-002…），即題目的建議練習順序 */
export async function getPublishedScenarios(theme?: Theme): Promise<Scenario[]> {
  const scenarios = await getCollection(
    'scenarios',
    ({ data }) => isVisible(data.status) && (!theme || data.theme === theme),
  );
  return scenarios.sort((a, b) => a.id.localeCompare(b.id));
}

export type UpdateNote = CollectionEntry<'updates'>;

/** 更新紀錄的手寫說明（ADR-0024），新到舊 */
export async function getUpdateNotes(): Promise<UpdateNote[]> {
  const notes = await getCollection('updates');
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
