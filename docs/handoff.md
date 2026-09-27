# AI 協作交接紀錄

## 2026-09-27：進階題型第 1 階段（ADR-0022 接受）
- **目標與範圍**：使用者接受 ADR-0022、擔任 Decision Owner，要求執行 §6 第 1 階段：schema、建置期檢查、收集與徽章換算、單元測試；不含作答頁、工具與新內容。
- **分支**：`feat/advanced-formats-schema`，自 `origin/main`（`a972057`，PR #23 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **已完成**：
  - 情境題 schema 改為依 `format` 區分的聯集（`judge` 預設／`multi`／`validity-soundness`／`choice`），既有 25 題不需修改即通過。
  - refine：新題型必須 `advanced`、不可為對照題；`multi` 選項互斥、不含 `none`、合計 4–6 個、每個選項都有 `notes`；`choice` 恰好一個正確選項。
  - 建置期檢查：`multi` 的 `answers`／`acceptable`／`distractors` 參照；題型專屬文字納入個資檢查與閱讀篇幅報告。
  - `collectableEntries` 把各題型換算成「答對可點亮的卡」，收集與「謬誤的謬誤」徽章改用它；對既有題目結果不變。
  - 情境題頁遇到 `judge` 以外的題型會讓建置失敗，直到第 2 階段完成作答頁。
  - ADR-0022 改為「接受」；更新 02、03、CONTEXT、里程碑。
