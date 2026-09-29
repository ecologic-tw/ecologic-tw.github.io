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
  /** 答錯時的補充（ADR-0037）：嘗試本身就算數 */
  everyTry: '每一次嘗試都算數：這次作答已經記在「我的圖鑑」，看完解說，隨時可以回來再試一次。',
  yourChoice: '你的判讀',
  answerIs: '這段推理',
  reveal: '看答案與解說',
  explanation: '解說',
  advancedExplanation: '進階解說',
  perspective: '換個位置想',
  perspectiveHint: '理解不等於同意。試著想想對方在意什麼，再用提問確認，而不是替對方下結論。',
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
  answeredBeforeFix: '已作答（題目後來修正過）',
} as const;

/** 綜合挑戰（ADR-0032）：只陳述結果，不用評分、評語或催促的字眼 */
export const challenge = {
  title: '綜合挑戰',
  description: '混合兩個主題的 5 題判讀，全部答完再看結果與解說。',
  intro: [
    '一次 5 題，混合日常生活與野生生物保育，其中有 1 題推理本身沒有問題。',
    '作答時不會馬上告訴你對錯，也不計時；送出前可以回上一題修改。全部送出後，再一起看結果與每題的解說。',
    '進行中的作答只存在這個瀏覽器分頁，關閉分頁就會清除。',
  ],
  overwriteNote:
    '送出後會和一般作答一樣記錄下來，並覆蓋這些題目先前的紀錄；如果某張圖鑑卡只靠其中一題點亮，答錯時它會暫時暗下來。',
  entry: '綜合挑戰（5 題）',
  start: '開始',
  noScript: '綜合挑戰需要 JavaScript 才能抽題與記錄作答。也可以到題目列表逐題練習。',
  unavailable: '目前的題目還不夠組成一次挑戰。可以先到題目列表逐題練習。',
  progress: (current: number, total: number) => `第 ${current}／${total} 題`,
  previous: '上一題',
  next: '下一題',
  submit: '全部送出',
  chooseFirst: '先選一個判讀，再到下一題。',
  resultTitle: '結果',
  result: (correct: number, total: number) => `這次答對 ${correct} 題（共 ${total} 題）`,
  includesAnswered: '這次含有你之前做過的題目。',
  reviewTitle: '逐題回顧',
  yourChoice: '你的判讀',
  answer: '這段推理',
  openScenario: '看完整題目與改寫練習',
  again: '再挑戰一次',
} as const;

/** 討論引導卡等可列印的線下工具（ADR-0033） */
export const toolkit = {
  entry: '討論引導卡（可列印）',
  entryHint: '把善意回應、換個位置想與分歧的種類整理成一張 A4，可以帶到課堂、座談或會議。',
  printHint: '用瀏覽器的「列印」可以印成一張 A4 正反兩面，也可以另存成 PDF。',
  print: '列印這張卡',
  license: '內容以 CC BY-SA 4.0 授權，歡迎標示出處後分享與改作。',
} as const;

/** 內容修訂的揭露文字（ADR-0025）：中性說明，不催促重做 */
export const revision = {
  latest: '最近修訂',
  history: '修訂紀錄',
  kind: { feature: '功能', content: '補充', fix: '勘誤', notice: '公告' },
  impact: '影響',
  scenarioAnswerChanged: (date: string) => `本題答案已於 ${date} 修正，說明見解說。`,
  quickCheckAnswerChanged: (date: string) =>
    `這題小檢核的答案已於 ${date} 修正，說明見頁尾的修訂紀錄。`,
} as const;

/** 爭點地圖（ADR-0034）：逐句選分歧種類；標記一律圖示＋文字，不計分 */
export const classifyQuiz = {
  question: '下面每一句，比較像哪一種分歧？',
  hint: '每一句選一種。界線模糊時，解說會說明哪些也算合理。',
  chooseFirst: '每一句都選一種分歧，再送出。',
  kindLabel: { fact: '事實分歧', value: '價值分歧', definition: '定義分歧', interest: '利益分歧' },
  marks: {
    right: { icon: '✓', text: '正解' },
    acceptable: { icon: '△', text: '可接受' },
    wrong: { icon: '✗', text: '你的選擇' },
  },
  answerTag: '正解',
  answerIs: '各句的分歧種類',
  acceptableAlso: '也可以接受',
} as const;

/** 進階題型的介面字串（ADR-0022 §4）：標記一律圖示＋文字，不只靠顏色 */
export const advancedQuiz = {
  multiQuestion: '這段推理有哪些問題？',
  multiHint: '選出所有適用的，可能只有一個。',
  multiChooseFirst: '至少選一項，再送出。',
  multiAnswerIs: '這段推理的問題',
  multiMarks: {
    hit: { icon: '✓', text: '正解，你選到了' },
    missed: { icon: '↻', text: '正解，這次沒選到' },
    wrong: { icon: '✗', text: '這項不適用' },
    acceptable: { icon: '△', text: '可接受，選不選都可以' },
  },
  roleLabel: { answer: '正解', acceptable: '可接受', distractor: '不適用' },
  optionNotes: '各選項的解說',
  validityQuestion: '推理形式有效嗎？（假設前提都為真，結論是否一定為真）',
  premisesQuestion: '前提可信嗎？',
  validityLabel: { valid: '有效', invalid: '無效' },
  premisesLabel: { credible: '可信', 'not-credible': '不可信', uncertain: '無法從題幹判斷' },
  soundnessLabel: {
    sound: '有效，前提也可信，所以健全',
    unsound: '不健全',
    unknown: '形式有效，但前提無法判斷，所以還不能說它健全',
  },
  axisValidity: '形式',
  axisPremises: '前提',
  axisSoundness: '所以這個論證',
  axesChooseFirst: '兩個問題都要選，再送出。',
  choiceChooseFirst: '先選一個答案，再送出。',
  taskLabel: {
    'hidden-premise': '找出沒說出口的前提',
    form: '辨識形式結構',
    counterexample: '找出反例',
    steelman: '找出最強的版本',
  },
  choiceAnswerIs: '正解',
  yourChoice: '你的選擇',
} as const;

export const modeLabel = { basic: '基礎', advanced: '進階', legend: '模式' } as const;

/** 我的應對工具箱（ADR-0037） */
export const toolbox = {
  title: '我的應對工具箱',
  intro:
    '答對一題、點亮一張謬誤或認知偏誤卡，那張卡的善意回應句就會收進這裡。用之前，先確認對方真正的意思。',
  empty:
    '工具箱還是空的。不用一開始就很厲害，要開始才有機會變厲害。試一題看看，答對後，那張卡的回應句就會放進來。',
  count: (n: number) => `工具箱裡有 ${n} 句回應`,
  print: '列印我的工具箱',
};
