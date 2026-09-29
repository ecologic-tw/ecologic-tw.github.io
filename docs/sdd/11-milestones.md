# 11 里程碑與驗收

每完成一項，勾選並於 PR 說明中引用。本檔是進度的唯一來源；一個區段全部完成後縮成一行，附上 ADR 與 PR，細節以 PR 與 `git log` 為準（ADR-0035）。

## 已完成
- **M0 專案骨架**：Astro 靜態網站、TypeScript strict、ESLint／Prettier、內容 schema、CI 與部署、CSP 驗證、首頁部署到 `ecologic-tw.github.io`（ADR-0011；PR #1、#2）。CODEOWNERS 仍為 `@ecologic-tw/maintainers` 佔位，待 team 建立後確認。
- **M1 圖鑑與名詞**：`/guide/`、`/terms/`、原生 popover；關閉 JS 可閱讀、axe 通過（ADR-0013；PR #6）。
- **M2 情境題**：作答流程、解說分層、模式切換、改寫練習（ADR-0014；PR #8）。
- **M3 八角與個人圖鑑**：`progress.ts`、徽章、`/me/`、匯出匯入清除（ADR-0015；PR #10）。
- **M4 回饋與治理**：回饋入口、`/about/`、行為準則聯絡人、Issue 標籤、Google 表單（PR #12）。
- **修訂揭露**：更新說明 `about`／`impact`、內容頁修訂紀錄、第一批修訂說明已確認（ADR-0025）。
- **溝通與意義內容**：非暴力溝通、主觀意義、客觀意義 3 張卡與 3 條名詞已審（12 §5–6）。

