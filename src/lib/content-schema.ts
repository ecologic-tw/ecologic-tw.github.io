// 內容 schema 單一來源（docs/sdd/03-content-schema.md）。
// 同時供 src/content.config.ts（建置期驗證）與 scripts/check-content.ts（交叉參照檢查）使用，
// 因此只能 import 'astro/zod'，不可 import 'astro:content' 等虛擬模組。
import { z } from 'astro/zod';
import { NO_PROBLEM } from './quiz.ts';
import { minimumReviewers, REVIEW_POLICY, type ReviewPolicy } from './review-policy.ts';

export const ENTRY_KINDS = [
  'concept',
  'law',
  'inference',
  'formal-fallacy',
  'informal-fallacy',
  'bias',
] as const;
export const STATUSES = ['draft', 'reviewed', 'retired'] as const;
// 認知偏誤卡的研究證據強度（ADR-0021、docs/sdd/12）。
export const EVIDENCE_LEVELS = ['robust', 'moderate', 'contested'] as const;
export const THEMES = ['daily', 'conservation'] as const;

export { NO_PROBLEM } from './quiz.ts';

const reviewMeta = {
  // 本人同意的公開名稱／筆名與實際貢獻，不等同 reviewers。
  contributors: z
    .array(
      z
        .object({
          name: z.string().trim().min(1).max(80),
          contribution: z.string().trim().min(1).max(160),
        })
        .strict(),
    )
    .default([]),
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
          url: z.url({ protocol: /^https?$/ }).optional(),
          supports: z.array(z.string().trim().min(1)).min(1).optional(),
        })
        .strict(),
    )
    .default([]),
  requiresSecondReview: z.boolean().default(false),
  updated: z.coerce.date(),
  // 首次發布日期（ADR-0024）：npm run review 首次標為 reviewed 時自動填入，勘誤不改動。
  published: z.coerce.date().optional(),
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
    evidence: z.enum(EVIDENCE_LEVELS).optional(),
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
    if (
      (data.kind === 'concept' || data.kind === 'law' || data.kind === 'inference') &&
      !data.quickCheck
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['quickCheck'],
        message: '基礎概念、思維定律、有效推論卡必填 quickCheck',
      });
    }
    if (data.evidence && data.kind !== 'bias') {
      ctx.addIssue({ code: 'custom', path: ['evidence'], message: 'evidence 只適用於認知偏誤卡' });
    }
    // ADR-0021：所有偏誤卡都必填（既有 reviewed 卡已於 2026-09-27 由人工補值）。
    if (data.kind === 'bias' && !data.evidence) {
      ctx.addIssue({
        code: 'custom',
        path: ['evidence'],
        message: '認知偏誤卡必填 evidence（robust／moderate／contested）',
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

// 情境題題型（ADR-0022）：沒有 format 的既有題目視為 judge，不需遷移或重審。
export const SCENARIO_FORMATS = ['judge', 'multi', 'validity-soundness', 'choice'] as const;
export const CHOICE_TASKS = ['hidden-premise', 'form', 'counterexample', 'steelman'] as const;
export const VALIDITY_VERDICTS = ['valid', 'invalid'] as const;
export const PREMISE_VERDICTS = ['credible', 'not-credible', 'uncertain'] as const;
/** multi 題的選項總數（answers ∪ acceptable ∪ distractors） */
export const MULTI_OPTION_COUNT = { min: 4, max: 6 } as const;

const note = z.string().trim().min(1);
const betterPhrasing = z.array(z.string()).min(1).max(2);
const checklist = z.array(z.string()).min(3).max(4);

const scenarioBase = {
  id: z.string().regex(/^(daily|cons)-\d{3}$/),
  theme: z.enum(THEMES),
  title: z.string(),
  isControl: z.boolean().default(false),
  difficulty: z.enum(['basic', 'advanced']),
  form: z.string().optional(),
  terms: z.array(z.string()).default([]),
  ...reviewMeta,
};

const judgeScenario = z
  .object({
    ...scenarioBase,
    format: z.literal('judge').default('judge'),
    answer: z.string(),
    distractors: z.array(z.string()).min(2).max(3),
    betterPhrasing,
    checklist,
  })
  .strict();

const multiScenario = z
  .object({
    ...scenarioBase,
    format: z.literal('multi'),
    answers: z.array(z.string()).min(1).max(3),
    acceptable: z.array(z.string()).max(2).default([]),
    distractors: z.array(z.string()).min(1).max(3),
    notes: z.record(z.string(), note),
    betterPhrasing,
    checklist,
  })
  .strict();

const validitySoundnessScenario = z
  .object({
    ...scenarioBase,
    format: z.literal('validity-soundness'),
    validity: z.enum(VALIDITY_VERDICTS),
    premises: z.enum(PREMISE_VERDICTS),
    notes: z.object({ validity: note, premises: note }).strict(),
    betterPhrasing: betterPhrasing.optional(),
    checklist: checklist.optional(),
  })
  .strict();

const choiceScenario = z
  .object({
    ...scenarioBase,
    format: z.literal('choice'),
    task: z.enum(CHOICE_TASKS),
    prompt: note,
    choices: z
      .array(z.object({ text: note, correct: z.boolean().default(false), note }).strict())
      .min(3)
      .max(4),
    betterPhrasing: betterPhrasing.optional(),
    checklist: checklist.optional(),
  })
  .strict();

type AnyScenario = z.output<
  | typeof judgeScenario
  | typeof multiScenario
  | typeof validitySoundnessScenario
  | typeof choiceScenario
>;

/** multi 題的全部選項 id，依 answers、acceptable、distractors 的順序 */
export function multiOptionIds(data: {
  answers: string[];
  acceptable: string[];
  distractors: string[];
}): string[] {
  return [...data.answers, ...data.acceptable, ...data.distractors];
}

function checkFormat(data: AnyScenario, ctx: z.RefinementCtx) {
  if (data.format === 'judge') return;
  if (data.difficulty !== 'advanced') {
    ctx.addIssue({
      code: 'custom',
      path: ['difficulty'],
      message: `${data.format} 題型只出現在進階模式，difficulty 必須為 advanced`,
    });
  }
  if (data.format === 'multi') {
    const options = multiOptionIds(data);
    if (new Set(options).size !== options.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['answers'],
        message: 'answers、acceptable、distractors 不可重複或互相重疊',
      });
    }
    if (options.includes(NO_PROBLEM)) {
      ctx.addIssue({
        code: 'custom',
        path: ['answers'],
        message: `multi 題不提供「${NO_PROBLEM}」選項`,
      });
    }
    const count = new Set(options).size;
    if (count < MULTI_OPTION_COUNT.min || count > MULTI_OPTION_COUNT.max) {
      ctx.addIssue({
        code: 'custom',
        path: ['distractors'],
        message: `multi 題選項共 ${MULTI_OPTION_COUNT.min}–${MULTI_OPTION_COUNT.max} 個，目前 ${count} 個`,
      });
    }
    const noted = Object.keys(data.notes);
    const missing = options.filter((id) => !noted.includes(id));
    const extra = noted.filter((id) => !options.includes(id));
    if (missing.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['notes'],
        message: `每個選項都要有個別解說，缺少：${missing.join(', ')}`,
      });
    }
    if (extra.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['notes'],
        message: `notes 含有不是選項的 id：${extra.join(', ')}`,
      });
    }
  }
  if (data.format === 'choice') {
    const correct = data.choices.filter((c) => c.correct).length;
    if (correct !== 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['choices'],
        message: `choices 必須恰好一個 correct: true，目前 ${correct} 個`,
      });
    }
  }
}

