// 本機進度（docs/sdd/06、07）：只存在 localStorage 的 `ecologic:v1`，不上傳。
// M2 使用：模式、作答紀錄、改寫次數；匯出／匯入／清除與徽章於 M3 加入。
// 這支模組每頁都會載入（模式切換），因此用 zod/mini 縮小前端體積（ADR-0014）；
// 版本與 Astro 內附的 zod 相同，內容 schema 仍使用 astro/zod。
import * as z from 'zod/mini';

export const KEY = 'ecologic:v1';

export const MODES = ['basic', 'advanced'] as const;
export type Mode = (typeof MODES)[number];

const progressSchema = z.object({
  version: z.literal(1),
  mode: z.catch(z.enum(MODES), 'basic'),
  answered: z.catch(z.record(z.string(), z.object({ correct: z.boolean(), at: z.string() })), {}),
  rewrites: z.catch(z.int().check(z.minimum(0)), 0),
  collected: z.catch(z.array(z.string()), []),
  badges: z.catch(z.array(z.string()), []),
});

export type Progress = z.infer<typeof progressSchema>;

export function defaults(): Progress {
  return { version: 1, mode: 'basic', answered: {}, rewrites: 0, collected: [], badges: [] };
}

type Store = Pick<Storage, 'getItem' | 'setItem'>;

function storage(): Store | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    // 部分瀏覽器設定下，存取 localStorage 本身就會拋錯
    return undefined;
  }
}

/** 讀取失敗或格式錯 → 回傳預設值，不拋錯。個別欄位損壞時只重設該欄位。 */
export function load(store: Store | undefined = storage()): Progress {
  try {
    const raw = store?.getItem(KEY);
    if (!raw) return defaults();
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : defaults();
  } catch {
    return defaults();
  }
}

/** 儲存失敗（例如空間已滿、瀏覽器限制）時回傳 false，由呼叫端決定是否提示。 */
export function save(progress: Progress, store: Store | undefined = storage()): boolean {
  try {
    if (!store) return false;
    store.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function update(
  change: (p: Progress) => Progress,
  store: Store | undefined = storage(),
): Progress {
  const next = change(load(store));
  save(next, store);
  return next;
}

export const setMode =
  (mode: Mode) =>
  (p: Progress): Progress => ({ ...p, mode });

export const recordAnswer =
  (scenarioId: string, correct: boolean, at = new Date().toISOString()) =>
  (p: Progress): Progress => ({ ...p, answered: { ...p.answered, [scenarioId]: { correct, at } } });

export const addRewrite = (p: Progress): Progress => ({ ...p, rewrites: p.rewrites + 1 });
