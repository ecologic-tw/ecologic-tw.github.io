# 06 系統架構

## 技術選型
| 項目 | 選擇 | 備註 |
|---|---|---|
| 框架 | Astro（實作時使用當前穩定主版本） | 靜態輸出（`output: 'static'`），ADR-0001 |
| 互動元件 | Astro 元件＋原生 TypeScript（`<script>`）；必要時用 Preact island | 優先不加 UI 框架 |
| 內容 | Markdown＋YAML，Content Layer＋zod | 03 |
| 樣式 | 原生 CSS（CSS 變數、自託管字型） | 不用 CSS 框架 CDN |
| 搜尋 | 建置期產生 JSON 索引，前端簡易過濾 | 22 卡＋30 名詞，不需搜尋套件 |
| 測試 | Vitest（邏輯與 schema）、Playwright（關鍵流程＋axe 無障礙） | |
| 品質 | `astro check`、ESLint、Prettier、markdownlint | |
| 部署 | GitHub Actions → GitHub Pages | 07 |
| Node | 當前 LTS，版本寫入 `.nvmrc` 與 `package.json#engines` | |

## 目錄結構
```
/
├─ AGENTS.md  CLAUDE.md  README.md  CONTEXT.md  CONTRIBUTING.md  SECURITY.md  CODE_OF_CONDUCT.md
├─ LICENSE  LICENSE-CONTENT.md
├─ docs/ sdd/ adr/ feedback/  共好型自主敏捷社群指引.md
├─ .github/ ISSUE_TEMPLATE/  workflows/  dependabot.yml  pull_request_template.md  CODEOWNERS
├─ public/ fonts/  favicon.svg  social-card.png
├─ src/
│  ├─ content.config.ts
│  ├─ content/ entries/zh-TW/  scenarios/zh-TW/  terms/zh-TW/  updates/zh-TW/  toolkit/zh-TW/  cases/zh-TW/  origins/zh-TW/
│  ├─ i18n/zh-TW.ts            # 介面字串
│  ├─ lib/
│  │  ├─ progress.ts           # localStorage 讀寫、匯出匯入（zod 驗證）
│  │  ├─ badges.ts             # 徽章規則（純函式）
│  │  ├─ quiz.ts               # 選項組合與打亂（純函式）
│  │  ├─ feedback.ts           # 產生回饋連結
│  │  ├─ updates.ts            # 更新紀錄分組與 Atom 訂閱源（ADR-0024）
│  │  └─ content.ts            # 取 reviewed 內容的唯一入口
│  ├─ components/            # scenario/：情境題的題型元件（見下文）
│  ├─ layouts/  pages/  styles/
├─ scripts/check-content.ts    # 03 的建置期檢查
└─ tests/ unit/  e2e/
```

## 重要模組介面
```ts
// content.ts：頁面只能透過這裡取內容，確保 draft 不外流
getPublishedEntries(): Promise<Entry[]>
getPublishedScenarios(theme?: Theme): Promise<Scenario[]>
getPublishedCases(theme?: Theme): Promise<Case[]>   // 多方觀點案例（ADR-0036）；小題用 cases.ts 的 caseQuestions 取

// progress.ts（ADR-0014、ADR-0015）
const KEY = 'ecologic:v1';
type Progress = { version: 1; mode: 'basic'|'advanced';
  answered: Record<string, { correct: boolean; at: string }>;
  rewrites: number; collected: string[]; read: string[]; badges: string[] };
load(): Progress              // 讀取失敗或格式錯 → 回傳預設值，不拋錯；單一欄位損壞只重設該欄位
save(p: Progress): boolean    // try/catch，儲存失敗回傳 false，由呼叫端提示
update(change): Progress      // 以純函式更新：setMode、recordAnswer、addRewrite、collect、markRead、grantBadges
clear(): boolean
exportJson(p): string
parseImport(text, knownIds): ImportResult   // 100 KB 上限、zod 嚴格驗證、未知欄位捨棄、只保留已知 id

// badges.ts：earnedBadges(progress, contentIndex)、collectedEntries(progress, contentIndex)，純函式
```
開發環境（`npm run dev`）顯示 draft 內容並加「草稿」浮水印；正式建置不含。

## 情境題頁面與題型元件
- `src/pages/scenario/[id].astro` 只負責共用版面與作答流程：情境、表單外框、結果、解說、改寫練習、相關連結。
- 各題型放在 `src/components/scenario/formats/`（`Judge`、`Choice`、`Multi`、`ValiditySoundness`、`Classify`），同一個元件以 `part` 產生三處內容：`question` 題目與選項、`answer` 正解、`notes` 逐項說明；`ScenarioFormat.astro` 依 `format` 選元件。選項標記統一用 `QuizOption.astro`。
- 新增題型：在 `formats/` 加一個元件、在 `ScenarioFormat.astro` 加一行；前端判定仍在 `src/scripts/scenario.ts`，依 `data-*` 屬性運作。
- 選項與結果標示的樣式在 `src/styles/quiz.css`（只由情境題頁面匯入），因為頁面的 scoped 樣式套不到子元件；題型專屬樣式放在各自元件。
- 多方觀點案例（ADR-0036）：`src/pages/cases/` 串起案例與小題，小題仍由情境題頁作答。情境題頁有 `case` 時加上案例連結、收合的背景與角色卡（`CaseRoles.astro`，與案例頁共用），「下一題」改依案例順序。作答狀態由 `src/scripts/case-status.ts` 讀 `answered` 顯示。

## 思想源流（ADR-0039）
- `origins` 集合沒有獨立頁面；圖鑑卡頁以 `getPublishedOrigins(entryId)` 取接到這張卡的已發布項目，由 `OriginNotes.astro` 呈現，外層 `<section class="origins">` 留在頁面以沿用版面格線。
- 本文三段由 `src/lib/origins.ts` 檢查，呈現時用 `splitSections`／`renderMarkdown` 分段轉換（與情境題相同）；參考資料網址納入建置產物的外連允許清單。

## 來源與搜尋（ADR-0018）
- `Sources.astro` 統一呈現三種內容的來源；情境題置於答案揭露區。
- `site.ts` 集中正式網址；`Base.astro` 輸出 canonical／Open Graph。靜態 endpoints 產生 sitemap 與 robots，取內容仍經 `content.ts`；草稿預覽不索引。
- 建置後產生 `reports/content-quality.*`（不進公開 dist）；獨立來源連結 workflow 產生 Actions 報告。操作及限制見 `docs/review/content-quality.md`。

## 情境協作（ADR-0019）
- `contributions/scenarios/` 接受不完整提案，不納入網站內容集合；`scripts/scenario.ts` 提供 new／edit／check／promote，轉入 draft 前沿用完整檢查；轉入後提案移到 `promoted/` 保留。
- `contributors` 保存自願公開名稱與實際貢獻，`Contributors.astro` 共用顯示；不推測既有作者、不取代 reviewers。
- `ExternalLink.astro` 與 Markdown 轉換集中處理外部連結的新視窗提示、安全屬性；建置產物檢查避免遺漏。
