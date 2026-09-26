# AI 協作交接紀錄

## 2026-09-27：P2／P3 來源、搜尋與品質工具
- **目標與狀態**：從已合併 PR #17 的 `origin/main`（`f3240a2`）建立 `codex/content-quality-p2-p3`；本節隨 P2／P3 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。未修改內容審核狀態，對照題雙審仍關閉。
- **完成**：三種內容共用參考資料區塊（情境置於答案內）；canonical／Open Graph 與自託管 PNG；依已審內容產生 sitemap，開發預覽 noindex／禁爬；每次正式建置驗證 metadata、sitemap、草稿排除並產生來源／雙審／AI 協助覆蓋率與閱讀長度報告；每週與手動來源 URL workflow（合併後才排程）。無新增套件。
- **驗證**：151 個單元測試、lint、Astro／內容 check 與正式 49 頁 build 通過。既有 52 個 e2e 全數通過；新增來源揭露測試初次誤用隱藏 summary 操作，改走實際作答流程後，4 個新增 e2e 全數通過，含手機展開來源 axe 與溢出檢查。已檢視手機來源截圖與分享圖。
- **報告結果**：76 項來源覆蓋率 100%、雙審 0%、AI 協助 100%；其中 72 項 reviewed。篇幅未超過初始門檻，這不是閱讀年級或易懂程度的認證。18 個不同來源 URL：16 個 HTTP 成功，Science DOI 403 與 USGS 文獻逾時列 manual，沒有認定失效或修改引用。
- **待人工確認**：ADR-0018、來源原文、手機實讀與篇幅門檻；部署後社群分享快取需實測。M5 驗收狀態不因工具完成而改變。
- **下一步／文件**：依使用者要求建立 PR，待 CI 與人工審閱；本次未要求合併。操作及人工檢查見 [內容品質工具](review/content-quality.md)，決策見 [ADR-0018](adr/0018-content-quality-and-discovery.md)。本機報告位於忽略的 `reports/`，CI 保存 artifact，未進公開網站。

## 2026-09-27：提交 P0／P1 修訂 PR
- **工作狀態**：分支 `codex/content-review-p0-p1`；本節隨本次 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **使用者審核狀態**：保留使用者自行標記的 30 條名詞、22 張圖鑑卡、20 題情境題為 reviewed；`cons-001`、`cons-005`、`cons-009` 及暫緩發布的 `cons-012` 為 draft。AI 未代為完成內容審核檢核表。
- **驗證**：針對更新後的審核狀態重跑 `npm run check` 與正式 `npm run build`，均通過，產物檢查 49 個 HTML 通過；先前程式版本已通過 139 個單元測試與 52 個 e2e。本次提交包含退回審核指南；對照題雙審仍關閉。
- **待處理**：PR 人工審閱、CI 結果、ADR-0017 與來源查核清單；M5 全部內容審核仍未完成。本次要求建立 PR，未要求合併本次變更。

## 2026-09-27：補充退回審核操作
- **範圍**：依使用者要求更新 `docs/review/review-guide.md`，補上手動退回草稿、審核者紀錄處理、重新發布步驟，以及一位審核者時的 8 題保育發布組合。
- **狀態**：沿用 `codex/content-review-p0-p1` 的未提交變更；使用者已自行調整部分內容審核狀態，前一節的「76 項全為草稿」是當時驗證結果，不代表目前狀態。本次只改文件，未代改內容審核狀態。
- **驗證與下一步**：`git diff --check` 通過；操作說明已對照標記工具與比例檢查。未重跑程式測試；實際退回後由操作者執行 `npm run check` 與 `npm run build`，確認引用與發布比例。M5 人工驗收仍待完成。

## 2026-09-27：P0／P1 內容與審核機制修正
- **目標與範圍**：依使用者提供的外部驗證修正 P0、P1。P2／P3 未納入；所有內容仍為 `draft`、`aiAssisted: true`，沒有執行正式人工標記。
- **工作狀態**：分支 `codex/content-review-p0-p1`，基底 `b1837bc`（PR #16 已合併）；本次修改尚未提交，接手時核對 `git status`。
- **已完成**：同一律、充足理由律、機率鏈、權威證言、代表性與混淆等概念修訂；對照題收斂結論，修正同類案例；76 項內容皆有來源書目；名詞套用共用審核資料，已審內容需來源，爭議保育內容需不同審核者；人工工具支援多位審核者並於寫入前驗證整批資料。
- **使用者修正**：對照題雙審先設計、不啟用。目前 `src/lib/review-policy.ts` 的 `controlRequiresSecondReview` 為 `false`，一般對照題一人即可。既有爭議保育內容的雙審仍保留，現標記 `cons-001`、`cons-005`、`cons-009`。
- **驗證**：`npm run lint`、`npm run check`、139 個單元測試、正式 `npm run build`（含產物檢查）通過；76 項全為草稿，正式建置只有 7 個非內容頁。e2e 最初因缺 Chromium 無法啟動，安裝對應版本後重跑，52 個端對端與無障礙測試全部通過；`git diff --check` 通過。
- **待人工確認**：ADR-0017、概念與正解、來源原文及適用範圍；部分學術網站阻擋自動讀取，不宣稱全文已核對。完整清單見 [P0／P1 人工檢查](review/p0-p1-checklist.md)。
- **下一步**：確認測試與差異後審閱提交；實際完成人工審核才由人類標記 reviewed，不因程式檢查通過勾選 M5 人工內容審核。
- **相關文件**：[ADR-0017](adr/0017-content-accuracy-and-review-gates.md)、[審核指南](review/review-guide.md)、[schema](sdd/03-content-schema.md)。

## 2026-09-27：將 Codex 納入共用規範
- **目標與範圍**：依既有規範支援 Codex、Claude Code 與其他 AI 工具接手；本次只修改協作文件及 Issue 範本引用。
- **工作狀態**：PR 分支 `codex/shared-ai-instructions`，基底為 `origin/main`（`5a7530d`）；本紀錄隨規範更新一同提交，接手時請以 PR、`git log` 與 `git status` 確認最新狀態。
- **已完成**：新增 `AGENTS.md` 作為共用規範；`CLAUDE.md` 改為導讀；`CONTRIBUTING.md` 補上開工提示與交接流程；同步 README、CONTEXT、SDD 06／10、社群指引及實驗 Issue 範本的引用；新增 ADR-0016 與本紀錄。
- **驗證**：`git diff --check` 通過；與起點 `CLAUDE.md` 比對，八項紅線與社群文化／AI 協作段落逐字相同；共用規範低於 32 KiB；使用專案既有 `yaml` 套件成功解析實驗 Issue 範本並核對紅線引用。相對文件連結已檢查。
- **未執行**：未跑程式單元測試、建置及 e2e，本次沒有改程式或網站內容；尚未在新的 Codex／Claude Code 工作階段實測載入及交接。
- **待處理與風險**：ADR-0016 維持「提議」，由人類維護者確認；不同工具可能未自動讀取規範，開工時使用 CONTRIBUTING 的提示確認。AI 不得自行核准或合併 PR。
- **下一步**：審閱本次文件變更；切換工具時要求摘要適用規範與 Git 現況，確認能接手。M5 的人工內容審核等事項仍未完成，不因本次文件更新而勾選。
- **相關文件**：[共用規範](../AGENTS.md)、[開工提示](../CONTRIBUTING.md#使用-ai-工具協作)、[ADR-0016](adr/0016-shared-ai-instructions.md)、[治理與傳承](sdd/10-governance.md)、[里程碑](sdd/11-milestones.md)。
