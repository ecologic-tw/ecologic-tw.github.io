import { describe, expect, it } from 'vitest';
import { caseQuestions, validateCaseBody } from '../../src/lib/cases.ts';

describe('cases (ADR-0036)', () => {
  it('lists a case’s questions in id order', () => {
    const q = (id: string, caseId?: string) => ({ id, data: { case: caseId } });
    const scenarios = [
      q('daily-012', 'daily-case-01'),
      q('daily-003'),
      q('daily-010', 'daily-case-01'),
    ];
    expect(caseQuestions('daily-case-01', scenarios).map((s) => s.id)).toEqual([
      'daily-010',
      'daily-012',
    ]);
    expect(caseQuestions('daily-case-02', scenarios)).toEqual([]);
  });

  it('requires both the background and the closing perspective', () => {
    expect(validateCaseBody('## 背景\n背景。\n\n## 換個位置想\n收尾。')).toEqual([]);
    expect(validateCaseBody('## 背景\n\n## 換個位置想\n收尾。')).toEqual([
      '本文: 請補「## 背景」及非空白內容',
    ]);
  });
});