- **驗證**：Node 24.11.1；`npm run lint`、`npm run check`、187 個單元測試（新增 21 個）、`npm run build`（49 頁）、57 個 e2e（含淺色／深色 axe）皆通過。
- **過程中的問題（Learning Review 素材）**：第一次 build 失敗，既有題目的 `format` 是 `undefined`。原因是 Astro 內容快取（`node_modules/.astro/data-store.json`）只重新解析有變更的內容檔，修改 `content-schema.ts` 不會讓快取失效；只有 `src/content.config.ts` 變更才會清除。已在該檔加入 `CONTENT_SCHEMA_VERSION` 與註解，本次變更會讓每個人的本機快取自動重建。CI 只快取 npm 下載，不受影響。之後修改 schema 輸出格式時要一併調高這個版本號。另外，AI 在第 1 階段尚未 commit 時請使用者執行 `git switch -c content/review-concept-cards origin/main`，未提交的變更因此被帶到審核分支；已先 commit 審核標記，再以 `git stash` 把第 1 階段變更移回本分支，沒有遺失。之後請先 commit 或暫存，再請使用者切換分支。
- **人工審核（未由 AI 標記）**：使用者表示 PR #20 的 7 張新卡已確認無誤。依紅線 4 與 `scripts/mark-reviewed.ts`，AI 不執行標記；AI 只以 `--dry-run` 確認可通過 schema；使用者已自行執行 `npm run review`，標記另開 `content/review-concept-cards`（PR #24），與本 PR 分開。里程碑的「人工審核 7 張新卡」在本 PR 勾選。
- **下一步**：第 2 階段（作答頁、前端腳本、`npm run scenario` 支援 `format`、e2e 與 axe；同步更新 04）。
- **相關文件**：[ADR-0022](adr/0022-advanced-question-formats.md)、[內容格式](sdd/03-content-schema.md)、[領域模型](sdd/02-domain-model.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：進階題型與多選題 ADR（ADR-0022）
- **目標與範圍**：依 SDD 12 §4，先寫進階題型與多選題的 ADR；本次只有文件，不改程式與內容。
- **分支**：`docs/adr-advanced-question-types`，自 `origin/main`（`5f0ae3f`，PR #21 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **已完成**：新增 [ADR-0022](adr/0022-advanced-question-formats.md)（提議）；SDD 12 §4 改為引用 ADR-0022；里程碑勾選「先寫 ADR」並新增「決定是否接受」「分階段實作」兩項。
- **主要提議**：以 `format` 欄位（`judge` 預設／`multi`／`validity-soundness`／`choice`）區分題型，**不照 12 §4 原規劃把 `answer` 改為 `answers[]`**，理由是遷移會動到 20 題已審情境題（依 ADR-0019 會退回 draft，或未經審核就被修改），且非圖鑑卡的題型也裝不下。新題型只出現在進階模式；進度格式不變，只記錄是否完全答對。
- **驗證**：只改文件；已執行 `npx prettier --check`、`git diff --check`，並以 grep 核對 ADR 列出的 `answer` 使用點。
- **待人工決定**：
  - ADR-0022 的 Decision Owner 與是否接受，特別是「不遷移既有題目」與原 12 §4 規劃不同。
  - `multi` 不提供「沒有問題」選項，可能強化「一定有錯」的印象（ADR-0022 風險 1）；備案是加入互斥的「沒有問題」選項。
  - 每個選項都要個別解說，審核量約為現行題目的 2–3 倍；目前只有一位審核者。
- **下一步**：ADR 接受後依 §6 分三個 PR 實作；02、03、04 在實作 PR 中同步更新，不在本 PR 先改。
- **相關文件**：[ADR-0022](adr/0022-advanced-question-formats.md)、[知識範圍 §4](sdd/12-knowledge-scope.md)、[ADR-0019](adr/0019-incremental-scenario-contributions.md)、[ADR-0015](adr/0015-m3-quick-check-badges-and-import.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：訴諸無知保育情境題（cons-013）
- **目標與範圍**：依 PR #20 後的下一步，新增一題以「訴諸無知／偵測率」為主題的保育情境題；不修改既有題目、圖鑑卡與審核狀態。
- **分支**：`content/argument-from-ignorance-scenario`，自 `origin/main`（`15c0354`，PR #20 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。開工前已將本機 `main` 快轉至 `15c0354`，並以 `git branch -d` 刪除 6 個已合併的本機分支。
- **已完成**：以 `npm run scenario` 建立提案 `contributions/scenarios/frog-call-survey.md`，promote 為 `cons-013`「溪邊沒聽到蛙叫」（draft、`aiAssisted: true`、basic）。社區保育志工隊長只調查兩晚、且兩晚都很冷，就宣布樹蛙已消失；正解 `argument-from-ignorance`，干擾選項 `survivorship-bias`、`correlation-causation`。
- **立場平衡**：既有 12 題保育題中有 4 題由支持保育的一方犯錯（剛好 1/3）；若新題由另一方犯錯，會降到 4/13 而違反 08 的平衡原則，因此本題由保育方犯錯（5/13）。
- **驗證**：Node 24.11.1；`npm run lint`、`npm run check`（已審情境題 20／25）、166 個單元測試、`npm run build`（49 頁，新草稿未發布）、57 個 e2e（含草稿建置、淺色／深色 axe）皆通過。閱讀長度報告中 cons-013 未觸發提醒。
- **待人工確認**：
  - 刻意不用 `hasty-generalization` 當干擾選項，因為「兩晚沒聽到 → 已消失」也可能被讀成草率概括而出現第二個正解；請審核者確認目前的干擾選項是否太容易排除。
  - 「低溫時可能較少鳴叫」在解說中只以假設語氣出現，未附來源；若要改成事實陳述，需補兩生類調查的文獻。
  - 來源只有 MacKenzie et al. (2002)，沿用 cons-004 的條目，支援範圍同樣限於「偵測率小於一」。
- **下一步**：人工審核 cons-013 與 PR #20 的 7 張新卡；補 3 張偏誤卡的 `evidence`；進階題型與多選題另開分支並先寫 ADR（SDD 12 §4）。
- **相關文件**：[知識範圍](sdd/12-knowledge-scope.md)、[ADR-0020](adr/0020-concept-kind-and-knowledge-scope.md)、[情境協作指南](review/scenario-contributions.md)、[防誤用準則](sdd/08-misuse-prevention.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：知識擴充第一階段（基礎概念卡、訴諸無知、偏誤證據強度）
- **目標與範圍**：依使用者要求補充「真」的哲學定義與邏輯知識、評估心理學內容；使用者選擇「分階段」：本次只做基礎概念卡別與證據強度欄位，多選／進階題型另開分支。
- **分支**：`docs/knowledge-scope-concept-evidence`，自 `origin/main`（`dfd6cc5`，PR #19 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **已完成**：`concept` 卡別（必填小檢核、色標「溪」並同步 DESIGN.md）；`evidence` 欄位（僅偏誤卡、頁面顯示標籤；draft 偏誤卡必填）；7 張 draft 新卡（命題與真值、有效與健全、演繹／歸納／溯因、必要與充分條件、條件句的四種變形、什麼是「真」？、訴諸無知）；新增 SDD 12 知識範圍、ADR-0020、ADR-0021（皆「提議」）；更新 02、03、05、08、11、CONTEXT、AGENTS 文件地圖。
- **驗證**：在本機副本（Node 22，專案要求 Node 24）執行 `npm run check`、`npm run lint`、166 個單元測試、正式 `npm run build`（49 頁，新草稿未發布）皆通過；含草稿建置 60 頁，57 個 e2e（含淺色／深色 axe）全數通過。新卡閱讀長度皆未超過門檻。
- **待人工確認**：
  - 7 張新卡的正確性與來源：來源由 AI 列出（SEP 條目、OpenStax、Walton 1996、Tarski 1944、Hurley 教科書、MacKenzie 2002），**未逐一以原文核對**；Hurley 與 Walton 未附網址。
  - 既有 3 張偏誤卡的 `evidence` 值，AI 建議（僅供參考）：確認偏誤 `robust`、倖存者偏誤 `robust`（統計選樣偏差概念）、可得性捷思 `moderate`（原始研究穩健，部分延伸效果的重複驗證結果不一）。補值後依 ADR-0021 改為全面必填。
  - ADR-0020、0021 的 Decision Owner 與是否接受。
- **過程中的問題（Learning Review 素材）**：本次開工時 AI 未先核對 Git 現況，直接覆寫了 `docs/sdd/02`、`03` 並修改 `CONTEXT.md`；發現後以 `git show HEAD:<file>` 還原（當時工作區無其他未提交變更，未遺失資料）。另外，資料夾預設禁止刪除，git 鎖定檔無法移除，已取得使用者授權刪除權限。
- **下一步**：人工審核新卡；進階題型與多選題另開分支並先寫 ADR（見 SDD 12 §4）；新增一題「訴諸無知／偵測率」保育情境題。
- **相關文件**：[知識範圍](sdd/12-knowledge-scope.md)、[ADR-0020](adr/0020-concept-kind-and-knowledge-scope.md)、[ADR-0021](adr/0021-bias-evidence-strength-and-psychology-scope.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：外部連結與漸進情境協作
- **基底與狀態**：已確認 PR #18 合併至 main，merge commit `500158018799a0c803761ae0c8766696b84fef3e`。本次分支 `codex/scenario-contributions`，本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準；未修改既有題目與審核狀態、未啟用對照題雙審。
- **外連**：參考資料、頁尾原始碼、關於／參與／授權等連結改用 ExternalLink，共用另開視窗提示與安全屬性；Markdown 外連自動轉換；建置拒絕漏設 target 的外連。內部導航保持原樣。
- **降低維護門檻**：`npm run scenario -- new|edit|check|promote` 建立不完整提案、列待辦、複製修訂及驗證後轉入 draft。提案在 `contributions/scenarios/`，不影響網站。工具自動題號／對照題旗標、清舊審核者、保留 YAML 註解與貢獻者，檢查原題 hash 避免覆寫其他人的修改；保留所有正式審核門檻。
- **協作署名**：可選 contributors（公開名稱／筆名、實際貢獻）供三種內容顯示，不取代 reviewers。未猜測或批次補填舊內容作者；Issue 模板、CONTRIBUTING、關於頁及協作指南支援只做一小部分與交接 nextSteps。
- **驗證**：lint、160 個單元測試、Astro／內容 check、49 頁正式 build 通過；57 個 e2e 全部通過。手機 390px 回饋區無橫向溢出，已檢視截圖；Issue YAML 解析及 git diff --check 通過。工具測試只寫暫存 fixtures，未實際轉入正式情境。早期建置發現舊內容未帶 contributors 預設值，已在顯示元件加入空陣列相容處理並重建通過。
- **待人工確認／下一步**：依使用者要求建立 PR，待 CI 與人工審閱，尚未要求合併。檢閱 ADR-0019 與 [情境協作指南](review/scenario-contributions.md)，首次多人接力時確認流程及署名同意。M5 全部內容人工審核仍未完成。

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
