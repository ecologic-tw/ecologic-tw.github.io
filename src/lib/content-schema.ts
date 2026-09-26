// 內容 schema 單一來源（docs/sdd/03-content-schema.md）。
// 同時供 src/content.config.ts（建置期驗證）與 scripts/check-content.ts（交叉參照檢查）使用，
// 因此只能 import 'astro/zod'，不可 import 'astro:content' 等虛擬模組。
import { z } from 'astro/zod';
import { NO_PROBLEM } from './quiz.ts';
import { minimumReviewers, REVIEW_POLICY, type ReviewPolicy } from './review-policy.ts';

export const ENTRY_KINDS = [
  'law',
  'inference',
  'formal-fallacy',
  'informal-fallacy',
  'bias',
] as const;
export const STATUSES = ['draft', 'reviewed', 'retired'] as const;
export const THEMES = ['daily', 'conservation'] as const;

export { NO_PROBLEM } from './quiz.ts';

const reviewMeta = {
  status: z.enum(STATUSES),
  reviewers: z
    .array(
      z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/),
    )
    .default([]),
  sources: z
    .array(
      z
        .object({
          title: z.string().trim().min(1),
          url: z.url().optional(),
          supports: z.array(z.string().trim().min(1)).min(1).optional(),
        })
        .strict(),
    )
    .default([]),
  requiresSecondReview: z.boolean().default(false),
  updated: z.coerce.date(),
  aiAssisted: z.boolean().default(false),
};

type ReviewMeta = {
  status: string;
  reviewers: string[];
  sources: { title: string }[];
  requiresSecondReview: boolean;
  isControl?: boolean;
};

function requireReviewers(
  data: ReviewMeta,
  ctx: z.RefinementCtx,
  policy: ReviewPolicy = REVIEW_POLICY,
) {
  if (data.status !== 'reviewed') return;
  const minimum = minimumReviewers(data, policy);
  const distinct = new Set(data.reviewers.map((name) => name.toLowerCase()));
  if (distinct.size < minimum) {
    ctx.addIssue({
      code: 'custom',
      path: ['reviewers'],
      message: `status 為 reviewed 時，reviewers 至少需 ${minimum} 位不同審核者`,
    });
  }
  if (data.sources.length === 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['sources'],
      message: 'reviewed 知識內容至少需 1 項來源；人工須核對來源是否支持主張',
    });
  }
}

export const entrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(ENTRY_KINDS),
    title: z.string(),
    en: z.string(),
    summary: z.string().max(60),
    form: z.string().optional(),
    pairWith: z.string().optional(),
    notFallacyWhen: z.string().optional(),
    charitableResponse: z.string().optional(),
    // 卡內小檢核：思維定律與有效推論卡沒有對應情境題，靠它點亮（02 規則 4）
    quickCheck: z
      .object({
        question: z.string(),
        options: z.array(z.string()).min(2).max(4),
        answer: z.number().int().min(0),
        explanation: z.string(),
      })
      .strict()
      .optional(),
    related: z.array(z.string()).default([]),
    terms: z.array(z.string()).default([]),
    ...reviewMeta,
  })
  .strict()
  .superRefine((data, ctx) => {
    requireReviewers(data, ctx);
    const needsGuidance =
      data.kind === 'formal-fallacy' || data.kind === 'informal-fallacy' || data.kind === 'bias';
    if (needsGuidance) {
      for (const key of ['notFallacyWhen', 'charitableResponse'] as const) {
        if (!data[key]) {
          ctx.addIssue({ code: 'custom', path: [key], message: `謬誤、偏誤卡必填 ${key}` });
        }
      }
    }
    if ((data.kind === 'law' || data.kind === 'inference') && !data.quickCheck) {
      ctx.addIssue({
        code: 'custom',
        path: ['quickCheck'],
        message: '思維定律、有效推論卡必填 quickCheck',
      });
    }
    if (data.quickCheck && data.quickCheck.answer >= data.quickCheck.options.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['quickCheck', 'answer'],
        message: 'quickCheck.answer 必須是 options 的索引（從 0 開始）',
      });
    }
  });

export const createScenarioSchema = (policy: ReviewPolicy = REVIEW_POLICY) =>
  z
    .object({
      id: z.string().regex(/^(daily|cons)-\d{3}$/),
      theme: z.enum(THEMES),
      title: z.string(),
      isControl: z.boolean().default(false),
      answer: z.string(),
      distractors: z.array(z.string()).min(2).max(3),
      difficulty: z.enum(['basic', 'advanced']),
      betterPhrasing: z.array(z.string()).min(1).max(2),
      checklist: z.array(z.string()).min(3).max(4),
      form: z.string().optional(),
      terms: z.array(z.string()).default([]),
      ...reviewMeta,
    })
    .strict()
    .superRefine((data, ctx) => {
      requireReviewers(data, ctx, policy);
      if (data.isControl !== (data.answer === NO_PROBLEM)) {
        ctx.addIssue({
          code: 'custom',
          path: ['isControl'],
          message: `isControl 為 true 若且唯若 answer 為 '${NO_PROBLEM}'`,
        });
      }
      const idTheme = data.id.startsWith('daily-') ? 'daily' : 'conservation';
      if (idTheme !== data.theme) {
        ctx.addIssue({ code: 'custom', path: ['theme'], message: `id 前綴與 theme 不一致` });
      }
    });

// 名詞與圖鑑卡、情境題適用相同的審核門檻（ADR-0017）。
export const scenarioSchema = createScenarioSchema();
export const termSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    term: z.string(),
    en: z.string(),
    definition: z.string(),
    ...reviewMeta,
  })
  .strict()
  .superRefine(requireReviewers);

export type EntryData = z.output<typeof entrySchema>;
export type ScenarioData = z.output<typeof scenarioSchema>;
export type TermData = z.output<typeof termSchema>;
