# 03 內容 Schema

內容位於 `src/content/`，以 Astro Content Layer（`glob` loader）載入，schema 定義於 `src/content.config.ts`，以 zod 驗證。**schema 驗證失敗 → 建置失敗**。

## 目錄
```
src/content/
  entries/zh-TW/<id>.md       # 圖鑑卡
  scenarios/zh-TW/<id>.md     # 情境題
  terms/zh-TW/terms.yaml      # 名詞（單檔，方便非工程師編輯）
```

## 共用欄位
```ts
const reviewMeta = {
  status: z.enum(['draft', 'reviewed', 'retired']),
  reviewers: z.array(z.string()).default([]),   // 非空 GitHub 帳號；reviewed 時至少 1 位不同審核者
  sources: z.array(z.object({ title: z.string().trim().min(1), url: z.string().url().optional(), supports: z.array(z.string().trim().min(1)).min(1).optional() })).default([]),
  requiresSecondReview: z.boolean().default(false), // 爭議內容：reviewed 時至少 2 位不同審核者
  updated: z.coerce.date(),
  published: z.coerce.date().optional(),        // 首次發布日期；npm run review 首次審核時自動填入，勘誤不改（ADR-0024）
  aiAssisted: z.boolean().default(false),       // AI 參與撰寫須標 true
};
// refine：reviewed 時來源至少 1 項；審核帳號以不分大小寫的不同人數計算。
// requiresSecondReview 時至少 2 人；一般內容至少 1 人。
// 對照題雙審開關在 src/lib/review-policy.ts，目前關閉；開啟後 isControl 也至少 2 人。
```

## 圖鑑卡 `entries`
```ts
z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),        // 與檔名一致，如 straw-man
  kind: z.enum(['concept','law','inference','formal-fallacy','informal-fallacy','bias']),
  title: z.string(),                           // 稻草人謬誤
  en: z.string(),                              // Straw man
  summary: z.string().max(60),                 // 一句話定義
  form: z.string().optional(),                 // 進階：P→Q, Q ∴ P
  pairWith: z.string().optional(),             // 形式謬誤 ↔ 有效推論
  notFallacyWhen: z.string().optional(),       // 謬誤、偏誤卡必填（refine）
  charitableResponse: z.string().optional(),   // 謬誤、偏誤卡必填（refine）
  evidence: z.enum(['robust','moderate','contested']).optional(), // 僅 bias；所有偏誤卡必填（refine，ADR-0021）
  quickCheck: z.object({                        // 卡內小檢核；基礎概念、思維定律、有效推論卡必填（refine，ADR-0015、ADR-0020）
    question: z.string(),
    options: z.array(z.string()).min(2).max(4),
    answer: z.number().int(),                   // options 的索引，從 0 開始
    explanation: z.string(),
  }).optional(),
  related: z.array(z.string()).default([]),
  terms: z.array(z.string()).default([]),
  ...reviewMeta,
})
```
Markdown 本文依序使用以下二級標題：`## 說明`、`## 生活例子`、`## 保育例子`、`## 何時不算謬誤`（或 `## 何時合理`）、`## 善意回應法`、`## 進階`（進階模式才顯示）。`concept` 卡以 `## 常見誤解` 取代「何時合理／善意回應法」。

引用其他圖鑑卡時用一般連結 `[排中律](/guide/law-of-excluded-middle/)`；`[[…]]` 只用於名詞表中的名詞。一般連結不在 `npm run check` 的引用檢查內，改由 `npm run build` 的產物檢查確認目標頁面存在（Issue #41）。

範例 `entries/zh-TW/appeal-to-nature.md`：
```md
---
id: appeal-to-nature
kind: informal-fallacy
title: 訴諸自然
en: Appeal to nature
summary: 認為「自然的」就一定好、「不自然的」就一定壞。
notFallacyWhen: 當討論的目標本來就定義為「維持自然狀態」（如保護區經營目標），以此作為評估標準是合理的。
charitableResponse: 「你在意的是對身體或環境的影響吧？我們來看看有沒有資料比較兩者。」
related: [false-dilemma]
terms: [premise, conclusion]
status: draft
reviewers: []
updated: 2026-09-26
aiAssisted: true
---
## 說明
……
```

## 情境題 `scenarios`
依 `format` 區分題型的聯集（ADR-0022）；沒有 `format` 的題目視為 `judge`，既有題目不需修改。共用欄位：
```ts
const scenarioBase = {
  id: z.string().regex(/^(daily|cons)-\d{3}$/),  // daily-001 / cons-001
  theme: z.enum(['daily','conservation']),
  title: z.string(),
  isControl: z.boolean().default(false),
  difficulty: z.enum(['basic','advanced']),        // basic 題兩種模式都出；advanced 只在進階模式出
  form: z.string().optional(),                     // 進階：此情境的形式結構
  terms: z.array(z.string()).default([]),
  ...reviewMeta,
}
```
各題型另外的欄位：
```ts
// judge（預設）：現行單選判讀
{ format: 'judge', answer: z.string(),            // entry id 或 'none'
  distractors: z.array(z.string()).min(2).max(3),
  betterPhrasing: z.array(z.string()).min(1).max(2),
  checklist: z.array(z.string()).min(3).max(4) }

// multi：多重判讀（多選）
{ format: 'multi',
  answers: z.array(z.string()).min(1).max(3),     // 全部選中才算答對
  acceptable: z.array(z.string()).max(2).default([]), // 選或不選都不算錯
  distractors: z.array(z.string()).min(1).max(3),
  notes: z.record(z.string(), z.string()),        // 每個選項 id 都要有個別解說
  betterPhrasing, checklist }                     // 同 judge，必填

// validity-soundness：有效 × 健全（健全＝有效且前提可信，由程式推導）
{ format: 'validity-soundness',
  validity: z.enum(['valid','invalid']),
  premises: z.enum(['credible','not-credible','uncertain']),
  notes: z.object({ validity: z.string(), premises: z.string() }),
  betterPhrasing?, checklist? }                   // 選填，沒有時不顯示改寫區

// choice：隱藏前提／形式辨識／反例選擇／鋼人練習（ADR-0031），共用一個作答元件
{ format: 'choice',
  task: z.enum(['hidden-premise','form','counterexample','steelman']),
  prompt: z.string(),
  choices: z.array(z.object({ text, correct: z.boolean().default(false), note })).min(3).max(4),
  betterPhrasing?, checklist? }
```
refine：
- `isControl` ⇔ `format: judge` 且 `answer === 'none'`（只有 `judge` 題可以是對照題）。
- `judge` 以外的題型必須 `difficulty: advanced`。
- `multi`：`answers`、`acceptable`、`distractors` 互不重疊、不含 `none`，合計 4–6 個；`notes` 的鍵必須恰好是這些選項。
- `choice`：恰好一個 `correct: true`。
本文結構：`## 情境`（對話或陳述）、`## 解說`、`## 進階解說`（選填）、`## 換個位置想`（選填，作答後顯示於解說之後；寫作規則見 08 與 ADR-0029）。

