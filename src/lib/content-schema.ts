// 內容 schema 單一來源（docs/sdd/03-content-schema.md）。
// 同時供 src/content.config.ts（建置期驗證）與 scripts/check-content.ts（交叉參照檢查）使用，
// 因此只能 import 'astro/zod'，不可 import 'astro:content' 等虛擬模組。
import { z } from 'astro/zod';

export const ENTRY_KINDS = [
  'law',
  'inference',
  'formal-fallacy',
  'informal-fallacy',
  'bias',
] as const;
export const STATUSES = ['draft', 'reviewed', 'retired'] as const;
export const THEMES = ['daily', 'conservation'] as const;

/** 情境題 answer 為「推理沒有問題」時的值 */
export const NO_PROBLEM = 'none';

const reviewMeta = {
  status: z.enum(STATUSES),
  reviewers: z.array(z.string()).default([]),
  sources: z.array(z.object({ title: z.string(), url: z.url().optional() })).default([]),
  updated: z.coerce.date(),
  aiAssisted: z.boolean().default(false),
};

type ReviewMeta = { status: string; reviewers: string[] };

function requireReviewers(data: ReviewMeta, ctx: z.RefinementCtx) {
  if (data.status === 'reviewed' && data.reviewers.length < 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['reviewers'],
      message: 'status 為 reviewed 時，reviewers 至少需 1 人',
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
  });

export const scenarioSchema = z
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
    requireReviewers(data, ctx);
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

// 03 的名詞範例只有 status，未含 reviewers／updated，故名詞不套用 reviewMeta 的 refine。
export const termSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    term: z.string(),
    en: z.string(),
    definition: z.string(),
    status: z.enum(STATUSES),
    aiAssisted: z.boolean().default(false),
  })
  .strict();

export type EntryData = z.output<typeof entrySchema>;
export type ScenarioData = z.output<typeof scenarioSchema>;
export type TermData = z.output<typeof termSchema>;
