import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { parse, stringify } from 'yaml';
import { createProposal, preparePromotion, promoteProposal } from '../../scripts/scenario.ts';
import { loadContent } from '../../scripts/load-content.ts';
import { scenarioSchema } from '../../src/lib/content-schema.ts';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) {
    if (!resolve(root).startsWith(join(resolve(tmpdir()), 'ecologic-proposal-')))
      throw new Error('Unsafe cleanup path');
    rmSync(root, { recursive: true, force: true });
  }
});
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ecologic-proposal-'));
  roots.push(root);
  cpSync('tests/fixtures/content-valid', join(root, 'src/content'), { recursive: true });
  return root;
}
function change(file: string, update: Record<string, unknown>) {
  const text = readFileSync(file, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error('Bad fixture');
  writeFileSync(file, `---\n${stringify({ ...parse(match[1] ?? ''), ...update })}---\n${match[2]}`);
}
function ready(root: string) {
  const proposal = createProposal(root, 'idea', { theme: 'daily', title: '測試構想', ai: true });
  const original = readFileSync(join(root, 'src/content/scenarios/zh-TW/daily-001.md'), 'utf8');
  writeFileSync(proposal, original);
  change(proposal, { nextSteps: [], contributors: [{ name: '測試筆名', contribution: '補來源' }] });
  return proposal;
}

it('allows incomplete proposals without changing the published content collection', () => {
  const root = fixture();
  const before = loadContent(join(root, 'src/content'));
  createProposal(root, 'idea', { theme: 'daily', title: '測試構想' });
  const plan = preparePromotion(root, 'idea');
  expect(plan.issues.join()).toContain('answer');
  expect(plan.issues.join()).toContain('情境');
  expect(loadContent(join(root, 'src/content'))).toEqual(before);
  expect(() => promoteProposal(root, 'idea')).toThrow(/待補/);
  expect(existsSync(plan.file)).toBe(false);
});
it('previews then assigns a new id and preserves credits without approving content', () => {
  const root = fixture();
  const proposal = ready(root);
  change(proposal, { status: 'reviewed', reviewers: ['old-reviewer'] });
  writeFileSync(
    proposal,
    readFileSync(proposal, 'utf8').replace('title:', '# Keep contribution discussion\ntitle:'),
  );
  const plan = promoteProposal(root, 'idea', true);
  expect(existsSync(plan.file)).toBe(false);
  promoteProposal(root, 'idea');
  expect(readFileSync(plan.file, 'utf8')).toContain('status: draft');
  expect(readFileSync(plan.file, 'utf8')).toContain('reviewers: []');
  expect(readFileSync(plan.file, 'utf8')).toContain('測試筆名');
  expect(readFileSync(proposal, 'utf8')).toContain(`promotedTo: ${plan.id}`);
  expect(readFileSync(plan.file, 'utf8')).toContain('# Keep contribution discussion');
  expect(() => promoteProposal(root, 'idea')).toThrow(/已轉入/);
});
it('rejects unsafe paths, duplicate proposals and partial attribution', () => {
  const root = fixture();
  expect(() => createProposal(root, '../escape', { theme: 'daily', title: 'test' })).toThrow();
  expect(() =>
    createProposal(root, 'credit', { theme: 'daily', title: 'test', contributor: 'Alice' }),
  ).toThrow(/署名/);
  ready(root);
  expect(() => createProposal(root, 'idea', { theme: 'daily', title: 'test' })).toThrow(/已存在/);
});
it('rejects invalid references and blank checklist entries before any write', () => {
  const root = fixture();
  const proposal = ready(root);
  change(proposal, { answer: 'missing-entry' });
  expect(preparePromotion(root, 'idea').issues.join()).toContain('不存在');
  change(proposal, { answer: 'appeal-to-nature', checklist: [' ', '二', '三'] });
  expect(preparePromotion(root, 'idea').issues.join()).toContain('空白');
});
it('keeps an existing scenario intact until promotion and detects concurrent edits', () => {
  const root = fixture();
  const original = join(root, 'src/content/scenarios/zh-TW/daily-001.md');
  const before = readFileSync(original, 'utf8');
  const proposal = createProposal(root, 'revision', { target: 'daily-001' });
  expect(readFileSync(original, 'utf8')).toBe(before);
  change(proposal, { nextSteps: [] });
  expect(preparePromotion(root, 'revision').issues).toEqual([]);
  writeFileSync(original, `${before}\n別人的新修改。\n`);
  expect(() => promoteProposal(root, 'revision')).toThrow(/原題已變動/);
  expect(readFileSync(original, 'utf8')).toContain('別人的新修改');
});
it('never treats credits as review approval', () => {
  const root = fixture();
  ready(root);
  const data = parse(preparePromotion(root, 'idea').text.split('---')[1] ?? '');
  expect(
    scenarioSchema.safeParse({ ...data, status: 'reviewed', sources: [{ title: 'Reference' }] })
      .success,
  ).toBe(false);
});
it('does not silently drop a malformed pending task list', () => {
  const root = fixture();
  const proposal = ready(root);
  change(proposal, { nextSteps: '還沒查來源' });
  expect(preparePromotion(root, 'idea').issues.join()).toContain('YAML 清單');
});
it('creates advanced-format templates and promotes them without a judge answer (ADR-0022)', () => {
  const root = fixture();
  const proposal = createProposal(root, 'axes', {
    theme: 'daily',
    title: '有效與健全',
    format: 'validity-soundness',
  });
  const created = parse(readFileSync(proposal, 'utf8').split('---')[1] ?? '');
  expect(created).toMatchObject({ format: 'validity-soundness', difficulty: 'advanced' });
  expect(created).not.toHaveProperty('answer');
  expect(preparePromotion(root, 'axes').issues.join()).not.toContain('answer: 請補');

  change(proposal, {
    validity: 'valid',
    premises: 'uncertain',
    notes: { validity: '形式有效。', premises: '前提無法確認。' },
    nextSteps: [],
  });
  writeFileSync(
    proposal,
    readFileSync(proposal, 'utf8')
      .replace('## 情境\n', '## 情境\n\n一段論證。\n')
      .replace('## 解說\n', '## 解說\n\n解說。\n'),
  );
  const plan = promoteProposal(root, 'axes');
  const promoted = parse(readFileSync(plan.file, 'utf8').split('---')[1] ?? '');
  expect(promoted).toMatchObject({
    format: 'validity-soundness',
    isControl: false,
    status: 'draft',
  });
});
it('creates a basic-mode classify template (ADR-0034)', () => {
  const root = fixture();
  const proposal = createProposal(root, 'issue-map', {
    theme: 'daily',
    title: '爭點地圖',
    format: 'classify',
  });
  const created = parse(readFileSync(proposal, 'utf8').split('---')[1] ?? '');
  expect(created).toMatchObject({ format: 'classify', items: [], difficulty: 'basic' });
  expect(created).not.toHaveProperty('answer');
});
it('checks multi option lists for blank entries and rejects unknown formats', () => {
  const root = fixture();
  const proposal = createProposal(root, 'multi', {
    theme: 'daily',
    title: '多選',
    format: 'multi',
  });
  change(proposal, { answers: [' '] });
  expect(preparePromotion(root, 'multi').issues.join()).toContain('answers: 不可用空白項目充數');
  expect(() =>
    createProposal(root, 'drag', { theme: 'daily', title: 'x', format: 'drag-and-drop' }),
  ).toThrow(/--format/);
  expect(() => createProposal(root, 'rev', { target: 'daily-001', format: 'multi' })).toThrow(
    /沿用原題題型/,
  );
});
