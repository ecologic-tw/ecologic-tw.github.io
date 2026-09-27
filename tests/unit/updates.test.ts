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
