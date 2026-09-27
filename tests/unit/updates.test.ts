import { describe, expect, it } from 'vitest';
import {
  atomFeed,
  contentUpdates,
  FEED_EPOCH,
  FEED_LIMIT,
  groupByMonth,
  itemHeading,
  monthLabel,
  noteUpdates,
  publishedKeys,
  revisionsFor,
  withdrawnIds,
  type NoteDoc,
  type UpdateItem,
} from '../../src/lib/updates.ts';

const d = (value: string) => new Date(`${value}T00:00:00Z`);

describe('contentUpdates', () => {
  it('lists items with a published date and counts the rest as the first batch', () => {
    const { items, baseline } = contentUpdates('entry', [
      {
        id: 'straw-man',
        data: { title: '稻草人', summary: '扭曲對方', published: d('2026-10-02') },
      },
      { id: 'ad-hominem', data: { title: '人身攻擊' } },
    ]);
    expect(baseline).toBe(1);
    expect(items).toEqual([
      {
        key: 'entry/straw-man',
        date: '2026-10-02',
        kind: 'entry',
        title: '稻草人',
        summary: '扭曲對方',
        path: '/guide/straw-man/',
      },
    ]);
  });

  it('links terms to their anchor on the terms page', () => {
    const { items } = contentUpdates('term', [
      { id: 'premise', data: { term: '前提', definition: '定義', published: d('2026-10-01') } },
    ]);
    expect(items[0]).toMatchObject({ title: '前提', summary: '定義', path: '/terms/#premise' });
  });
});

describe('grouping', () => {
  const items: UpdateItem[] = [
    { key: 'entry/a', date: '2026-09-27', kind: 'entry', title: '甲' },
    { key: 'note/n', date: '2026-09-27', kind: 'note', noteKind: 'feature', title: '新功能' },
    { key: 'scenario/b', date: '2026-10-03', kind: 'scenario', title: '乙' },
  ];

  it('groups newest month first, notes before content on the same day', () => {
    const months = groupByMonth(items);
    expect(months.map((m) => m.month)).toEqual(['2026-10', '2026-09']);
    expect(months[1]?.items.map((i) => i.key)).toEqual(['note/n', 'entry/a']);
  });

  it('labels months and headings in plain Chinese', () => {
    expect(monthLabel('2026-09')).toBe('2026 年 9 月');
    const [entry, note] = items;
    if (!entry || !note) throw new Error('fixture');
    expect(itemHeading(entry)).toBe('新上架圖鑑卡：甲');
    expect(itemHeading(note)).toBe('新功能');
  });
});

describe('atomFeed', () => {
  it('escapes text and uses absolute links', () => {
    const [note] = noteUpdates([
      {
        id: 'fix-1',
        data: {
          date: d('2026-10-05'),
          kind: 'fix',
          title: '修正 <A & B>',
          summary: '"引號"',
          link: '/guide/',
        },
      },
    ]);
    if (!note) throw new Error('fixture');
    const xml = atomFeed([note]);
    expect(xml).toContain('<title>修正 &lt;A &amp; B&gt;</title>');
    expect(xml).toContain('<summary>&quot;引號&quot;</summary>');
    expect(xml).toContain('href="https://ecologic-tw.github.io/guide/"');
    expect(xml).toContain('<updated>2026-10-05T00:00:00Z</updated>');
    expect(xml).not.toMatch(/<script/i);
  });

  it('is valid without items and caps the number of entries', () => {
    expect(atomFeed([])).toContain(`<updated>${FEED_EPOCH}T00:00:00Z</updated>`);
    const many: UpdateItem[] = Array.from({ length: FEED_LIMIT + 5 }, (_, i) => ({
      key: `entry/${i}`,
      date: '2026-10-01',
      kind: 'entry',
      title: `卡 ${i}`,
    }));
    expect(atomFeed(many).match(/<entry>/g)).toHaveLength(FEED_LIMIT);
  });
});

describe('revision notes (ADR-0025)', () => {
  const note = (id: string, data: Partial<NoteDoc['data']>): NoteDoc => ({
    id,
    data: { date: d('2026-10-01'), kind: 'content', title: id, summary: '摘要', ...data },
  });
  const notes = [
    note('fix', {
      kind: 'fix',
      about: 'scenario/q1',
      impact: 'answer-changed',
      date: d('2026-10-03'),
    }),
    note('more', { kind: 'content', about: 'scenario/q1', impact: 'reread' }),
    note('pulled', { kind: 'notice', about: 'scenario/q1', date: d('2026-09-30') }),
    note('other', { kind: 'content', about: 'entry/a' }),
    note('site', { kind: 'feature', link: '/updates/' }),
  ];
  const published = publishedKeys({ scenario: [{ id: 'q1' }], entry: [] });

  it('builds content keys', () => {
    expect([...published]).toEqual(['scenario/q1']);
  });

  it('links revisions to the content page and hides those about unpublished content', () => {
    const items = noteUpdates(notes, published);
    const byKey = new Map(items.map((i) => [i.key, i]));
    expect(byKey.get('note/fix')).toMatchObject({
      path: '/scenario/q1/',
      impact: 'answer-changed',
    });
    // 撤下公告不連到內容頁
    expect(byKey.get('note/pulled')?.path).toBeUndefined();
    // entry/a 未發布，補充說明先不列出
    expect(byKey.has('note/other')).toBe(false);
    expect(byKey.get('note/site')?.path).toBe('/updates/');
  });

  it('collects the history of one item, newest first', () => {
    const info = revisionsFor(notes, 'scenario/q1');
    expect(info.history.map((r) => r.title)).toEqual(['fix', 'more', 'pulled']);
    expect(info.latest?.title).toBe('fix');
    expect(info.answerChangedOn).toBe('2026-10-03');
    expect(revisionsFor(notes, 'scenario/none')).toEqual({ history: [] });
  });

  it('ignores withdrawal notices when looking for the latest revision', () => {
    const info = revisionsFor([note('pulled', { kind: 'notice', about: 'entry/a' })], 'entry/a');
    expect(info.latest).toBeUndefined();
    expect(info.history).toHaveLength(1);
  });

  it('lists withdrawn content so imports keep its progress', () => {
    expect(withdrawnIds(notes, published)).toEqual({ entries: [], scenarios: [] });
    expect(withdrawnIds(notes, new Set())).toEqual({ entries: [], scenarios: ['q1'] });
  });

  it('adds the impact to the feed summary', () => {
    const [item] = noteUpdates([notes[0] as NoteDoc], published);
    if (!item) throw new Error('fixture');
    expect(atomFeed([item])).toContain('<summary>摘要　影響：正解已修正</summary>');
  });
});
