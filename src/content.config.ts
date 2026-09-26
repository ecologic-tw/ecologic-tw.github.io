import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { entrySchema, scenarioSchema, termSchema } from './lib/content-schema.ts';

// schema 驗證失敗 → astro sync／build 失敗（docs/sdd/03）。
// 交叉參照等跨檔檢查在 scripts/check-content.ts。
const entries = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/entries/zh-TW' }),
  schema: entrySchema,
});

const scenarios = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/scenarios/zh-TW' }),
  schema: scenarioSchema,
});

const terms = defineCollection({
  loader: file('./src/content/terms/zh-TW/terms.yaml'),
  schema: termSchema,
});

export const collections = { entries, scenarios, terms };
