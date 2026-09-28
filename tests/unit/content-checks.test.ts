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
  sources: [{ title: 'Test reference' }],
};

const baseScenario = {
  theme: 'daily',
  title: '測試情境',
  difficulty: 'basic',
  betterPhrasing: ['更好的說法。'],
  checklist: ['一', '二', '三'],
  status: 'draft',
  updated: '2026-09-26',
  sources: [{ title: 'Test reference' }],
};

function entry(id: string, extra: Record<string, unknown> = {}, body = ''): SourceDoc {
  return { file: `${id}.md`, fileId: id, data: { ...baseEntry, id, ...extra }, body };
}

const validBody = '## 情境\n測試情境。\n\n## 解說\n測試解說。';

function scenario(id: string, extra: Record<string, unknown>, body = validBody): SourceDoc {
  return { file: `${id}.md`, fileId: id, data: { ...baseScenario, id, ...extra }, body };
}

const cards = [entry('a'), entry('b'), entry('c')];
const quickCheck = { question: '問題？', options: ['甲', '乙'], answer: 1, explanation: '說明' };
const q = (id: string, extra: Record<string, unknown> = {}, body = validBody) =>
  scenario(id, { answer: 'a', distractors: ['b', 'c'], ...extra }, body);

function run(input: {
  entries?: SourceDoc[];
  scenarios?: SourceDoc[];
  terms?: SourceDoc[];
  updates?: SourceDoc[];
}) {
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
      quickCheck,
    });
    expect(run({ entries: [...cards, law] }).errors).toEqual([]);
  });

  it('requires a quickCheck on law / inference cards (02 規則 4)', () => {
    const inference = entry('d', { kind: 'inference' });
    expect(run({ entries: [...cards, inference] }).errors.join()).toMatch(/quickCheck/);
  });

  it('requires a quickCheck on concept cards (ADR-0020)', () => {
    const concept = { kind: 'concept', notFallacyWhen: undefined, charitableResponse: undefined };
    expect(run({ entries: [...cards, entry('d', concept)] }).errors.join()).toMatch(/quickCheck/);
    expect(run({ entries: [...cards, entry('d', { ...concept, quickCheck })] }).errors).toEqual([]);
  });

  it('requires evidence on every bias card, draft or reviewed (ADR-0021)', () => {
    const bias = entry('d', { kind: 'bias' });
    expect(run({ entries: [...cards, bias] }).errors.join()).toMatch(/evidence/);
    const reviewed = { status: 'reviewed', reviewers: ['someone'] };
    const reviewedBias = entry('d', { kind: 'bias', ...reviewed });
    expect(run({ entries: [...cards, reviewedBias] }).errors.join()).toMatch(/evidence/);
    const withEvidence = entry('d', { kind: 'bias', evidence: 'moderate' });
    expect(run({ entries: [...cards, withEvidence] }).errors).toEqual([]);
  });

  it('rejects evidence on non-bias cards', () => {
    const { errors } = run({ entries: [...cards, entry('d', { evidence: 'robust' })] });
    expect(errors.join()).toMatch(/evidence/);
  });

  it('rejects an unknown evidence level', () => {
    const { errors } = run({
      entries: [...cards, entry('d', { kind: 'bias', evidence: 'strong' })],
    });
    expect(errors.join()).toMatch(/evidence/);
  });

  it('rejects a quickCheck answer outside the options', () => {
    const law = entry('d', { kind: 'law', quickCheck: { ...quickCheck, answer: 2 } });
    expect(run({ entries: [...cards, law] }).errors.join()).toMatch(/quickCheck\.answer/);
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
    const list = [
      entry('a', { ...r, quickCheck }),
      entry('d', { ...r, quickCheck, related: ['a'] }),
    ];
    expect(run({ entries: list }).errors).toEqual([]);
  });
});

