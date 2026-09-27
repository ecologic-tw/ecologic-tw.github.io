import { describe, expect, it } from 'vitest';
import {
  BADGES,
  collectedEntries,
  earnedBadges,
  type ContentIndex,
  type ScenarioInfo,
} from '../../src/lib/badges.ts';
import { defaults, type Progress } from '../../src/lib/progress.ts';
import { collectableEntries } from '../../src/lib/quiz.ts';

const s = (id: string, answer: string, extra: Partial<ScenarioInfo> = {}): ScenarioInfo => ({
  id,
  theme: id.startsWith('daily') ? 'daily' : 'conservation',
  difficulty: 'basic',
  isControl: answer === 'none',
  collects: collectableEntries({ format: 'judge', answer }),
  ...extra,
});

const index: ContentIndex = {
  entries: ['straw-man', 'fallacy-fallacy', 'modus-ponens'],
  scenarios: [
    s('daily-001', 'straw-man'),
    s('daily-002', 'none'),
    s('daily-003', 'fallacy-fallacy'),
    s('daily-004', 'straw-man', { difficulty: 'advanced' }),
    s('cons-001', 'none'),
    s('cons-002', 'none'),
  ],
};

const progress = (change: Partial<Progress> = {}): Progress => ({ ...defaults(), ...change });
const answers = (...list: [string, boolean][]) =>
  Object.fromEntries(list.map(([id, correct]) => [id, { correct, at: 't' }]));

describe('badge definitions', () => {
  it('match the seven badges in docs/sdd/05', () => {
    expect(BADGES.map((b) => b.title)).toEqual([
      '初入步道',
      '日常觀察者',
      '保育觀察者',
      '手下留情',
      '換句話說',
      '圖鑑收藏家',
      '謬誤的謬誤',
    ]);
  });

  it('never award anything to a new visitor', () => {
    expect(earnedBadges(progress(), index)).toEqual([]);
  });
});

describe('earnedBadges', () => {
  it('初入步道: any answered question, right or wrong', () => {
    const p = progress({ answered: answers(['daily-001', false]) });
    expect(earnedBadges(p, index)).toContain('first-step');
  });

  it('ignores answers to questions that are no longer published', () => {
    const p = progress({ answered: answers(['daily-999', true]) });
    expect(earnedBadges(p, index)).not.toContain('first-step');
  });

  it('日常觀察者: every basic daily question answered; advanced ones not required', () => {
    const almost = progress({ answered: answers(['daily-001', true], ['daily-002', false]) });
    expect(earnedBadges(almost, index)).not.toContain('daily-observer');
    const done = progress({
      answered: answers(['daily-001', true], ['daily-002', false], ['daily-003', false]),
    });
    expect(earnedBadges(done, index)).toContain('daily-observer');
  });

  it('theme badges need at least one published question', () => {
    const empty: ContentIndex = { entries: [], scenarios: [] };
    expect(earnedBadges(progress(), empty)).toEqual([]);
  });

  it('手下留情: three control questions answered correctly', () => {
    const two = progress({ answered: answers(['daily-002', true], ['cons-001', true]) });
    expect(earnedBadges(two, index)).not.toContain('gentle');
    const wrongThird = progress({
      answered: answers(['daily-002', true], ['cons-001', true], ['cons-002', false]),
    });
    expect(earnedBadges(wrongThird, index)).not.toContain('gentle');
    const three = progress({
      answered: answers(['daily-002', true], ['cons-001', true], ['cons-002', true]),
    });
    expect(earnedBadges(three, index)).toContain('gentle');
  });

  it('換句話說: five rewrite self-checks', () => {
    expect(earnedBadges(progress({ rewrites: 4 }), index)).not.toContain('rephraser');
    expect(earnedBadges(progress({ rewrites: 5 }), index)).toContain('rephraser');
  });

  it('圖鑑收藏家: every published card lit, by answers or quick checks', () => {
    const partial = progress({
      answered: answers(['daily-001', true], ['daily-003', true]),
    });
    expect(earnedBadges(partial, index)).not.toContain('collector');
    const full = progress({
      answered: answers(['daily-001', true], ['daily-003', true]),
      collected: ['modus-ponens'],
    });
    expect(earnedBadges(full, index)).toContain('collector');
  });

  it('謬誤的謬誤: needs both reading the card and a correct answer', () => {
    const onlyRead = progress({ read: ['fallacy-fallacy'] });
    expect(earnedBadges(onlyRead, index)).not.toContain('fallacy-of-fallacy');
    const onlyAnswer = progress({ answered: answers(['daily-003', true]) });
    expect(earnedBadges(onlyAnswer, index)).not.toContain('fallacy-of-fallacy');
    const both = progress({ read: ['fallacy-fallacy'], answered: answers(['daily-003', true]) });
    expect(earnedBadges(both, index)).toContain('fallacy-of-fallacy');
  });
});

describe('collectedEntries', () => {
  it('lights a card only after a correct answer to one of its questions', () => {
    const wrong = progress({ answered: answers(['daily-001', false]) });
    expect(collectedEntries(wrong, index).has('straw-man')).toBe(false);
    const right = progress({ answered: answers(['daily-001', true]) });
    expect(collectedEntries(right, index).has('straw-man')).toBe(true);
  });

  it('never lights anything for control questions', () => {
    const p = progress({ answered: answers(['daily-002', true]) });
    expect(collectedEntries(p, index).size).toBe(0);
  });

  it('ignores stored ids of cards that are not published', () => {
    const p = progress({ collected: ['modus-ponens', 'retired-card'] });
    expect([...collectedEntries(p, index)]).toEqual(['modus-ponens']);
  });
});

describe('advanced formats (ADR-0022)', () => {
  const advanced: ContentIndex = {
    entries: ['straw-man', 'false-dilemma', 'fallacy-fallacy'],
    scenarios: [
      s('daily-001', 'straw-man'),
      {
        ...s('daily-010', 'none', { difficulty: 'advanced', isControl: false }),
        collects: collectableEntries({
          format: 'multi',
          answers: ['false-dilemma', 'fallacy-fallacy'],
        }),
      },
      {
        ...s('daily-011', 'none', { difficulty: 'advanced', isControl: false }),
        collects: collectableEntries({ format: 'choice' }),
      },
    ],
  };

  it('a fully correct multi question lights every one of its answers', () => {
    const p = progress({ answered: answers(['daily-010', true]) });
    expect([...collectedEntries(p, advanced)].sort()).toEqual(['fallacy-fallacy', 'false-dilemma']);
    const wrong = progress({ answered: answers(['daily-010', false]) });
    expect(collectedEntries(wrong, advanced).size).toBe(0);
  });

  it('choice and validity-soundness questions light no card', () => {
    const p = progress({ answered: answers(['daily-011', true]) });
    expect(collectedEntries(p, advanced).size).toBe(0);
  });

  it('a multi answer can complete 謬誤的謬誤, and advanced questions never count as controls', () => {
    const p = progress({ read: ['fallacy-fallacy'], answered: answers(['daily-010', true]) });
    expect(earnedBadges(p, advanced)).toContain('fallacy-of-fallacy');
    expect(earnedBadges(p, advanced)).not.toContain('gentle');
  });
});
