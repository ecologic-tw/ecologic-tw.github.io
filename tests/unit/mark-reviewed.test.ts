import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { prepareReview } from '../../scripts/mark-reviewed.ts';

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function fixture(second = false) {
  const root = mkdtempSync(join(tmpdir(), 'ecologic-review-test-'));
  dirs.push(root);
  for (const kind of ['entries', 'scenarios', 'terms'])
    mkdirSync(join(root, kind, 'zh-TW'), { recursive: true });
  const file = join(root, 'terms/zh-TW/terms.yaml');
  writeFileSync(
    file,
    `# Keep review notes\n- id: premise\n  term: 前提\n  en: Premise\n  definition: 定義\n  status: draft\n  reviewers: []\n  sources: [{title: Reference}]\n  updated: 2026-09-26\n  requiresSecondReview: ${second}\n`,
  );
  return { root, file };
}

describe('human review preparation (temporary fixtures only)', () => {
  it('updates all term review metadata without writing during preparation', () => {
    const { root, file } = fixture();
    const before = readFileSync(file, 'utf8');
    const plan = prepareReview(root, ['premise'], ['alice'], '2026-09-27');
    expect(readFileSync(file, 'utf8')).toBe(before);
    expect(plan.writes[0]?.text).toContain('# Keep review notes');
    expect(parse(plan.writes[0]?.text ?? '')[0]).toMatchObject({
      status: 'reviewed',
      reviewers: ['alice'],
      updated: '2026-09-27',
    });
  });

  it('rejects missing sources and unknown ids before any write', () => {
    const { root, file } = fixture();
    const text = readFileSync(file, 'utf8');
    expect(() => prepareReview(root, ['premise', 'missing'], ['alice'], '2026-09-27')).toThrow(
      /找不到/,
    );
    expect(readFileSync(file, 'utf8')).toBe(text);
    writeFileSync(file, text.replace('sources: [{title: Reference}]', 'sources: []'));
    expect(() => prepareReview(root, ['premise'], ['alice'], '2026-09-27')).toThrow(/sources/);
    expect(readFileSync(file, 'utf8')).toContain('status: draft');
  });

  it('requires distinct reviewers for flagged terms', () => {
    const { root } = fixture(true);
    expect(() => prepareReview(root, ['premise'], ['alice', 'Alice'], '2026-09-27')).toThrow(
      /2 位/,
    );
    const plan = prepareReview(root, ['premise'], ['alice', 'bob'], '2026-09-27');
    expect(parse(plan.writes[0]?.text ?? '')[0].reviewers).toEqual(['alice', 'bob']);
  });

  it('validates multiline Markdown reviewers and preserves the body', () => {
    const { root } = fixture();
    const file = join(root, 'scenarios/zh-TW/daily-001.md');
    writeFileSync(
      file,
      `---\nid: daily-001\ntheme: daily\ntitle: 測試\nisControl: true\nanswer: none\ndistractors: [a, b]\ndifficulty: basic\nbetterPhrasing: [改寫]\nchecklist: [一, 二, 三]\nstatus: draft\nreviewers:\n  - alice\nsources: [{title: Reference}]\nupdated: 2026-09-26\n---\n\n## 情境\n保留本文。\n`,
    );
    const plan = prepareReview(root, ['daily-001'], ['bob'], '2026-09-27');
    const result = plan.writes[0]?.text ?? '';
    expect(parse(result.split('---')[1] ?? '').reviewers).toEqual(['alice', 'bob']);
    expect(result).toContain('## 情境\n保留本文。');
    expect(readFileSync(file, 'utf8')).toContain('status: draft');
  });
});