export const createScenarioSchema = (policy: ReviewPolicy = REVIEW_POLICY) =>
  z
    .discriminatedUnion('format', [
      judgeScenario,
      multiScenario,
      validitySoundnessScenario,
      choiceScenario,
    ])
    .superRefine((data, ctx) => {
      requireReviewers(data, ctx, policy);
      // 對照題只存在於 judge 題（ADR-0022）
      const noProblem = data.format === 'judge' && data.answer === NO_PROBLEM;
      if (data.isControl !== noProblem) {
        ctx.addIssue({
          code: 'custom',
          path: ['isControl'],
          message: `isControl 為 true 若且唯若 answer 為 '${NO_PROBLEM}'（只有 judge 題可以是對照題）`,
        });
      }
      const idTheme = data.id.startsWith('daily-') ? 'daily' : 'conservation';
      if (idTheme !== data.theme) {
        ctx.addIssue({ code: 'custom', path: ['theme'], message: `id 前綴與 theme 不一致` });
      }
      checkFormat(data, ctx);
    });

/** 情境題除了標題與本文以外，會顯示給讀者的文字（隱私檢查、閱讀篇幅報告用） */
export function scenarioTexts(data: AnyScenario): string[] {
  const texts = [...(data.betterPhrasing ?? []), ...(data.checklist ?? [])];
  if (data.format === 'multi') texts.push(...Object.values(data.notes));
  if (data.format === 'validity-soundness') texts.push(data.notes.validity, data.notes.premises);
  if (data.format === 'choice') {
    texts.push(data.prompt, ...data.choices.flatMap((c) => [c.text, c.note]));
  }
  return texts;
}

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

