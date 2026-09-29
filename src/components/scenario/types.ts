import type { Entry, Scenario } from '../../lib/content.ts';

/**
 * 題型元件在情境題頁面出現三次（src/pages/scenario/[id].astro）：
 * - question：作答表單裡的題目與選項
 * - answer：「看答案與解說」開頭的正解
 * - notes：對照題與偏誤提醒之後的逐項說明
 */
export type FormatPart = 'question' | 'answer' | 'notes';

export type ScenarioData = Scenario['data'];
export type FormatData<F extends ScenarioData['format']> = Extract<ScenarioData, { format: F }>;

export interface FormatProps<F extends ScenarioData['format']> {
  data: FormatData<F>;
  entries: Map<string, Entry>;
  part: FormatPart;
}
