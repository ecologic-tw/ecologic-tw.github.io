// 介面字串（docs/sdd/06）。
import type { EntryKind, Theme } from '../lib/content.ts';
import type { EVIDENCE_LEVELS } from '../lib/content-schema.ts';

type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const t = {
  siteName: '邏生門',
  siteNameEn: 'EcoLogic',
  tagline: '從各說各話，走向共同思考：用生活與保育的情境，練習辨識邏輯瑕疵、調整表述視角。',
  skipToContent: '跳到主要內容',
  notOfficial: '本站為社群教育專案，不代表任何政府機關或團體立場。所有情境皆為虛構。',
  privacy: '本站不使用 cookie，也不蒐集任何個人資料。',
  license: '程式碼以 MIT、內容以 CC BY-SA 4.0 授權。',
  sourceLink: '原始碼與參與方式',
  nav: { daily: '日常', conservation: '保育', guide: '圖鑑', terms: '名詞', me: '我的圖鑑' },
  draftBadge: '草稿',
  draftNote: '這是尚未審核的草稿，只在開發環境顯示，正式網站不會出現。',
  filterLabel: '篩選',
  filterPlaceholder: '輸入名稱或關鍵字',
  filterEmpty: '沒有符合的項目，試試別的關鍵字。',
} as const;

export const kindLabel: Record<EntryKind, string> = {
  concept: '基礎概念',
  law: '思維定律與哲學原則',
  inference: '有效推論',
  'formal-fallacy': '形式謬誤',
  'informal-fallacy': '非形式謬誤',
  bias: '認知偏誤',
};

export const kindIntro: Record<EntryKind, string> = {
  concept: '真、有效、健全、條件……先把討論推理時會用到的基本詞彙弄清楚。',
  law: '區分形式邏輯的基本規則與仍有爭議的哲學原則；不把兩者視為同一種定律。',
  inference: '只要前提都成立，結論就一定成立的推理形式。',
  'formal-fallacy': '看起來像有效推論，但推理形式本身不成立。',
  'informal-fallacy': '問題不在形式，而在內容、用詞或脈絡。',
  bias: '心理上的推理陷阱，不是邏輯形式錯誤。',
};

/** 認知偏誤卡的證據強度標籤（ADR-0021） */
export const evidenceLabel: Record<EvidenceLevel, { label: string; note: string }> = {
  robust: { label: '證據穩健', note: '多項研究一致支持，但個別情境仍可能不適用。' },
  moderate: { label: '證據中等', note: '有研究支持，但效果大小或適用範圍仍在討論。' },
  contested: { label: '證據有爭議', note: '重複驗證結果不一致，請把它當作假說，而不是定論。' },
};

/** 02 規則 5：認知偏誤卡一律加註 */
export const biasNote = '這是心理上的推理陷阱，不是邏輯形式錯誤。';

export const themeLabel: Record<Theme, string> = {
  daily: '日常生活',
  conservation: '野生生物保育',
};

export const themeIntro: Record<Theme, string> = {
  daily: '家人聊天、網路留言、買東西時的判斷，那些聽起來很有道理的話。',
  conservation: '談到野生動物、棲地和人的時候，各方常見的說法與推論。',
};

export const quiz = {
  question: '這段推理……',
  noProblem: '沒有問題',
  hasProblem: (title: string) => `有問題：${title}`,
  submit: '送出判讀',
  chooseFirst: '先選一個判讀，再送出。',
  correct: '判讀正確',
  tryAnotherAngle: '換個角度看看',
  yourChoice: '你的判讀',
  answerIs: '這段推理',
  reveal: '看答案與解說',
  explanation: '解說',
  advancedExplanation: '進階解說',
  form: '形式結構',
  betterPhrasing: '更好的說法',
  rewritePrompt: '試著改寫看看（選填，不會儲存或上傳）',
  checklistTitle: '對照檢核清單，看看你的改寫做到了幾項',
  showReference: '看參考改寫',
  relatedEntries: '相關圖鑑卡',
  next: '下一題',
  random: '隨機一題',
  backToList: '回題目列表',
  controlNote: '這是一題「對照題」：推理本身沒有問題。能分辨出來，和找出錯誤一樣重要。',
  advancedOnly: '進階',
  answered: '已作答',
  answeredCorrect: '已答對',
} as const;

export const modeLabel = { basic: '基礎', advanced: '進階', legend: '模式' } as const;