// 討論引導卡等可列印的線下工具（ADR-0033）：走相同的審核閘門，本文段落見 src/lib/toolkit.ts。
export const toolkitSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1).max(80),
    ...reviewMeta,
  })
  .strict()
  .superRefine(requireReviewers);

export type EntryData = z.output<typeof entrySchema>;
export type ScenarioData = z.output<typeof scenarioSchema>;
export type TermData = z.output<typeof termSchema>;
export type ToolkitData = z.output<typeof toolkitSchema>;

// 更新紀錄的手寫說明（ADR-0024）：功能更新、重要勘誤、公告。新上架內容由 published 自動列出。
export const UPDATE_KINDS = ['feature', 'content', 'fix', 'notice'] as const;
// 修訂揭露（ADR-0025）：about 指向被修訂的內容，impact 說明對學習的影響。
export const REVISION_KINDS = ['content', 'fix', 'notice'] as const;
export const UPDATE_IMPACTS = ['none', 'reread', 'answer-changed'] as const;
export const updateSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    date: z.coerce.date(),
    kind: z.enum(UPDATE_KINDS),
    title: z.string().trim().min(1).max(60),
    summary: z.string().trim().min(1).max(200),
    // 只允許站內路徑，避免訂閱源夾帶外部連結
    link: z
      .string()
      .regex(/^\/[a-z0-9\-/]*(#[a-z0-9-]+)?$/)
      .optional(),
    about: z
      .string()
      .regex(/^(entry|scenario|term)\/[a-z0-9-]+$/)
      .optional(),
    impact: z.enum(UPDATE_IMPACTS).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message });
    if (data.about && !(REVISION_KINDS as readonly string[]).includes(data.kind)) {
      issue('about', 'about 只用於 content、fix、notice 說明（ADR-0025）');
    }
    if (data.impact && !data.about) issue('impact', 'impact 需要搭配 about（ADR-0025）');
    if (data.impact === 'answer-changed') {
      if (data.kind !== 'fix') issue('impact', '正解改變屬於勘誤，kind 需為 fix（ADR-0025）');
      if (data.about?.startsWith('term/')) issue('impact', '名詞沒有正解，不能標為 answer-changed');
    }
    // 撤下公告不連到可能已不存在的頁面
    if (data.kind === 'notice' && data.about && data.link) {
      issue('link', '撤下公告不附 link（ADR-0025）');
    }
  });
export type UpdateData = z.output<typeof updateSchema>;
