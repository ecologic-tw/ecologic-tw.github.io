// 綜合挑戰（ADR-0032）：抽題與進行中狀態的純函式。
// 這支模組會打包進前端，不可 import content-schema（會把完整 zod 帶進瀏覽器）。
import { shuffle } from './quiz.ts';

export const CHALLENGE_SIZE = 5;
/** 進行中的挑戰暫存在 sessionStorage 的鍵；分頁關閉即清除（ADR-0032、docs/sdd/07） */
export const CHALLENGE_KEY = 'ecologic:challenge';

export type ChallengeItem = {
  id: string;
  theme: string;
  advanced: boolean;
  /** 對照題：推理沒有問題 */
  control: boolean;
  /** 正解的圖鑑卡 id；對照題為 'none' */
  answer: string;
};

export type Draw = { ok: true; ids: string[]; includesAnswered: boolean } | { ok: false };

/**
 * 抽 5 題：恰好 1 題對照題、兩個主題都有、同一張正解卡最多 1 題。
 * 依目前模式取題（基礎模式不抽進階題），優先抽沒作答過的題。湊不齊條件時回傳 ok: false。
 */
export function drawChallenge(
  items: readonly ChallengeItem[],
  options: { advanced: boolean; answered: ReadonlySet<string>; random?: () => number },
): Draw {
  const { advanced, answered, random = Math.random } = options;
  // 先洗牌再把沒作答過的排前面：同一層內仍是亂數，搜尋會先用到前面的題目
  const pool = shuffle(
    items.filter((i) => advanced || !i.advanced),
    random,
  ).sort((a, b) => Number(answered.has(a.id)) - Number(answered.has(b.id)));
  const controls = pool.filter((i) => i.control);
  const others = pool.filter((i) => !i.control);
  const themes = new Set(pool.map((i) => i.theme));

  if (themes.size < 2) return { ok: false };

  // 依偏好順序找第一組符合條件的組合；題庫只有數十題，搜尋量很小
  const search = (
    control: ChallengeItem,
    start: number,
    chosen: ChallengeItem[],
  ): ChallengeItem[] | undefined => {
    if (chosen.length === CHALLENGE_SIZE - 1) {
      return new Set([control, ...chosen].map((i) => i.theme)).size >= 2 ? chosen : undefined;
    }
    for (let i = start; i < others.length; i++) {
      const item = others[i] as ChallengeItem;
      if (chosen.some((c) => c.answer === item.answer)) continue;
      const found = search(control, i + 1, [...chosen, item]);
      if (found) return found;
    }
    return undefined;
  };

  for (const control of controls) {
    const rest = search(control, 0, []);
    if (!rest) continue;
    const set = shuffle([control, ...rest], random);
    return {
      ok: true,
      ids: set.map((i) => i.id),
      includesAnswered: set.some((i) => answered.has(i.id)),
    };
  }
  return { ok: false };
}

/** 進行中的挑戰：題目順序、已選答案（尚未選為 null）、目前題號，以及是否含做過的題目 */
export type ChallengeState = {
  ids: string[];
  choices: (string | null)[];
  index: number;
  includesAnswered: boolean;
};

/**
 * 讀回 sessionStorage 的狀態。內容來自瀏覽器，逐欄驗證；
 * 題目已不在本頁（例如內容更新）或格式不符時回傳 undefined，改從頭開始。
 */
export function parseState(
  text: string | null,
  known: ReadonlyMap<string, ReadonlySet<string>>,
): ChallengeState | undefined {
  if (!text) return undefined;
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (typeof data !== 'object' || data === null) return undefined;
  const { ids, choices, index, includesAnswered } = data as Record<string, unknown>;
  if (!Array.isArray(ids) || !Array.isArray(choices)) return undefined;
  if (ids.length !== CHALLENGE_SIZE || choices.length !== CHALLENGE_SIZE) return undefined;
  if (new Set(ids).size !== ids.length) return undefined;
  if (!Number.isInteger(index) || (index as number) < 0 || (index as number) >= CHALLENGE_SIZE)
    return undefined;
  for (const [i, id] of ids.entries()) {
    const options = typeof id === 'string' ? known.get(id) : undefined;
    if (!options) return undefined;
    const choice: unknown = choices[i];
    if (choice !== null && (typeof choice !== 'string' || !options.has(choice))) return undefined;
  }
  return {
    ids: ids as string[],
    choices: choices as (string | null)[],
    index: index as number,
    includesAnswered: includesAnswered === true,
  };
}
