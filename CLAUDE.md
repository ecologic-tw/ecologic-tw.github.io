# CLAUDE.md — 邏生門／EcoLogic 開發指引

> Claude Code 每次開工先讀這份。細節按需讀 `docs/sdd/`，不要一次全讀。

## 專案一句話
以情境判讀題＋圖鑑，讓大眾認識邏輯定律、推論、謬誤與認知偏誤；主題分「日常生活」與「野生生物保育」。純靜態網站，部署於 GitHub Pages（`https://ecologic-tw.github.io/`）。

## 紅線（任何任務都不得違反）
1. **無後端、無金鑰**：前端與 repo 不得出現任何 API key、token、密碼。不得加入需要金鑰的服務（含 AI 評分）。
2. **無第三方腳本、無 cookie、無追蹤**：不加 analytics、廣告、外部字型 CDN、嵌入式留言。字型自託管。
3. **使用者資料只存本機**：進度只寫 `localStorage`（鍵 `ecologic:v1`），不上傳。匯入 JSON 必須經 zod 驗證。
4. **內容只發布 `status: reviewed`**：你（AI）產出的內容一律 `status: draft`，不可自行改為 `reviewed`。
5. **情境必須虛構**：不指名真實人物、機關、團體、具體事件；不放敏感物種精確地點。
6. **不用黑帽遊戲化**：禁止倒數計時、連續打卡中斷懲罰、限時內容、排行榜、人與人比較。
7. **非官方立場**：不得使用任何機關標誌或暗示官方背書。
8. **依賴最小化**：新增 npm 套件前需說明理由並寫入 ADR；GitHub Actions 需以 commit SHA 鎖版。

## 社群文化與 AI 協作規範
本專案文化依 `docs/共好型自主敏捷社群指引.md`（自由決定、公開承擔、共同學習）。你（AI）同樣適用：
- **允許不知道，不能假裝知道**（§18）：邏輯判讀或保育事實不確定時，明確標出不確定之處與待查證項目，不要編造來源。
- **公開承擔**（§2）：提出架構或流程變更時，寫明假設、已知風險與 Review Point（用 ADR 範本）。
- **把壞消息說早**（§17）：發現既有內容或程式可能有錯，即使不在本次任務範圍，也要回報。
- **對事不對人**（§11）：內容、Issue、PR 文字不羞辱、不貼標籤。
- 不得自行擔任 Decision Owner、不得自行核准或合併 PR。

## 常用指令（M0 完成後生效）
- `npm ci` / `npm run dev` / `npm run build` / `npm run check`（astro check＋內容 schema）/ `npm run lint` / `npm test`

## 文件地圖
| 需要… | 讀 |
|---|---|
| 目標、範圍、需求 | `docs/sdd/00-overview.md`、`01-requirements.md` |
| 用語（圖鑑卡、情境題、對照題…） | `CONTEXT.md` |
| 內容資料格式 | `docs/sdd/03-content-schema.md` |
| 畫面與互動 | `docs/sdd/04-ux-interaction.md` |
| 八角框架設計 | `docs/sdd/05-octalysis.md` |
| 架構與目錄 | `docs/sdd/06-architecture.md` |
| 資安與隱私 | `docs/sdd/07-security-privacy.md` |
| 防誤用與內容寫作準則 | `docs/sdd/08-misuse-prevention.md` |
| 回饋機制 | `docs/sdd/09-feedback.md`、`docs/feedback/google-form-design.md` |
| 社群文化、決策方式、Learning Review | `docs/共好型自主敏捷社群指引.md` |
| 審核、治理、角色輪替、傳承 | `docs/sdd/10-governance.md`、`CODE_OF_CONDUCT.md` |
| 里程碑與驗收 | `docs/sdd/11-milestones.md` |
| 為什麼這樣決定 | `docs/adr/` |

## 工作方式
- 依 `11-milestones.md` 順序推進；每個里程碑結束時更新該檔勾選狀態。
- 改變上述紅線或架構決策 → 先新增 ADR，再改程式。
- 撰寫內容前必讀 `08-misuse-prevention.md` 的寫作準則。
- 語言：介面與內容繁體中文（臺灣用語），程式碼識別字與 commit message 用英文。