## M5 審核與上線
已完成：Lighthouse 四頁皆 100／100、iPhone／Safari 手機實測（2026-09-28，見 [手機實測](../review/mobile-test-checklist.md)）。
- [ ] 全部 MVP 內容經人工審核改為 `reviewed`（分批方式與指令見 `docs/review/review-guide.md`；`npm run check` 會顯示審核進度）
- [ ] 後續追蹤：VoiceOver「全部朗讀」會略過內文名詞按鈕的文字（例如「命題」），句子少一個詞。推測與 `popovertarget` 按鈕被當成彈出式控制項有關；下一步先確認單指滑到名詞時的朗讀角色，再決定修正（2026-09-28 決定暫緩，不擋 M5）（評估見[手機實測](../review/mobile-test-checklist.md#voiceover-在名詞處中斷2026-09-28調查中)）
- [ ] Org 設定清單（07）全數完成
- **驗收**：正式網址上線；README 與 about 頁資訊一致

## 知識擴充（ADR-0020、ADR-0021，docs/sdd/12）
已完成：`concept` 卡別與證據強度；基礎概念 6 張、訴諸無知、訴諸傳統、訴諸武力卡；進階題型三階段與 8 題進階題（ADR-0022）；cons-013 與「不當訴諸權威」修訂重審（PR #24、#33、#40、#46）；cons-018、cons-019 草稿（`requiresSecondReview: true`）。
- [ ] 「訴諸傳統」卡的來源：SEP「Fallacies」條目未討論訴諸傳統（2026-09-27 核對），需另找來源
- [ ] 人工審核 cons-018、cons-019（爭議保育題，需兩位不同審核者確認平衡）；找到第二位審核者前維持 draft，暫不公開
- [ ] 第二位審核者：cons-001、cons-005、cons-009 同樣需要雙審而維持 draft（見審核指南），是 M5「全部 MVP 內容 reviewed」的主要卡點

## 更新通知（ADR-0024）
已完成：第 1 項 `/updates/` 頁與 Atom 訂閱源；ADR 接受；第一則說明文字已確認。
- [ ] 第 2、3 項（本機「新」標記、`/me/` 提示）：依 ADR-0024 Review Point 再評估

## 換個位置想與善意詮釋（ADR-0029）
已完成：選填段落 `## 換個位置想`；「善意詮釋與鋼人論證」卡（開放檢視，ADR-0030）、daily-020、cons-020 已審發布。
- [ ] 人工審核 cons-018、cons-019 的試行段落（需第二位審核者）
- [ ] 試讀回饋後，決定是否以 `npm run scenario -- edit` 分批補進已審題目

## 鋼人練習（ADR-0031）
已完成：`choice` 題型的 `steelman` 任務；daily-021、daily-022、cons-021 已審發布（2026-09-29）。發布時比例：日常對照題 5／22＝22.7%，保育對照題 3／16＝18.8%，保育題由保育方犯錯 6／16＝37.5%。
- [ ] 至少一位試讀者試讀後，依 Review Point 決定擴充、修訂或停止

## 心理學內容開放檢視（ADR-0030）
已完成：ADR 接受（2026-09-29），修訂 12 §5 第 5 條並公告。
- 待具心理學背景的審核者覆核（完成後把帳號加入 `reviewers`，證據強度改變時依 ADR-0025 寫修訂說明）：
  - [ ] 非暴力溝通 `nonviolent-communication`（2026-09-27 開放）
  - [ ] 善意詮釋與鋼人論證 `charity-and-steelman`（2026-09-28 開放；Eyal 等 2018 適用範圍待核對原文）
  - [ ] 後見之明偏誤 `hindsight-bias`（2026-09-28 開放；證據強度 AI 暫定 robust）
  - [ ] 框架效應 `framing-effect`（2026-09-28 開放；證據強度 AI 暫定 robust，僅限風險選擇框架）
- [ ] Review Point（約 2026-12-29）：檢視覆核結果與回饋，決定是否維持開放檢視做法

## 持續
### 首次貢獻試行（ADR-0026，提議；Decision Owner：@Wang-Yi-Zhang）
已完成：三種貢獻入口、四張任務卡與接力範例（見 [任務卡](../review/first-contribution-tasks.md)）。
- [ ] Decision Owner 檢閱 [ADR-0026](../adr/0026-first-contribution-pilot.md) 並決定試行安排（目前維持提議）
- [ ] 至少一位自願參與者完成一次 [真人試走](../review/first-contribution-walkthrough.md)，記錄卡點與接力成本，再決定是否擴大招募

### 閱讀筆記試行（ADR-0027）
已完成：依 [評估文件](../review/reading-notes-assessment.md) 起草 P3、P5，轉為 daily-020、cons-020 並審核發布（2026-09-29）；框架效應、後見之明偏誤兩張卡已發布（開放檢視，證據強度仍為 AI 暫定 robust）。
- [ ] daily-020、cons-020 至少一位自願試讀者試讀（招募見 Issue #62），再依 Review Point 決定擴充、修訂或停止

### 其他持續事項
- [ ] 每年 3 月、9 月角色檢視（第一次：2027-03）

## 互動擴充規劃（SDD 13）
依建議順序，每項實作前另寫 ADR：
- [ ] 1 綜合挑戰：已實作 `/challenge/`（ADR-0032）
  - [ ] 至少一位試讀者走完兩輪後，依 ADR-0032 Review Point 檢視
- [ ] 2 討論引導卡與概念卡「分歧的種類」：已實作並發布，Safari 與 Chromium 列印確認（ADR-0033；PR #80、#81）
  - [ ] 至少一次實際在課堂、座談或會議使用後，依 ADR-0033 Review Point 檢視
- [ ] 3 爭點地圖（`classify` 題型）：已實作並發布試行 2 題 daily-023（基礎）、cons-022（進階），更新紀錄已公告（ADR-0034；PR #83、#87）
  - [ ] 至少一位試讀者回饋後，依 ADR-0034 Review Point 檢視
- [ ] 4 多方觀點情境（`cases` 集合）：ADR-0036 提議中，待 Decision Owner 決定
- [ ] 5 分支對話練習（試行 1–2 則）

## 後續（v1.1+）
每日情境、更多卡片（循環論證、錯誤類比…，見 12 §3）、英文版、評估隱私友善統計（需 ADR）。
