import { describe, expect, it } from 'vitest';
import {
  CHALLENGE_SIZE,
  drawChallenge,
  parseState,
  type ChallengeItem,
} from '../../src/lib/challenge.ts';

const item = (
  id: string,
  theme: string,
  answer: string,
  extra: Partial<ChallengeItem> = {},
): ChallengeItem => ({
  id,
  theme,
  answer,
  advanced: false,
  control: answer === 'none',
  ...extra,
});

// 日常 6 題（1 題對照題）、保育 4 題（1 題對照題）；正解卡 a–f 有重複
const pool: ChallengeItem[] = [
  item('daily-001', 'daily', 'a'),
  item('daily-002', 'daily', 'a'),
  item('daily-003', 'daily', 'b'),
  item('daily-004', 'daily', 'c'),
  item('daily-005', 'daily', 'none'),
  item('daily-006', 'daily', 'd', { advanced: true }),
  item('cons-001', 'conservation', 'b'),
  item('cons-002', 'conservation', 'e'),
  item('cons-003', 'conservation', 'f'),
  item('cons-004', 'conservation', 'none'),
];
const byId = new Map(pool.map((i) => [i.id, i]));

/** 固定亂數序列，讓每次測試可重現 */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    return s / 2 ** 31;
  };
}

const draw = (answered: string[] = [], advanced = false, seed = 1, items = pool) =>
  drawChallenge(items, { advanced, answered: new Set(answered), random: seeded(seed) });

describe('drawChallenge (ADR-0032)', () => {
  it('draws five questions with exactly one control, both themes and distinct answers', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const result = draw([], false, seed);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const picked = result.ids.map((id) => byId.get(id) as ChallengeItem);
      expect(picked).toHaveLength(CHALLENGE_SIZE);
      expect(new Set(result.ids).size).toBe(CHALLENGE_SIZE);
      expect(picked.filter((i) => i.control)).toHaveLength(1);
      expect(new Set(picked.map((i) => i.theme)).size).toBe(2);
      const answers = picked.filter((i) => !i.control).map((i) => i.answer);
      expect(new Set(answers).size).toBe(answers.length);
    }
  });

  it('skips advanced questions in basic mode and may use them in advanced mode', () => {
    const basic = new Set<string>();
    const advanced = new Set<string>();
    for (let seed = 1; seed <= 50; seed++) {
      const b = draw([], false, seed);
      const a = draw([], true, seed);
      if (b.ok) b.ids.forEach((id) => basic.add(id));
      if (a.ok) a.ids.forEach((id) => advanced.add(id));
    }
    expect(basic.has('daily-006')).toBe(false);
    expect(advanced.has('daily-006')).toBe(true);
  });

  it('prefers questions that have not been answered', () => {
    const answered = ['daily-001', 'daily-002', 'daily-005'];
    for (let seed = 1; seed <= 20; seed++) {
      const result = draw(answered, false, seed);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.ids.some((id) => answered.includes(id))).toBe(false);
      expect(result.includesAnswered).toBe(false);
    }
  });

  it('falls back to answered questions and says so', () => {
    const everything = pool.map((i) => i.id);
    const result = draw(everything);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.includesAnswered).toBe(true);
  });

  it('cannot start without a control question', () => {
    expect(
      draw(
        [],
        false,
        1,
        pool.filter((i) => !i.control),
      ).ok,
    ).toBe(false);
  });

  it('cannot start with only one theme', () => {
    expect(
      draw(
        [],
        false,
        1,
        pool.filter((i) => i.theme === 'daily'),
      ).ok,
    ).toBe(false);
  });

  it('cannot start with too few distinct answer cards', () => {
    const narrow = [
      item('daily-001', 'daily', 'a'),
      item('daily-002', 'daily', 'a'),
      item('daily-003', 'daily', 'b'),
      item('daily-005', 'daily', 'none'),
      item('cons-001', 'conservation', 'b'),
      item('cons-002', 'conservation', 'c'),
    ];
    expect(draw([], false, 1, narrow).ok).toBe(false);
  });
});

describe('parseState', () => {
  const known = new Map(
    ['daily-001', 'daily-003', 'daily-005', 'cons-002', 'cons-004'].map((id) => [
      id,
      new Set(['a', 'b', 'none']),
    ]),
  );
  const valid = {
    ids: ['daily-001', 'daily-003', 'daily-005', 'cons-002', 'cons-004'],
    choices: ['a', null, 'none', null, null],
    index: 1,
    includesAnswered: true,
  };

  it('restores a valid state', () => {
    expect(parseState(JSON.stringify(valid), known)).toEqual(valid);
  });

  it('treats a missing includesAnswered flag as false', () => {
    const old = { ids: valid.ids, choices: valid.choices, index: valid.index };
    expect(parseState(JSON.stringify(old), known)?.includesAnswered).toBe(false);
  });

  it.each([
    ['missing', null],
    ['not JSON', '{'],
    ['wrong length', JSON.stringify({ ...valid, ids: valid.ids.slice(1) })],
    ['unknown question', JSON.stringify({ ...valid, ids: ['x', ...valid.ids.slice(1)] })],
    ['unknown option', JSON.stringify({ ...valid, choices: ['zzz', null, null, null, null] })],
    ['index out of range', JSON.stringify({ ...valid, index: 5 })],
    ['duplicate ids', JSON.stringify({ ...valid, ids: [...valid.ids.slice(0, 4), 'daily-001'] })],
  ])('discards %s', (_, text) => {
    expect(parseState(text, known)).toBeUndefined();
  });
});
