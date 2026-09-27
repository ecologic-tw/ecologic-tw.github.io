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

// ── 進階題型的判定（ADR-0022 §4）：不計分，只回傳是否完全答對與逐項標記 ──

export type MultiRole = 'answer' | 'acceptable' | 'distractor';
/** hit 選到的正解／missed 還沒選到的正解／wrong 選了但不適用／acceptable 可接受／clear 沒選的不適用選項 */
export type MultiMark = 'hit' | 'missed' | 'wrong' | 'acceptable' | 'clear';

/** 多重判讀：選中全部 answers，且沒選任何 distractors；acceptable 選不選都可以。 */
export function gradeMulti(
  options: readonly { id: string; role: MultiRole }[],
  selected: ReadonlySet<string>,
): { correct: boolean; marks: Map<string, MultiMark> } {
  const marks = new Map<string, MultiMark>();
  for (const { id, role } of options) {
    const chosen = selected.has(id);
    if (role === 'acceptable') marks.set(id, 'acceptable');
    else if (role === 'answer') marks.set(id, chosen ? 'hit' : 'missed');
    else marks.set(id, chosen ? 'wrong' : 'clear');
  }
  const correct = [...marks.values()].every((m) => m !== 'missed' && m !== 'wrong');
  return { correct, marks };
}

export type Validity = 'valid' | 'invalid';
export type Premises = 'credible' | 'not-credible' | 'uncertain';
export type Soundness = 'sound' | 'unsound' | 'unknown';

/** 健全＝有效且前提可信；形式無效或前提不可信即不健全；有效但前提無法判斷時，健全與否也無法判斷。 */
export function soundnessOf(validity: Validity, premises: Premises): Soundness {
  if (validity === 'invalid' || premises === 'not-credible') return 'unsound';
  return premises === 'credible' ? 'sound' : 'unknown';
}
