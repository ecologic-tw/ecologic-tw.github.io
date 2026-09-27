// ADR-0022：情境題依 format 區分題型；既有題目預設為 judge。
import { describe, expect, it } from 'vitest';
import { checkContent, type SourceDoc } from '../../src/lib/content-checks.ts';
import { scenarioSchema } from '../../src/lib/content-schema.ts';

const cards: SourceDoc[] = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({
  file: `${id}.md`,
  fileId: id,
  data: {
    id,
    kind: 'informal-fallacy',
    title: `卡 ${id}`,
    en: 'Test',
    summary: '一句話定義。',
    notFallacyWhen: '某條件下合理。',
    charitableResponse: '善意回應。',
    status: 'draft',
    updated: '2026-09-27',
  },
  body: '',
}));

const base = {
  theme: 'daily',
  title: '進階測試',
  difficulty: 'advanced',
  status: 'draft',
  updated: '2026-09-27',
};

const notesFor = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, `${id} 的解說`]));

const multi = {
  ...base,
  format: 'multi',
  answers: ['a', 'b'],
  acceptable: ['c'],
  distractors: ['d'],
  notes: notesFor(['a', 'b', 'c', 'd']),
  betterPhrasing: ['更好的說法。'],
  checklist: ['一', '二', '三'],
};

const validitySoundness = {
  ...base,
  format: 'validity-soundness',
  validity: 'valid',
  premises: 'uncertain',
  notes: { validity: '形式有效。', premises: '前提無法確認。' },
};

const choice = {
  ...base,
  format: 'choice',
  task: 'hidden-premise',
  prompt: '這段推理沒有說出口的前提是？',
  choices: [
    { text: '前提一', correct: true, note: '這是正解。' },
    { text: '前提二', note: '與結論無關。' },
    { text: '前提三', note: '題幹已經說了。' },
  ],
};

const doc = (id: string, data: Record<string, unknown>, body = ''): SourceDoc => ({
  file: `${id}.md`,
  fileId: id,
  data: { ...data, id },
  body,
});

const run = (...scenarios: SourceDoc[]) => checkContent({ entries: cards, scenarios, terms: [] });
const errorsOf = (data: Record<string, unknown>) => run(doc('daily-001', data)).errors.join('\n');

describe('format defaults', () => {
  it('treats a scenario without format as judge, unchanged', () => {
    const parsed = scenarioSchema.parse({
      ...base,
      id: 'daily-001',
      difficulty: 'basic',
      answer: 'a',
      distractors: ['b', 'c'],
      betterPhrasing: ['更好的說法。'],
      checklist: ['一', '二', '三'],
    });
    expect(parsed.format).toBe('judge');
  });

  it('rejects an unknown format', () => {
    expect(errorsOf({ ...multi, format: 'drag-and-drop' })).toMatch(/format/);
  });

  it('accepts valid multi, validity-soundness and choice questions', () => {
    const { errors } = run(
      doc('daily-001', multi),
      doc('daily-002', validitySoundness),
      doc('daily-003', choice),
    );
    expect(errors).toEqual([]);
  });

  it('keeps new formats out of basic mode and out of control questions', () => {
    expect(errorsOf({ ...choice, difficulty: 'basic' })).toMatch(/difficulty/);
    expect(errorsOf({ ...validitySoundness, isControl: true })).toMatch(/isControl/);
  });

  it('rejects fields that belong to another format', () => {
    expect(errorsOf({ ...choice, answer: 'a' })).toMatch(/answer/);
  });
});

describe('multi', () => {
  it('checks that every option refers to an existing card', () => {
    const errors = errorsOf({
      ...multi,
      distractors: ['missing'],
      notes: notesFor(['a', 'b', 'c', 'missing']),
    });
    expect(errors).toMatch(/distractors.*missing/);
  });

  it('does not offer "none"', () => {
    const errors = errorsOf({
      ...multi,
      distractors: ['none'],
      notes: notesFor(['a', 'b', 'c', 'none']),
    });
    expect(errors).toMatch(/none/);
  });

  it('rejects options that appear in more than one list', () => {
    expect(errorsOf({ ...multi, acceptable: ['a'], notes: notesFor(['a', 'b', 'd']) })).toMatch(
      /重疊/,
    );
  });

  it('needs 4–6 options in total', () => {
    const three = { ...multi, acceptable: [], notes: notesFor(['a', 'b', 'd']) };
    expect(errorsOf(three)).toMatch(/選項共 4–6 個/);
  });

  it('requires a note for every option and nothing else', () => {
    expect(errorsOf({ ...multi, notes: notesFor(['a', 'b', 'c']) })).toMatch(/缺少：d/);
    expect(errorsOf({ ...multi, notes: notesFor(['a', 'b', 'c', 'd', 'e']) })).toMatch(
      /不是選項的 id：e/,
    );
  });

  it('keeps rewrite practice required', () => {
    expect(errorsOf({ ...multi, betterPhrasing: undefined })).toMatch(/betterPhrasing/);
  });
});

describe('validity-soundness and choice', () => {
  it('requires a note for both axes', () => {
    expect(errorsOf({ ...validitySoundness, notes: { validity: '形式有效。' } })).toMatch(
      /premises/,
    );
  });

  it('requires exactly one correct choice', () => {
    const none = choice.choices.map((c) => ({ ...c, correct: false }));
    const two = choice.choices.map((c, i) => ({ ...c, correct: i < 2 }));
    expect(errorsOf({ ...choice, choices: none })).toMatch(/恰好一個 correct/);
    expect(errorsOf({ ...choice, choices: two })).toMatch(/恰好一個 correct/);
  });

  it('applies the private-information check to custom text', () => {
    const leaky = { ...choice, prompt: '請寄信到 someone@example.com 詢問' };
    expect(errorsOf(leaky)).toMatch(/情境題文字不得含/);
  });
});

describe('control ratio', () => {
  it('counts advanced questions in the denominator', () => {
    const judge = (id: string, answer: string) =>
      doc(id, {
        ...base,
        difficulty: 'basic',
        answer,
        isControl: answer === 'none',
        distractors: ['b', 'c'],
        betterPhrasing: ['更好的說法。'],
        checklist: ['一', '二', '三'],
      });
    // 1 題對照題／3 題 = 33%（超出）；加入 1 題 multi 後 1／4 = 25%
    const { warnings } = run(
      judge('daily-001', 'none'),
      judge('daily-002', 'a'),
      judge('daily-003', 'a'),
      doc('daily-004', multi),
    );
    expect(warnings.join()).not.toMatch(/對照題比例/);
  });
});
