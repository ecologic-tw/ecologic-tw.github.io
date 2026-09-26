// 本機進度（docs/sdd/06、07）：只存在 localStorage 的 `ecologic:v1`，不上傳。
// 這支模組每頁都會載入（模式切換），因此用 zod/mini 縮小前端體積（ADR-0014）；
// 版本與 Astro 內附的 zod 相同，內容 schema 仍使用 astro/zod。
import * as z from 'zod/mini';

export const KEY = 'ecologic:v1';

/** 匯入檔大小上限（docs/sdd/07） */
export const IMPORT_MAX_BYTES = 100 * 1024;

export const MODES = ['basic', 'advanced'] as const;
export type Mode = (typeof MODES)[number];

const id = z.string().check(z.maxLength(64));
const answerRecord = z.object({
  correct: z.boolean(),
  at: z.string().check(z.maxLength(40)),
});

/** 讀取 localStorage 用：個別欄位損壞時只重設該欄位，不清空全部進度 */
const storedSchema = z.object({
  version: z.literal(1),
  mode: z.catch(z.enum(MODES), 'basic'),
  answered: z.catch(z.record(id, answerRecord), {}),
  rewrites: z.catch(z.int().check(z.minimum(0)), 0),
  collected: z.catch(z.array(id), []),
  read: z.catch(z.array(id), []),
  badges: z.catch(z.array(id), []),
});

/** 匯入檔用：嚴格驗證，任何欄位型別錯誤就整份拒絕；未知欄位會被捨棄 */
const importSchema = z.object({
  version: z.literal(1),
  mode: z.enum(MODES),
  answered: z.record(id, answerRecord),
  rewrites: z.int().check(z.minimum(0), z.maximum(100_000)),
  collected: z.array(id).check(z.maxLength(500)),
  read: z.optional(z.array(id).check(z.maxLength(500))),
  badges: z.array(id).check(z.maxLength(100)),
});

export type Progress = z.infer<typeof storedSchema>;

export function defaults(): Progress {
  return {
    version: 1,
    mode: 'basic',
    answered: {},
    rewrites: 0,
    collected: [],
    read: [],
    badges: [],
  };
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function storage(): Store | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    // 部分瀏覽器設定下，存取 localStorage 本身就會拋錯
    return undefined;
  }
}

/** localStorage 能否寫入（無痕模式、封鎖網站資料時可能不行） */
export function isStorageAvailable(store: Store | undefined = storage()): boolean {
  try {
    if (!store) return false;
    const probe = `${KEY}:probe`;
    store.setItem(probe, '1');
    store.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** 讀取失敗或格式錯 → 回傳預設值，不拋錯。 */
export function load(store: Store | undefined = storage()): Progress {
  try {
    const raw = store?.getItem(KEY);
    if (!raw) return defaults();
    const parsed = storedSchema.safeParse(JSON.parse(raw));
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

/** 一鍵清除（docs/sdd/07）：移除本站在這個瀏覽器的所有資料 */
export function clear(store: Store | undefined = storage()): boolean {
  try {
    store?.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

export const setMode =
  (mode: Mode) =>
  (p: Progress): Progress => ({ ...p, mode });

export const recordAnswer =
  (scenarioId: string, correct: boolean, at = new Date().toISOString()) =>
  (p: Progress): Progress => ({ ...p, answered: { ...p.answered, [scenarioId]: { correct, at } } });

export const addRewrite = (p: Progress): Progress => ({ ...p, rewrites: p.rewrites + 1 });

const addUnique = (list: string[], value: string) =>
  list.includes(value) ? list : [...list, value];

/** 卡內小檢核答對：直接點亮該卡（docs/sdd/02 規則 4） */
export const collect =
  (entryId: string) =>
  (p: Progress): Progress => ({ ...p, collected: addUnique(p.collected, entryId) });

/** 讀到圖鑑卡結尾（「謬誤的謬誤」徽章用） */
export const markRead =
  (entryId: string) =>
  (p: Progress): Progress => ({ ...p, read: addUnique(p.read, entryId) });

/** 已得到的徽章只增不減：內容日後調整也不收回 */
export const grantBadges =
  (badgeIds: readonly string[]) =>
  (p: Progress): Progress => ({ ...p, badges: badgeIds.reduce(addUnique, p.badges) });

// ── 匯出／匯入（docs/sdd/06、07） ──

export function exportJson(progress: Progress): string {
  return JSON.stringify(progress, null, 2);
}

export type KnownIds = {
  scenarios: ReadonlySet<string>;
  entries: ReadonlySet<string>;
  badges: ReadonlySet<string>;
};

export type ImportResult =
  | { ok: true; progress: Progress; dropped: number }
  | { ok: false; reason: 'too-large' | 'not-json' | 'invalid' };

/**
 * 解析匯入檔：大小上限、JSON、嚴格型別驗證；只保留本站認得的 id，其餘捨棄。
 * 檔案內的任何字串都不會被顯示，只會用來比對已知 id。
 */
export function parseImport(text: string, known: KnownIds): ImportResult {
  if (new TextEncoder().encode(text).length > IMPORT_MAX_BYTES) {
    return { ok: false, reason: 'too-large' };
  }
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'not-json' };
  }
  const parsed = importSchema.safeParse(json);
  if (!parsed.success) return { ok: false, reason: 'invalid' };

  const data = parsed.data;
  let dropped = 0;
  const keep = (ids: string[], set: ReadonlySet<string>) => {
    const kept = [...new Set(ids)].filter((i) => set.has(i));
    dropped += ids.length - kept.length;
    return kept;
  };
  const answered = Object.fromEntries(
    Object.entries(data.answered).filter(([key]) => {
      const ok = known.scenarios.has(key);
      if (!ok) dropped++;
      return ok;
    }),
  );

  // 先完成所有過濾，dropped 才會是最終數字
  const progress: Progress = {
    version: 1,
    mode: data.mode,
    answered,
    rewrites: data.rewrites,
    collected: keep(data.collected, known.entries),
    read: keep(data.read ?? [], known.entries),
    badges: keep(data.badges, known.badges),
  };
  return { ok: true, dropped, progress };
}
