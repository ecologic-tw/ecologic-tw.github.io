import { describe, expect, it } from 'vitest';
import { NO_PROBLEM, buildOptions, isCorrect, shuffle } from '../../src/lib/quiz.ts';

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
