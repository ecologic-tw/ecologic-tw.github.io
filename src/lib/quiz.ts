// 情境題選項（docs/sdd/02 規則 2）：干擾選項＋正解＋「沒有問題」，順序於前端打亂。純函式。
// 這支模組會打包進前端，不可 import content-schema（會把完整 zod 帶進瀏覽器）。

/** 情境題 answer 為「推理沒有問題」時的值 */
export const NO_PROBLEM = 'none';

/** 組出選項 id（未打亂）。對照題的正解就是 'none'，不會重複出現。 */
export function buildOptions(answer: string, distractors: readonly string[]): string[] {
  return [...new Set([answer, ...distractors, NO_PROBLEM])];
}

/** Fisher–Yates 洗牌，回傳新陣列；random 可注入以便測試。 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

export function isCorrect(choice: string, answer: string): boolean {
  return choice === answer;
}

/** 收集判定需要的作答欄位；其餘題型沒有對應的圖鑑卡 */
export type ScenarioAnswerKey =
  | { format: 'judge'; answer: string }
  | { format: 'multi'; answers: readonly string[] }
  | { format: 'validity-soundness' | 'choice' };

/**
 * 答對後可點亮的圖鑑卡（ADR-0022）：judge 為正解（「沒有問題」除外），
 * multi 為全部 answers，validity-soundness 與 choice 不點亮任何卡。
 */
export function collectableEntries(key: ScenarioAnswerKey): string[] {
  if (key.format === 'judge') return key.answer === NO_PROBLEM ? [] : [key.answer];
  if (key.format === 'multi') return [...key.answers];
  return [];
}
