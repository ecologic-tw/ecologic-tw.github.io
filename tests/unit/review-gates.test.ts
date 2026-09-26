import { describe, expect, it } from 'vitest';
import {
  entrySchema,
  scenarioSchema,
  createScenarioSchema,
  termSchema,
} from '../../src/lib/content-schema.ts';

const meta = {
  status: 'reviewed',
  updated: '2026-09-27',
  reviewers: ['alice'],
  sources: [{ title: 'Reference' }],
};
const term = { id: 'premise', term: '前提', en: 'Premise', definition: '定義', ...meta };
const entry = {
  id: 'test',
  kind: 'bias',
  title: '測試',
  en: 'Test',
  summary: '摘要',
  notFallacyWhen: '條件',
  charitableResponse: '回應',
  ...meta,
};
const scenario = {
  id: 'daily-001',
  theme: 'daily',
  title: '情境',
  isControl: true,
  answer: 'none',
  distractors: ['a', 'b'],
  difficulty: 'basic',
  betterPhrasing: ['改寫'],
  checklist: ['一', '二', '三'],
  ...meta,
};

describe('shared review gates', () => {
  it.each([
    [entrySchema, entry],
    [scenarioSchema, scenario],
    [termSchema, term],
  ] as const)(
    'requires a source and a named reviewer for every reviewed content type',
    (schema, content) => {
      expect(schema.safeParse(content).success).toBe(true);
      for (const invalid of [
        { sources: [] },
        { sources: [{ title: '  ' }] },
        { reviewers: [] },
        { reviewers: ['  '] },
      ]) {
        expect(schema.safeParse({ ...content, ...invalid }).success).toBe(false);
      }
      expect(
        schema.safeParse({ ...content, status: 'draft', sources: [], reviewers: [] }).success,
      ).toBe(true);
      expect(schema.safeParse({ ...content, requiresSecondReview: true }).success).toBe(false);
      expect(
        schema.safeParse({ ...content, requiresSecondReview: true, reviewers: ['Alice', 'alice'] })
          .success,
      ).toBe(false);
      expect(
        schema.safeParse({ ...content, requiresSecondReview: true, reviewers: ['alice', 'bob'] })
          .success,
      ).toBe(true);
    },
  );

  it('keeps control double review disabled in the deployed schema', () => {
    expect(scenarioSchema.safeParse(scenario).success).toBe(true);
  });

  it('can activate control double review without weakening controversy requirements', () => {
    const strict = createScenarioSchema({ controlRequiresSecondReview: true });
    expect(strict.safeParse(scenario).success).toBe(false);
    expect(strict.safeParse({ ...scenario, reviewers: ['alice', 'Alice'] }).success).toBe(false);
    expect(strict.safeParse({ ...scenario, reviewers: ['alice', 'bob'] }).success).toBe(true);
    expect(strict.safeParse({ ...scenario, isControl: false, answer: 'c' }).success).toBe(true);
    expect(strict.safeParse({ ...scenario, status: 'draft', reviewers: [] }).success).toBe(true);
  });

  it('requires updated metadata on terms and checks source claim annotations', () => {
    expect(termSchema.safeParse({ ...term, updated: undefined }).success).toBe(false);
    expect(
      termSchema.safeParse({ ...term, sources: [{ title: 'Reference', supports: ['  '] }] })
        .success,
    ).toBe(false);
  });
});
