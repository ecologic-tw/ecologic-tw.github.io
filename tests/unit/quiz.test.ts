import { describe, expect, it } from 'vitest';
import {
  DISAGREEMENT_ENTRY,
  NO_PROBLEM,
  buildOptions,
  collectableEntries,
  gradeClassify,
  gradeMulti,
  isCorrect,
  shuffle,
  soundnessOf,
} from '../../src/lib/quiz.ts';

describe('buildOptions', () => {
  it('includes the answer, every distractor and "none"', () => {
    const options = buildOptions('straw-man', ['ad-hominem', 'false-dilemma']);
    expect(options).toHaveLength(4);
    expect(options).toEqual(
      expect.arrayContaining(['straw-man', 'ad-hominem', 'false-dilemma', NO_PROBLEM]),
    );
  });

  it('does not duplicate "none" for control questions', () => {
    const options = buildOptions(NO_PROBLEM, ['straw-man', 'ad-hominem', 'false-dilemma']);
    expect(options.filter((o) => o === NO_PROBLEM)).toHaveLength(1);
    expect(options).toHaveLength(4);
  });
});

describe('shuffle', () => {
  const options = ['a', 'b', 'c', 'd'];

  it('keeps every option exactly once', () => {
    for (let i = 0; i < 200; i++) {
      const result = shuffle(options);
      expect(result).toHaveLength(options.length);
      expect(new Set(result).size).toBe(options.length);
      expect([...result].sort()).toEqual(options);
    }
  });

  it('does not mutate the input', () => {
    const input = [...options];
    shuffle(input);
    expect(input).toEqual(options);
  });

  it('can place every option in every position', () => {
    const seen = new Map(options.map((o) => [o, new Set<number>()]));
    for (let i = 0; i < 500; i++) {
      shuffle(options).forEach((o, pos) => seen.get(o)?.add(pos));
    }
    for (const positions of seen.values()) expect(positions.size).toBe(options.length);
  });

  it('is deterministic with an injected random source', () => {
    const fixed = () => 0;
    expect(shuffle(options, fixed)).toEqual(shuffle(options, fixed));
  });
});

describe('isCorrect', () => {
  it('compares the choice with the answer', () => {
    expect(isCorrect('straw-man', 'straw-man')).toBe(true);
    expect(isCorrect(NO_PROBLEM, 'straw-man')).toBe(false);
  });
});

describe('collectableEntries (ADR-0022)', () => {
  it('keeps judge questions as before: the answer, or nothing for controls', () => {
    expect(collectableEntries({ format: 'judge', answer: 'straw-man' })).toEqual(['straw-man']);
    expect(collectableEntries({ format: 'judge', answer: NO_PROBLEM })).toEqual([]);
  });

  it('returns every answer of a multi question, but not acceptable ones', () => {
    expect(
      collectableEntries({ format: 'multi', answers: ['straw-man', 'false-dilemma'] }),
    ).toEqual(['straw-man', 'false-dilemma']);
  });

  it('returns nothing for question types that are not about a card', () => {
    expect(collectableEntries({ format: 'validity-soundness' })).toEqual([]);
    expect(collectableEntries({ format: 'choice' })).toEqual([]);
  });
});

describe('gradeMulti (ADR-0022)', () => {
  const options = [
    { id: 'ad-hominem', role: 'answer' },
    { id: 'false-dilemma', role: 'answer' },
    { id: 'straw-man', role: 'acceptable' },
    { id: 'slippery-slope', role: 'distractor' },
  ] as const;
  const grade = (...ids: string[]) => gradeMulti(options, new Set(ids));

  it('is correct only with every answer and no distractor', () => {
    expect(grade('ad-hominem', 'false-dilemma').correct).toBe(true);
    expect(grade('ad-hominem').correct).toBe(false);
    expect(grade('ad-hominem', 'false-dilemma', 'slippery-slope').correct).toBe(false);
  });

  it('ignores acceptable options either way', () => {
    expect(grade('ad-hominem', 'false-dilemma', 'straw-man').correct).toBe(true);
    expect(grade('ad-hominem', 'false-dilemma').marks.get('straw-man')).toBe('acceptable');
  });

  it('marks every option', () => {
    const { marks } = grade('ad-hominem', 'slippery-slope');
    expect(Object.fromEntries(marks)).toEqual({
      'ad-hominem': 'hit',
      'false-dilemma': 'missed',
      'straw-man': 'acceptable',
      'slippery-slope': 'wrong',
    });
    expect(grade('ad-hominem', 'false-dilemma').marks.get('slippery-slope')).toBe('clear');
  });
});

describe('gradeClassify (ADR-0034)', () => {
  const items = [
    { id: 'one', answer: 'fact', acceptable: [] },
    { id: 'two', answer: 'definition', acceptable: ['value'] },
  ];

  it('is correct when every statement is right or acceptable', () => {
    const { correct, marks } = gradeClassify(
      items,
      new Map([
        ['one', 'fact'],
        ['two', 'value'],
      ]),
    );
    expect(correct).toBe(true);
    expect([...marks.values()]).toEqual(['right', 'acceptable']);
  });

  it('is not correct when any statement is wrong or missing', () => {
    expect(
      gradeClassify(
        items,
        new Map([
          ['one', 'value'],
          ['two', 'definition'],
        ]),
      ).correct,
    ).toBe(false);
    expect(gradeClassify(items, new Map([['one', 'fact']])).marks.get('two')).toBe('wrong');
  });

  it('lights the kinds-of-disagreement card', () => {
    expect(collectableEntries({ format: 'classify' })).toEqual([DISAGREEMENT_ENTRY]);
  });
});

describe('soundnessOf', () => {
  it('is sound only when valid with credible premises', () => {
    expect(soundnessOf('valid', 'credible')).toBe('sound');
    expect(soundnessOf('valid', 'not-credible')).toBe('unsound');
    expect(soundnessOf('invalid', 'credible')).toBe('unsound');
    expect(soundnessOf('invalid', 'uncertain')).toBe('unsound');
    expect(soundnessOf('valid', 'uncertain')).toBe('unknown');
  });
});
