import { describe, expect, it } from 'vitest';
import { checkContent, type SourceDoc } from '../../src/lib/content-checks.ts';
import { loadContent } from '../../scripts/load-content.ts';

const baseEntry = {
  kind: 'informal-fallacy',
  title: '測試卡',
  en: 'Test',
  summary: '一句話定義。',
  notFallacyWhen: '某條件下合理。',
  charitableResponse: '善意回應。',
  status: 'draft',
  updated: '2026-09-26',
};

const baseScenario = {
  theme: 'daily',
  title: '測試情境',
  difficulty: 'basic',
  betterPhrasing: ['更好的說法。'],
  checklist: ['一', '二', '三'],
  status: 'draft',
  updated: '2026-09-26',
};

function entry(id: string, extra: Record<string, unknown> = {}, body = ''): SourceDoc {
  return { file: `${id}.md`, fileId: id, data: { ...baseEntry, id, ...extra }, body };
}

function scenario(id: string, extra: Record<string, unknown>, body = ''): SourceDoc {
  return { file: `${id}.md`, fileId: id, data: { ...baseScenario, id, ...extra }, body };
}

const cards = [entry('a'), entry('b'), entry('c')];
const q = (id: string, extra: Record<string, unknown> = {}, body = '') =>
  scenario(id, { answer: 'a', distractors: ['b', 'c'], ...extra }, body);

function run(input: { entries?: SourceDoc[]; scenarios?: SourceDoc[]; terms?: SourceDoc[] }) {
  return checkContent({ entries: cards, scenarios: [], terms: [], ...input });
}

describe('schema', () => {
  it('passes valid content', () => {
    expect(run({ scenarios: [q('daily-001')] }).errors).toEqual([]);
  });

  it('rejects misspelled (unknown) fields', () => {
    const { errors } = run({ entries: [...cards, entry('d', { charitableRespose: 'x' })] });
    expect(errors.join()).toMatch(/charitableRespose/);
  });

  it('requires notFallacyWhen / charitableResponse for fallacy and bias cards', () => {
    const { errors } = run({
      entries: [...cards, entry('d', { kind: 'bias', notFallacyWhen: undefined })],
    });
    expect(errors.join()).toMatch(/notFallacyWhen/);
  });

  it('does not require them for law / inference cards', () => {
    const law = entry('d', {
      kind: 'law',
      notFallacyWhen: undefined,
      charitableResponse: undefined,
    });
    expect(run({ entries: [...cards, law] }).errors).toEqual([]);
  });

  it('requires reviewers when reviewed', () => {
    const { errors } = run({ entries: [...cards, entry('d', { status: 'reviewed' })] });
    expect(errors.join()).toMatch(/reviewers/);
  });

  it('enforces summary max length 60', () => {
    const { errors } = run({ entries: [...cards, entry('d', { summary: '字'.repeat(61) })] });
    expect(errors.join()).toMatch(/summary/);
  });

  it('enforces isControl ⇔ answer none', () => {
    expect(run({ scenarios: [q('daily-001', { isControl: true })] }).errors.join()).toMatch(
      /isControl/,
    );
    expect(run({ scenarios: [q('daily-001', { answer: 'none' })] }).errors.join()).toMatch(
      /isControl/,
    );
  });

  it('rejects scenario id that does not match theme', () => {
    const { errors } = run({ scenarios: [q('cons-001')] });
    expect(errors.join()).toMatch(/theme/);
  });
});

describe('ids', () => {
  it('rejects id different from file name', () => {
    const bad = { ...entry('d'), fileId: 'e' };
    expect(run({ entries: [...cards, bad] }).errors.join()).toMatch(/檔名/);
  });

  it('rejects duplicate ids', () => {
    expect(run({ entries: [...cards, entry('a')] }).errors.join()).toMatch(/重複/);
  });
});

