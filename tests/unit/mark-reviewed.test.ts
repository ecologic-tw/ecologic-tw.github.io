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
  it('rejects a missing explanation before returning any writes, including dry-run plans', () => {
    const { root, file: terms } = fixture();
    const file = join(root, 'scenarios/zh-TW/daily-001.md');
    const text = `---\nid: daily-001\ntheme: daily\ntitle: 測試\nisControl: true\nanswer: none\ndistractors: [a, b]\ndifficulty: basic\nbetterPhrasing: [改寫]\nchecklist: [一, 二, 三]\nstatus: draft\nreviewers: []\nsources: [{title: Reference}]\nupdated: 2026-09-26\n---\n## 情境\n情境。\n`;
    writeFileSync(file, text);
    const beforeTerms = readFileSync(terms, 'utf8');
    expect(() => prepareReview(root, ['premise', 'daily-001'], ['alice'], '2026-09-27')).toThrow(
      /## 解說/,
    );
    expect(readFileSync(file, 'utf8')).toBe(text);
    expect(readFileSync(terms, 'utf8')).toBe(beforeTerms);
  });

  it('marks a toolkit card and checks both sides first (ADR-0033)', () => {
    const { root } = fixture();
    mkdirSync(join(root, 'toolkit/zh-TW'), { recursive: true });
    const file = join(root, 'toolkit/zh-TW/discussion.md');
    const head = `---\nid: discussion\ntitle: 討論引導卡\nsummary: 摘要\nstatus: draft\nreviewers: []\nsources: [{title: Reference}]\nupdated: 2026-09-26\n---\n`;
    writeFileSync(file, `${head}## 正面：回應之前\n正面。\n`);
    expect(() => prepareReview(root, ['discussion'], ['alice'], '2026-09-29')).toThrow(
      /反面：分歧在哪裡/,
    );
    writeFileSync(file, `${head}## 正面：回應之前\n正面。\n## 反面：分歧在哪裡\n反面。\n`);
    const plan = prepareReview(root, ['discussion'], ['alice'], '2026-09-29');
    const written = plan.writes[0]?.text ?? '';
    expect(parse(written.split('---')[1] ?? '')).toMatchObject({
      status: 'reviewed',
      reviewers: ['alice'],
    });
  });

  it('marks a case and checks its background and closing first (ADR-0036)', () => {
    const { root } = fixture();
    mkdirSync(join(root, 'cases/zh-TW'), { recursive: true });
    const file = join(root, 'cases/zh-TW/daily-case-01.md');
    const role = (id: string) =>
      `  - {id: ${id}, name: 角色, cares: 在意, grounds: 依據, worries: 擔心, misread: 誤解}\n`;
    const head = `---\nid: daily-case-01\ntheme: daily\ntitle: 案例\nsummary: 摘要\nroles:\n${role('a')}${role('b')}${role('c')}status: draft\nreviewers: []\nsources: [{title: Reference}]\nupdated: 2026-09-26\n---\n`;
    writeFileSync(file, `${head}## 背景\n背景。\n`);
    expect(() => prepareReview(root, ['daily-case-01'], ['alice'], '2026-09-29')).toThrow(
      /換個位置想/,
    );
    writeFileSync(file, `${head}## 背景\n背景。\n## 換個位置想\n收尾。\n`);
    const plan = prepareReview(root, ['daily-case-01'], ['alice'], '2026-09-29');
    expect(parse(plan.writes[0]?.text.split('---')[1] ?? '')).toMatchObject({
      status: 'reviewed',
      reviewers: ['alice'],
      published: '2026-09-29',
    });
  });

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

  it('sets published on first review only (ADR-0024)', () => {
    const { root, file } = fixture();
    const first = prepareReview(root, ['premise'], ['alice'], '2026-09-27');
    expect(parse(first.writes[0]?.text ?? '')[0]).toMatchObject({ published: '2026-09-27' });
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        'updated: 2026-09-26',
        'updated: 2026-09-26\n  published: 2026-01-05',
      ),
    );
    const again = prepareReview(root, ['premise'], ['alice'], '2026-09-28');
    expect(parse(again.writes[0]?.text ?? '')[0]).toMatchObject({
      published: '2026-01-05',
      updated: '2026-09-28',
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
      `---\nid: daily-001\ntheme: daily\ntitle: 測試\nisControl: true\nanswer: none\ndistractors: [a, b]\ndifficulty: basic\nbetterPhrasing: [改寫]\nchecklist: [一, 二, 三]\nstatus: draft\nreviewers:\n  - alice\nsources: [{title: Reference}]\nupdated: 2026-09-26\n---\n\n## 情境\n保留本文。\n\n## 解說\n解說。\n`,
    );
    const plan = prepareReview(root, ['daily-001'], ['bob'], '2026-09-27');
    const result = plan.writes[0]?.text ?? '';
    expect(parse(result.split('---')[1] ?? '').reviewers).toEqual(['alice', 'bob']);
    expect(result).toContain('## 情境\n保留本文。');
    expect(readFileSync(file, 'utf8')).toContain('status: draft');
  });
});