describe('body term markers', () => {
  const premise = (status = 'draft'): SourceDoc => ({
    file: 'terms.yaml[0]',
    data: {
      id: 'premise',
      term: '前提',
      en: 'Premise',
      definition: 'd',
      updated: '2026-09-27',
      status,
    },
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
    ['', ['情境', '解說']],
    ['## 情境描述\n內容\n## 解說\n理由', ['情境']],
    ['## 情境\n內容', ['解說']],
    ['## 情境\n \t\n## 解說\n理由', ['情境']],
    ['## 情境\n內容\n## 解說\n \t', ['解說']],
  ])('rejects missing or empty required sections: %s', (body, missing) => {
    const errors = run({ scenarios: [q('daily-001', {}, body)] }).errors;
    expect(errors).toHaveLength(missing.length);
    for (const name of missing) expect(errors.join()).toContain(`## ${name}`);
  });

  it('rejects an empty reviewed scenario in an otherwise valid published collection', () => {
    const input = loadContent();
    const question = input.scenarios.find((doc) => doc.fileId === 'daily-001');
    expect(question).toBeDefined();
    if (!question) throw new Error('Missing daily-001 fixture');
    question.body = '';
    expect(checkContent(input).errors).toEqual([
      expect.stringContaining('## 情境'),
      expect.stringContaining('## 解說'),
    ]);
  });

  it('accepts CRLF sections without an optional advanced explanation', () => {
    expect(
      run({ scenarios: [q('daily-001', {}, validBody.replaceAll('\n', '\r\n'))] }).errors,
    ).toEqual([]);
  });

  it.each([
    ['網址', '請看 https://example.org'],
    ['Email', '寫信到 someone@example.org'],
    ['電話', '請撥 0912-345-678'],
    ['電話', '請撥 02 2345 6789'],
  ])('rejects %s in scenario text', (label, body) => {
    expect(run({ scenarios: [q('daily-001', {}, body)] }).errors.join()).toMatch(label);
  });

  it('does not flag ordinary numbers', () => {
    const body = `${validBody}\n這片濕地有 120 隻鳥，2026 年調查。`;
    expect(run({ scenarios: [q('daily-001', {}, body)] }).errors).toEqual([]);
  });

  it('rejects raw HTML in bodies', () => {
    const { errors } = run({
      entries: [...cards, entry('d', {}, '<script>alert(1)</script>')],
      scenarios: [q('daily-001', {}, '<img src=x onerror=alert(1)>')],
    });
    expect(errors.filter((e) => e.includes('HTML'))).toHaveLength(2);
  });

  it('rejects bold markers that CommonMark leaves as literal asterisks', () => {
    const { errors } = run({
      entries: [...cards, entry('d', {}, '- **「理解就是同意。」**善意詮釋')],
      scenarios: [q('daily-001', {}, `${validBody}\n\n**如果你是居民：**你可能`)],
    });
    expect(errors.filter((e) => e.includes('粗體沒有生效'))).toHaveLength(2);
  });

  it('accepts bold with punctuation moved outside the markers', () => {
    const body = `${validBody}\n\n**如果你是居民**：你可能\n\n- 「**理解就是同意**。」善意\n\n\`a**b\``;
    expect(run({ scenarios: [q('daily-001', {}, body)] }).errors).toEqual([]);
  });
});