describe('references', () => {
  it('rejects missing related / pairWith / terms', () => {
    const { errors } = run({
      entries: [...cards, entry('d', { related: ['zz'], pairWith: 'yy', terms: ['premise'] })],
    });
    expect(errors).toHaveLength(3);
  });

  it('rejects missing answer and distractors', () => {
    const { errors } = run({
      scenarios: [q('daily-001', { answer: 'zz', distractors: ['b', 'yy'] })],
    });
    expect(errors.join()).toMatch(/answer.*zz/);
    expect(errors.join()).toMatch(/distractors.*yy/);
  });

  it('rejects distractor equal to answer', () => {
    const { errors } = run({ scenarios: [q('daily-001', { distractors: ['a', 'b'] })] });
    expect(errors.join()).toMatch(/正解/);
  });

  it('rejects reviewed content referencing draft content', () => {
    const reviewed = entry('d', { status: 'reviewed', reviewers: ['someone'], related: ['a'] });
    expect(run({ entries: [...cards, reviewed] }).errors.join()).toMatch(/未審/);
  });

  it('allows reviewed content referencing reviewed content', () => {
    const r = { status: 'reviewed', reviewers: ['someone'] };
    const list = [entry('a', r), entry('d', { ...r, related: ['a'] })];
    expect(run({ entries: list }).errors).toEqual([]);
  });
});

describe('body term markers', () => {
  const premise = (status = 'draft'): SourceDoc => ({
    file: 'terms.yaml[0]',
    data: { id: 'premise', term: '前提', en: 'Premise', definition: 'd', status },
    body: '',
  });

  it('rejects unknown term ids in the body', () => {
    const { errors } = run({
      entries: [...cards, entry('d', {}, '看[[nope]]')],
      terms: [premise()],
    });
    expect(errors.join()).toMatch(/nope/);
  });

  it('rejects reviewed bodies that mark draft terms', () => {
    const r = { status: 'reviewed', reviewers: ['someone'] };
    const { errors } = run({ entries: [entry('d', r, '[[premise|理由]]')], terms: [premise()] });
    expect(errors.join()).toMatch(/未審/);
  });

  it('accepts known terms', () => {
    const { errors } = run({
      entries: [...cards, entry('d', {}, '[[premise]]')],
      terms: [premise()],
    });
    expect(errors).toEqual([]);
  });
});

describe('writing rules', () => {
  it.each([
    ['網址', '請看 https://example.org'],
    ['Email', '寫信到 someone@example.org'],
    ['電話', '請撥 0912-345-678'],
    ['電話', '請撥 02 2345 6789'],
  ])('rejects %s in scenario text', (label, body) => {
    expect(run({ scenarios: [q('daily-001', {}, body)] }).errors.join()).toMatch(label);
  });

  it('does not flag ordinary numbers', () => {
    const body = '這片濕地有 120 隻鳥，2026 年調查。';
    expect(run({ scenarios: [q('daily-001', {}, body)] }).errors).toEqual([]);
  });

  it('rejects raw HTML in bodies', () => {
    const { errors } = run({
      entries: [...cards, entry('d', {}, '<script>alert(1)</script>')],
      scenarios: [q('daily-001', {}, '<img src=x onerror=alert(1)>')],
    });
    expect(errors.filter((e) => e.includes('HTML'))).toHaveLength(2);
  });
});

describe('control ratio', () => {
  const reviewed = { status: 'reviewed', reviewers: ['someone'] };
  const reviewedCards = cards.map((c) => entry(c.fileId ?? '', reviewed));
  const questions = (controls: number, total: number, extra = reviewed) =>
    Array.from({ length: total }, (_, i) => {
      const id = `daily-${String(i + 1).padStart(3, '0')}`;
      return i < controls ? q(id, { ...extra, isControl: true, answer: 'none' }) : q(id, extra);
    });

  it('errors when published ratio is out of 15%–30%', () => {
    const { errors } = run({ entries: reviewedCards, scenarios: questions(0, 10) });
    expect(errors.join()).toMatch(/對照題比例/);
  });

  it('passes when published ratio is within range', () => {
    const { errors } = run({ entries: reviewedCards, scenarios: questions(2, 10) });
    expect(errors).toEqual([]);
  });

  it('only warns while drafts are out of range', () => {
    const result = run({ scenarios: questions(0, 5, { status: 'draft', reviewers: [] }) });
    expect(result.errors).toEqual([]);
    expect(result.warnings.join()).toMatch(/對照題比例/);
  });
});

describe('loadContent (fixtures)', () => {
  it('valid fixture passes', () => {
    expect(checkContent(loadContent('tests/fixtures/content-valid')).errors).toEqual([]);
  });

  it('a misspelled content field fails the check', () => {
    const { errors } = checkContent(loadContent('tests/fixtures/content-invalid'));
    expect(errors.join()).toMatch(/charitableRespose/);
  });
});
