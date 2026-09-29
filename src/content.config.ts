import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  entrySchema,
  scenarioSchema,
  termSchema,
  toolkitSchema,
  updateSchema,
} from './lib/content-schema.ts';

// schema 驗證失敗 → astro sync／build 失敗（docs/sdd/03）。
// 交叉參照等跨檔檢查在 scripts/check-content.ts。
// 內容快取只在本檔變更時失效：修改 content-schema.ts 的輸出格式時，請一併更新下方版本號，
// 否則本機既有快取會沿用舊格式的資料（ADR-0022 實作時發現）。
// 變更時若開發伺服器正在執行，它可能用記憶體裡的舊 schema 重建快取；請停止伺服器，
// 刪除 .astro/data-store.json 後再啟動。
export const CONTENT_SCHEMA_VERSION = 5;

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

const updates = defineCollection({
  loader: file('./src/content/updates/zh-TW/updates.yaml'),
  schema: updateSchema,
});

// 討論引導卡等可列印的線下工具（ADR-0033）
const toolkit = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/toolkit/zh-TW' }),
  schema: toolkitSchema,
});

export const collections = { entries, scenarios, terms, updates, toolkit };