正式情境題（含 draft）的「情境」與「解說」必須存在且內容非空白；內容檢查、提案轉入與人工標記工具共用驗證。可不完整的提案仍放在 `contributions/scenarios/`，不影響正式內容檢查。

對話以引用區塊書寫，**每位說話者一段，段與段之間空一行 `>`**，否則會被合併成同一段：
```md
> 小芳：「每週例會能不能改成線上？」
>
> 組長：「所以你的意思是……？」
```
內文可使用 `[[名詞 id]]` 或 `[[名詞 id|顯示文字]]` 標記名詞，建置時會轉成浮出說明（見 ADR-0013）。

## 名詞 `terms.yaml`
```yaml
- id: premise
  term: 前提
  en: Premise
  definition: 推論中被用來支持結論的陳述。
  status: draft
  reviewers: []
  sources: []
  updated: 2026-09-27
  aiAssisted: true
```

三種內容都套用共用審核欄位與 refine（ADR-0017）。`sources.supports` 可記錄來源對應的主張與適用範圍；至少有來源不代表知識必然正確，仍需人工核對。虛構情境中的數字不是文獻的實際研究結果。

來源網址限 HTTP(S)，書目與 `supports` 由共用參考資料元件顯示。建置另產生來源／雙審／AI 協助覆蓋率與閱讀篇幅提醒（ADR-0018）；篇幅提醒不改變 schema 審核狀態，不是閱讀年級評定。

三種內容另可填 `contributors: [{ name, contribution }]`（預設空陣列），使用本人同意的公開名稱／筆名與實際貢獻；署名不取代 reviewers。可不完整的情境提案放在 `contributions/scenarios/`，不載入正式內容集合，轉入時才驗證完整 schema（ADR-0019）。

## 更新紀錄 `updates/zh-TW/updates.yaml`（ADR-0024）
手寫說明：功能更新、重要勘誤、公告。新上架內容依 `published` 自動列出，不必另寫。
```yaml
- id: updates-page            # 小寫英數與連字號
  date: 2026-09-27
  kind: feature               # feature 功能／content 內容／fix 勘誤／notice 公告
  title: 新增更新紀錄與訂閱      # ≤ 60 字
  summary: ……                 # ≤ 200 字，純文字
  link: /updates/             # 選填，只能是站內路徑
  about: scenario/cons-013    # 選填，被修訂的內容：entry/、scenario/、term/ 加 id（ADR-0025）
  impact: reread              # 選填，需搭配 about：none／reread／answer-changed
```
修訂說明（ADR-0025）：
- `about` 只用於 `content`、`fix`、`notice`；`impact` 必須搭配 `about`；`answer-changed` 只用於 `fix`，且對象須為情境題或有小檢核的圖鑑卡。
- 撤下公告（`notice` + `about`）不附 `link`。其他修訂說明沒有 `link` 時，自動連到 `about` 指向的內容頁。
- `content`、`fix` 說明跟著內容的審核狀態：內容未發布時不列出，也不進訂閱源。

## 建置期檢查（`npm run check`）
- 已審圖鑑卡、情境題與名詞都須有來源與足夠的不同審核者；草稿不要求先填審核者或來源。
- 所有 `related`、`answer`、`answers`、`acceptable`、`distractors`、`pairWith`、`terms` 參照存在。
- reviewed 內容不得引用 draft 內容。
- 情境題文字不得含網址、電話、Email（regex 檢查，防止個資與外連）；也檢查 `notes`、`prompt`、`choices` 等題型專屬文字。
- 每個主題中對照題比例 15%–30%，以該主題全部情境題（含進階題型）為分母。
- `evidence` 只能用於 `bias` 卡；任何偏誤卡缺 `evidence` 時失敗（ADR-0021）。
- 更新紀錄說明的 `about` 必須指向存在的內容；`content`、`fix` 說明指向未審內容且沒有撤下公告時警告（ADR-0025）。
- 圖鑑卡與情境題本文以 Sätteri 轉換後不得殘留 `**`。CommonMark 規定：結尾的 `**` 前面是標點、後面緊接文字時，不算粗體結尾。請把標點移到 `**` 外，例如 `**如果你是居民**：`、`「**理解就是同意**。」`。

`npm run build` 的產物檢查另外確認：每個站內 `<a href>` 的目標頁面或檔案存在於正式產物中，頁面連結需以 `/` 結尾；第一版不檢查 `#錨點` 是否存在（Issue #41）。
