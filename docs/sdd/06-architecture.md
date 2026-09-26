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
│  ├─ content/ entries/zh-TW/  scenarios/zh-TW/  terms/zh-TW/
│  ├─ i18n/zh-TW.ts            # 介面字串
│  ├─ lib/
│  │  ├─ progress.ts           # localStorage 讀寫、匯出匯入（zod 驗證）
│  │  ├─ badges.ts             # 徽章規則（純函式）
│  │  ├─ quiz.ts               # 選項組合與打亂（純函式）
│  │  ├─ feedback.ts           # 產生回饋連結
│  │  └─ content.ts            # 取 reviewed 內容的唯一入口
│  ├─ components/  layouts/  pages/  styles/
├─ scripts/check-content.ts    # 03 的建置期檢查
└─ tests/ unit/  e2e/
```

## 重要模組介面
```ts
// content.ts：頁面只能透過這裡取內容，確保 draft 不外流
getPublishedEntries(): Promise<Entry[]>
getPublishedScenarios(theme?: Theme): Promise<Scenario[]>

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

## 來源與搜尋（ADR-0018）
- `Sources.astro` 統一呈現三種內容的來源；情境題置於答案揭露區。
- `site.ts` 集中正式網址；`Base.astro` 輸出 canonical／Open Graph。靜態 endpoints 產生 sitemap 與 robots，取內容仍經 `content.ts`；草稿預覽不索引。
- 建置後產生 `reports/content-quality.*`（不進公開 dist）；獨立來源連結 workflow 產生 Actions 報告。操作及限制見 `docs/review/content-quality.md`。
