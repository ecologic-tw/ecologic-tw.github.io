// 介面字串（docs/sdd/06）。
import type { EntryKind } from '../lib/content.ts';

export const t = {
  siteName: '邏生門',
  siteNameEn: 'EcoLogic',
  tagline: '用生活與保育的情境，一步一步練習好好說理。',
  skipToContent: '跳到主要內容',
  notOfficial: '本站為社群教育專案，不代表任何政府機關或團體立場。所有情境皆為虛構。',
  privacy: '本站不使用 cookie，也不蒐集任何個人資料。',
  license: '程式碼以 MIT、內容以 CC BY-SA 4.0 授權。',
  sourceLink: '原始碼與參與方式',
  nav: { guide: '圖鑑', terms: '名詞' },
  draftBadge: '草稿',
  draftNote: '這是尚未審核的草稿，只在開發環境顯示，正式網站不會出現。',
  filterLabel: '篩選',
  filterPlaceholder: '輸入名稱或關鍵字',
  filterEmpty: '沒有符合的項目，試試別的關鍵字。',
} as const;

export const kindLabel: Record<EntryKind, string> = {
  law: '思維定律',
  inference: '有效推論',
  'formal-fallacy': '形式謬誤',
  'informal-fallacy': '非形式謬誤',
  bias: '認知偏誤',
};

export const kindIntro: Record<EntryKind, string> = {
  law: '思考時預設要遵守的基本規則。',
  inference: '只要前提都成立，結論就一定成立的推理形式。',
  'formal-fallacy': '看起來像有效推論，但推理形式本身不成立。',
  'informal-fallacy': '問題不在形式，而在內容、用詞或脈絡。',
  bias: '心理上的推理陷阱，不是邏輯形式錯誤。',
};

/** 02 規則 5：認知偏誤卡一律加註 */
export const biasNote = '這是心理上的推理陷阱，不是邏輯形式錯誤。';