describe('every published card can be collected (docs/sdd/02 rule 4)', () => {
  const reviewed = { status: 'reviewed', reviewers: ['someone'] };
  const others = ['b', 'c'].map((id) => entry(id, { ...reviewed, quickCheck }));
  const errorsFor = (id: string, input: Parameters<typeof run>[0]) =>
    run(input).errors.filter((e) => e.startsWith(`${id}.md`));

  it('rejects a reviewed card with neither a quick check nor a reviewed question answering it', () => {
    expect(errorsFor('a', { entries: [entry('a', reviewed), ...others] }).join()).toMatch(
      /已審圖鑑卡無法點亮/,
    );
  });

  it('accepts a card that has a quick check', () => {
    expect(
      errorsFor('a', { entries: [entry('a', { ...reviewed, quickCheck }), ...others] }),
    ).toEqual([]);
  });

  it('accepts a card answered by a reviewed question, but not by a draft question or as a distractor', () => {
    const entries = [entry('a', reviewed), ...others];
    const published = q('daily-001', { ...reviewed, answer: 'a', distractors: ['b', 'c'] });
    const draft = q('daily-001', { answer: 'a', distractors: ['b', 'c'] });
    const distractorOnly = q('daily-001', { ...reviewed, answer: 'b', distractors: ['a', 'c'] });
    expect(errorsFor('a', { entries, scenarios: [published] })).toEqual([]);
    expect(errorsFor('a', { entries, scenarios: [draft] })).toHaveLength(1);
    expect(errorsFor('a', { entries, scenarios: [distractorOnly] })).toHaveLength(1);
  });

  it('ignores draft cards', () => {
    expect(errorsFor('a', { entries: [entry('a'), ...others] })).toEqual([]);
  });
});

describe('control ratio', () => {
  const reviewed = { status: 'reviewed', reviewers: ['someone'] };
  // 附小檢核，讓每張卡都能點亮，只測對照題比例
  const reviewedCards = cards.map((c) => entry(c.fileId ?? '', { ...reviewed, quickCheck }));
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

describe('update notes (ADR-0025)', () => {
  const note = (id: string, extra: Record<string, unknown>): SourceDoc => ({
    file: `updates.yaml[${id}]`,
    data: { id, date: '2026-09-27', title: '修訂', summary: '改了什麼、為什麼改。', ...extra },
    body: '',
  });

  it('accepts a revision note about existing content', () => {
    const { errors, warnings } = run({
      updates: [note('n1', { kind: 'content', about: 'entry/a', impact: 'reread' })],
    });
    expect(errors).toEqual([]);
    // 測試卡是草稿：說明會等到內容通過審核才顯示
    expect(warnings.join()).toMatch(/內容通過審核前不會顯示/);
  });

  it('does not warn about unpublished content that has a withdrawal notice', () => {
    const { warnings } = run({
      updates: [
        note('n1', { kind: 'fix', about: 'entry/a' }),
        note('n2', { kind: 'notice', about: 'entry/a' }),
      ],
    });
    expect(warnings.join()).not.toMatch(/不會顯示/);
  });

  it('rejects about pointing to missing content', () => {
    const { errors } = run({ updates: [note('n1', { kind: 'fix', about: 'scenario/nope' })] });
    expect(errors.join()).toMatch(/scenario\/nope」不存在/);
  });

  it('rejects answer-changed on a card without a quick check', () => {
    const { errors } = run({
      updates: [note('n1', { kind: 'fix', about: 'entry/a', impact: 'answer-changed' })],
    });
    expect(errors.join()).toMatch(/沒有小檢核/);
  });

  it('enforces how about, impact and link combine', () => {
    const { errors } = run({
      updates: [
        note('n1', { kind: 'feature', about: 'entry/a' }),
        note('n2', { kind: 'content', impact: 'reread' }),
        note('n3', { kind: 'content', about: 'entry/a', impact: 'answer-changed' }),
        note('n4', { kind: 'notice', about: 'entry/a', link: '/guide/a/' }),
      ],
    });
    const text = errors.join('\n');
    expect(text).toMatch(/n1\].*about 只用於/);
    expect(text).toMatch(/n2\].*impact 需要搭配 about/);
    expect(text).toMatch(/n3\].*kind 需為 fix/);
    expect(text).toMatch(/n4\].*撤下公告不附 link/);
  });

  it('rejects duplicate note ids', () => {
    const { errors } = run({
      updates: [note('n1', { kind: 'feature' }), note('n1', { kind: 'feature' })],
    });
    expect(errors.join()).toMatch(/重複/);
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
