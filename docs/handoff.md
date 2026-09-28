# AI 協作交接紀錄

## 2026-09-28：ADR-0027 試行題 P3、P5 提案
- **目標與範圍**：依已接受的 ADR-0027，以情境協作流程起草評估文件中的 P3、P5；只建立提案，不轉入正式內容、不影響網站與對照題比例。
- **分支**：`content/reading-notes-p3-p5`，自 `origin/main`（`861bb0c`，含 PR #59）建立。
- **已完成**：
  - P3 `two-slot-booking`（日常對照題，`answer: none`）：管理室只開放兩個時段、上午已被登記，推出「要借活動中心的話」只剩下午；結論刻意限縮，避免變成假兩難。解說對照「所以讀書會只能下午辦」會變成假兩難。
  - P5 `summer-egret-count`（保育，草率概括）：三次調查都在七月週六早上，推論全年都相同。刻意不寫生態事實（不主張鷺鷥數量會隨季節變化），只談樣本涵蓋；由管理單位一方犯錯。解說區分訴諸無知。
- **驗證**：`npm run scenario -- check` 兩份皆只剩 nextSteps；以暫存副本（nextSteps 清空）執行 `promote --dry-run`，兩份皆可轉入（將分配 daily-020、cons-020），副本已刪除。另跑 `npm run check`、`npm run check:docs`、`git diff --check`。
- **待人工**：正解與干擾選項是否有合理的第二解；P3 來源 OpenStax 5.3 的支持範圍核對；P5 缺野外調查時段／季節涵蓋的可靠來源（AAPOR 只支持抽樣的一般概念）；至少一位試讀者試讀；轉入前確認日常對照題比例（目前 4／19，加入後 5／20）與保育題立場分布。
- **下一步**：人工核對與試讀，完成後清空 nextSteps，執行 `npm run scenario -- promote`，再依 ADR-0027 Review Point 決定是否擴充。

## 2026-09-28：錯字勘誤與維護者確認事項
- **目標與範圍**：修正 cons-004 簡體字，並記錄 Decision Owner 在對話中做出的確認與決定；只改內容錯字與文件。
- **分支**：`docs/maintainer-confirmations`，自 `origin/main`（`c57ae17`，含 PR #58）建立。
- **已完成**：cons-004「僅凭」改為「僅憑」，依 ADR-0025 屬細微修改，只改 `updated`、不寫修訂說明。依 @Wang-Yi-Zhang 的決定：`updates.yaml` 第一則與第一批兩則修訂說明確認不改；承接 ADR-0026 Decision Owner（維持提議）；接受 ADR-0027 並將試行列入里程碑。里程碑補列 cons-001、005、009 缺第二位審核者；手機檢查表補上 VoiceOver 全部朗讀的實測。
- **驗證**：見 PR 說明。
- **Org 設定**：管理員開啟 org「Require two-factor authentication」，AI 以 API 確認後勾選 SDD 07；第二位 Owner 需等新成員。
- **後續追蹤**：VoiceOver「全部朗讀」會略過名詞按鈕文字（使用者實測「命題」被略過）。已排除缺 alt；推測與 `popovertarget` 有關，Decision Owner 決定暫緩，記於里程碑與手機檢查表。
- **下一步**：ADR-0027 試作 P3、P5。

## 2026-09-28：Lighthouse、手機實測與網站名稱連結
- **目標與範圍**：M5 的 Lighthouse 與手機實測；修正 Lighthouse 指出的網站名稱連結無障礙名稱問題。
- **分支**：`fix/wordmark-accessible-name`，自 `origin/main`（`4eaa7c7`）建立。
- **已完成**：`SiteHeader.astro` 移除 aria-label，改以可見文字加隱藏的「，回首頁」組成名稱（WCAG 2.5.3，axe `label-content-name-mismatch`）。里程碑記錄 Lighthouse 與手機實測結果；新增 [手機實測檢查表與紀錄](review/mobile-test-checklist.md)。
- **驗證**：lint、check、238 項單元測試、build、87 項 e2e 通過；以 axe 單獨檢查 `/`、`/about/`、`/me/` 無違規。Lighthouse 與手機實測由使用者在正式網址執行，AI 解析報告：無痕模式下 `/`、`/guide/`、`/me/` 效能與無障礙皆 100；網站 JS 約 10–12 KB，字型 480–850 KB 為最大下載量。
- **待確認**：VoiceOver 在名詞按鈕處朗讀中斷，AI 無法重現，需使用者確認中斷情形（評估見檢查表）。尚未測 Android、字級最大、慢速網路、深色、橫向。
- **另外發現**：`cons-004` 解說有簡體字「凭」（應為「憑」），全站只有這一處；屬已審內容，未在本 PR 修改，待決定是否另開勘誤。
- **下一步**：確認 VoiceOver 中斷情形；M5 剩餘項目為內容審核（雙審題缺第二審核者）與 Org 設定（2FA、第二位 Owner）。

## 2026-09-28：ADR-0028 實施確認與必要檢查
- **目標與範圍**：記錄 ADR-0028 在 GitHub 上的實際驗證結果，以及 ruleset 必要檢查的調整；只改文件。
- **分支**：`docs/adr-0028-required-checks`，自 `origin/main`（`1595ed2`，含 PR #56）建立。
- **已完成**：管理員（@Wang-Yi-Zhang）在 ruleset `protect-main` 將必要檢查改為 `check`、`e2e`、`docs`，AI 以 GitHub API 確認；ADR-0028 補實施紀錄並更新已知風險；SDD 07 的 ruleset 描述同步列出三項必要檢查。
- **已驗證**：純文件 PR #56 的 `check`、`e2e` 為略過且可合併，合併後 Deploy 未觸發；本機跑 `git diff --check`、`npm run check:docs`。
- **待確認**：本 PR 是新 ruleset 下第一個純文件 PR，應確認略過的 `e2e` 被視為通過、PR 可合併。
- **下一步**：依 ADR-0028 Review Point，約 2026-10-28 檢查誤判情形。

## 2026-09-28：接受 ADR-0028 並以純文件 PR 驗證
- **目標與範圍**：PR #55 合併後，Decision Owner 接受 ADR-0028；本 PR 只改文件，同時作為純文件 PR 的第一次實際驗證。
- **分支**：`docs/accept-adr-0028`，自 `origin/main`（`f152a1d`，含 PR #55）建立。
- **已完成**：ADR-0028 狀態改為接受，Decision Owner 為 @Wang-Yi-Zhang（依其在對話中的指示）。
- **已驗證**：PR #55（改 `.github/`）在 GitHub 上跑了 `changes`、`docs`、`check`、`e2e` 四項並全數通過，確認程式 PR 仍跑完整檢查。本次本機只跑 `git diff --check` 與 `npm run check:docs`。
- **待確認**：本 PR 上 `check`、`e2e` 應顯示為略過且可合併；合併後 Deploy 不應觸發。管理員仍需將 `e2e`、`docs` 加入 ruleset 必要檢查。
- **下一步**：依 ADR-0028 Review Point，實施一個月後（約 2026-10-28）檢查是否有誤判。

## 2026-09-28：純文件 PR 略過完整 CI（ADR-0028）
- **目標與範圍**：純文件 PR 不再跑完整 check 與 e2e、合併後不重新部署；程式與內容 PR 行為不變。
- **分支**：`ci/skip-docs-only`，自 `origin/main`（`4784e97`）建立，後 rebase 至 `30263dc`（含 PR #54）。
- **已完成**：ADR-0028（提議）；`ci.yml` 新增 `changes`（shell 判斷，不用第三方 Action）與 `docs` job，`check`、`e2e` 以 fail-safe 條件略過；`deploy.yml` 以 `paths` 排除純文件；新增 `npm run check:docs`、`src/lib/doc-links.ts` 與單元測試；同步 07、AGENTS 常用指令。
- **發現**：ruleset 目前只要求 `check`；`e2e` 失敗不會阻擋合併。建議管理員將 `e2e`、`docs` 加入必要檢查。
- **驗證**：見 PR 說明；workflow 實際行為需在 GitHub 上以一個純文件 PR 與一個程式 PR 各驗證一次。
- **下一步**：使用者推送並開 PR；合併後以純文件 PR 確認 `check` 顯示為略過且可合併。

## 2026-09-28：閱讀筆記評估補充候選
- **目標與範圍**：依使用者要求，將先前討論中 PR #53 評估未涵蓋的想法補進 `docs/review/reading-notes-assessment.md`；不寫閱讀筆記範本段落，不改 ADR-0027 的試行順序。
- **分支**：`docs/reading-notes-supplement`，自 `origin/main`（`4784e97`）建立。
- **已完成**：新增「方案 B、C 的補充候選」一節：基線偏移、後見之明偏誤、框架效應補充、《道德經》原文引言；限制段落補充說明。只改文件，未新增內容檔、schema 或 ADR。
- **驗證**：`git diff --check`；確認引用的 SDD 12 §5、社群指引 §16、ADR-0027 存在。未跑程式測試（未改程式或內容）。
- **待人工確認**：候選來源（Pauly 1995、Papworth 等 2009、Fischhoff 1975、Tversky & Kahneman 1981）皆為待查證線索，AI 未核對原文；是否採用仍依 ADR-0027 Review Point。
- **下一步**：依 ADR-0027 先試作 P3、P5。

## 2026-09-28：閱讀筆記公開版評估與 PR
- **目標與範圍**：整理閱讀素材的教材方向與納入方案；使用者修訂為公開版後，要求 commit 與建立 PR。本次依公開版原則同步交接紀錄，不保留逐書摘要、私人回答或個人閱讀側寫。
- **分支與提交**：`codex/reading-notes-assessment`，基底 `de62c90`；提交三份文件：公開評估、ADR-0027 提議與本交接紀錄。實際 commit／PR 以 Git 紀錄為準；既有 `.claude/` 不納入。
- **已完成**：教材主線、四方案比較、六題 draft 提綱與兩題試行提議；依使用者版本保留評估正文。未修改原始筆記、正式教材或審核狀態，未進行發布、試讀或合併。
- **驗證**：文件相對連結、規範一致性及 `git diff --check`；本次只改文件，未執行 lint、check、test、build 或 e2e。初篩不等於全部原書、引文或研究查核。
- **待人工確認**：獨立內部版的實際保存狀態尚未確認；公開 repo 中標示「內部」不構成存取限制。建議補明節錄初篩限制、心理學背景審核與爭議保育雙審門檻，並統一對照題用語及 schema 對應。這些建議尚未改入使用者正文。
- **下一步**：PR 人工審閱；ADR 維持提議，Decision Owner 待承接，採納後再安排 P3、P5 的來源核對及試讀。M5 與既有來源缺口仍待處理，本次不改里程碑勾選。
- **相關文件**：[公開版教材評估](review/reading-notes-assessment.md)、[ADR-0027 提議](adr/0027-reading-notes-pilot.md)、[知識範圍](sdd/12-knowledge-scope.md)、[防誤用](sdd/08-misuse-prevention.md)。
## 2026-09-27：遊蕩犬貓題目的餵食用詞修正
- **目標與範圍**：使用者指出，長期餵食是否應納入飼主責任仍有爭議；不論定時餵食或乾淨餵食，都不利保育行動推進。原本 cons-018、cons-019 把「固定時間、吃完收碗、結紮」寫成志工的提議或可接受的做法，需要修正。
- **分支**：`content/stray-feeding-wording`，自 `main`（`45a1f33`，PR #50 合併後）建立；尚未提交。
- **已完成**：
  - `cons-018`：志工改為提議停止在戶外餵食，想照顧的人帶回家養、負起飼主責任或協助認養；居民仍回應「要讓牠們餓死」，答案仍為稻草人。更好的說法與檢核清單不再以調整餵食時間、地點為解方。
  - `cons-019`：反例居民改為「有在餵，但在意步道上的鳥，正在找人認養、想慢慢停止戶外餵食」；進階解說說明不論是否定時、是否收乾淨，仍是在戶外持續提供食物。新增 Doherty 等（2017）來源，`supports` 只寫「作者建議減少人為提供的資源」。
  - 移除兩題中的「結紮」說法；同步兩份已轉入的提案檔。
- **待人工確認**：兩題仍為 draft；「飼主責任」只出現在志工的台詞中，沒有寫成事實陳述，若要在解說中說明這項爭議，需要另找來源。
- **相關文件**：[防誤用](sdd/08-misuse-prevention.md)、[審核指南](review/review-guide.md)。

## 2026-09-27：遊蕩犬貓餵食爭議保育題
- **目標與範圍**：使用者要求新增遊蕩犬貓餵食爭議情境。依 08 寫作準則，這屬於爭議保育議題，需要呈現多方觀點並標記雙審，因此做成一組兩題，兩方各犯一次錯。
- **分支**：`content/stray-feeding`，自 `origin/main`（`a0f92a6`，PR #48 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。既有未追蹤 `.claude/` 不納入。
- **已完成**：以提案工具建立 `contributions/scenarios/stray-feeding-meeting.md`、`stray-feeding-post.md`，轉入 draft：
  - `cons-018`「河堤邊的餵食點」：志工提議調整餵食時間、地點並討論結紮，長期餵食的居民回應「要讓牠們餓死」，答案稻草人（志工的提議後來改為停止戶外餵食，見上一節）。
  - `cons-019`「步道口的飼料」：保育志工看到兩次有人亂倒飼料，就說餵狗貓的人都不在乎環境，答案草率概括；另一位居民的回覆是反例。
  - 兩題都是 `aiAssisted: true`、`requiresSecondReview: true`，沒有真實地名、團體或敏感物種。
- **來源核對**：已讀取 Loss 等（2013，Nature Communications）與 Doherty 等（2017，Biological Conservation）的摘要，`supports` 只寫摘要支持的範圍，並註明美國研究不代表本題社區。SEP「Fallacies」§1 有稻草人謬誤的定義。cons-019 沿用 cons-006 的 AAPOR 抽樣來源。
- **驗證**：見對應 PR 說明。
- **待人工確認**：兩題的正解與干擾選項、立場平衡、措辭。爭議保育題需要兩位不同審核者；目前角色名冊只有一位審核者，需要找第二位才能發布。
- **另外修正**：里程碑、SDD 02 與 SDD 12 仍把「訴諸武力」、「不當訴諸權威」修訂與 daily-018、019 列為未完成／draft；這些內容在 main 上已是 reviewed（審核者 Wang-Yi-Zhang，PR #46），經使用者要求已更新為完成。
- **發布安排**：使用者決定 cons-018、cons-019 先維持 draft、暫不公開，待找到第二位審核者。
- **PR #50 衝突處理**：合入最新 `origin/main`（PR #49）；唯一衝突為本檔頂端雙方各自新增的紀錄，完整保留兩節。PR #49 紀錄提到的里程碑與審核狀態落差，已由本節「另外修正」處理。
- **相關文件**：[防誤用](sdd/08-misuse-prevention.md)、[情境協作](review/scenario-contributions.md)、[審核指南](review/review-guide.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：README 環境準備與快速上手
- **目標與範圍**：補齊新接手者的環境準備、取得專案、啟動、檢查與預覽步驟；只修改 `README.md` 與本交接紀錄。
- **分支與狀態**：分支 `codex/readme-quickstart`，基底 `9ad0157`；使用者已要求 commit 與建立 PR，本節隨提交保存，commit／PR 以 Git 紀錄為準。既有未追蹤 `.claude/` 保留，未納入本次成果。
- **完成**：依 `.nvmrc`、`package.json`、Astro／Playwright 設定與 CI 核對指令，補上 Node.js 24.x、Git／npm、clone／安裝流程、草稿與正式建置差異、e2e 準備及接手文件入口。
- **驗證**：檢查文件引用與規範一致性、執行 `git diff --check`；本次只改文件，未執行 lint、check、單元測試、build 或 e2e，亦未重新實測全新環境安裝。
- **待辦與下一步**：供維護者審閱文件；本次無架構或流程決策變更，不新增 ADR、不變更里程碑完成狀態。既有里程碑與內容審核狀態落差仍見前次紀錄，需依實際人工審核紀錄核對。
- **相關文件**：[快速上手](../README.md#環境準備與快速上手)、[共用規範](../AGENTS.md)、[貢獻指南](../CONTRIBUTING.md)、[里程碑](sdd/11-milestones.md)。
- **PR #49 衝突處理**：依使用者要求合入最新 `origin/main`；唯一衝突為本檔頂端新增紀錄，完整保留雙方段落。確認相對 main 僅 README 與本交接紀錄有差異；文件連結與 `git diff --check` 通過。本次未修改程式，未重跑程式測試，待 PR CI 與人工審閱。

## 2026-09-27：內容修訂揭露（ADR-0025）與第一批修訂說明
- **目標與範圍**：評估「重要修訂主動揭露、細微修改保留紀錄」建議，起草 ADR-0025 並依 Decision Owner（@Wang-Yi-Zhang）在對話中的決定實作：說明不設 `status`，以同 PR、同審核者把關；補寫 cons-013 與不當訴諸權威的修訂說明；一併處理撤下期間匯入遺失紀錄。
- **分支**：`docs/revision-disclosure`，自 `origin/main`（`7b183ec`，PR #46 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。既有未追蹤 `.claude/` 不納入。
- **已完成**：
  - `updateSchema` 加 `about`、`impact` 與交叉檢查；`npm run check` 讀入 `updates.yaml` 並檢查 `about` 對象。
  - 圖鑑卡與情境題頁顯示最近修訂日期與修訂紀錄（情境題的紀錄收在作答後的解說內）、`answer-changed` 提示；題目列表對修正前的作答不顯示「答對」；`/me/` 匯入保留有撤下公告的內容紀錄。
  - `updates.yaml` 新增兩則說明（AI 起草）：cons-013 列為 `fix`、`impact: reread`（正解未變）；不當訴諸權威列為 `content`、`impact: reread`。
  - 更新 SDD 01／03／04／11、CONTEXT、審核指南、PR 範本。
- **更正**：ADR 初稿說「沒有檢查說明的 `link` 是否指向實際頁面」有誤；產物的站內連結檢查（Issue #41）已涵蓋 `/updates/` 頁，已在 ADR 背景改正。
- **驗證**：見對應 PR 說明。
- **人工決定**：ADR-0025 已由 @Wang-Yi-Zhang 標為接受；不當訴諸權威從「名人」擴大為「身分、地位或名氣」，由 @Wang-Yi-Zhang 判定為補充（維持 `kind: content`）。
- **待人工確認**：兩則說明的文字仍待內容審核者確認，確認後勾選里程碑對應項目。
## 2026-09-27：身分權威、訴諸武力與「我是你媽」情境
- **目標與範圍**：使用者問「我是你媽你要聽我的」如何歸類；依討論修訂「不當訴諸權威」、新增「訴諸武力」卡與一組日常情境題。
- **分支**：`content/authority-and-force`，自 `origin/main`（`9ad0157`，PR #45 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **歸類結論**（依 SEP 查證）：身分被拿來證明某件事為真 → 不當訴諸權威；在職責範圍內做決定 → 實踐權威，給的是行動的理由，不是謬誤；用威脅要人**相信**某說法 → 訴諸武力；用後果要人**去做**某件事，SEP 認為不是謬誤（例如罷工），屬溝通或倫理問題。AI 先前一度把「不聽就沒收手機」歸為訴諸武力，查證後已更正。
- **已完成**：
  - 修訂 `appeal-to-authority`：摘要改為「身分、地位或名氣」；新增主管例子；「何時不算謬誤」與進階補上理論權威與實踐權威的區分；新增 SEP「Authority」來源；依審核指南退回 draft、清空 reviewers。
  - 新增 `appeal-to-force`（draft，附小檢核）：保育例子兩方各一。
  - `daily-018`（媽媽以身分證明電影改編自真實事件，judge）與對照題 `daily-019`（爸爸說明理由後決定門禁），以提案工具建立並轉入 draft。
  - 更新 SDD 02、05、11、12；修正 02 與里程碑中已過時的狀態。
- **來源核對**：已讀取 SEP「Authority」§1.1 與「Fallacies」§1 第 9、11 項，`supports` 只寫原文支持的範圍。**同時發現 SEP「Fallacies」條目沒有討論訴諸傳統**，而已發布的「訴諸傳統」卡只以它為來源，需另找來源（已列入里程碑）。
- **驗證**：見對應 PR 說明。
- **待人工確認**：重新審核「不當訴諸權威」；審核「訴諸武力」、daily-018、daily-019。日常題開放 daily-018、019 後，對照題為 4／19＝21%。
- **相關文件**：[知識範圍](sdd/12-knowledge-scope.md)、[防誤用](sdd/08-misuse-prevention.md)、[審核指南](review/review-guide.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：提交溝通與意義內容 PR
- **目標／分支**：使用者表示已執行人工審核指令並要求 commit、發 PR；分支 `codex/communication-meaning`，基底 `0238dbf`，本節隨提交保存，commit／PR 以 Git 紀錄為準。既有 `.claude/` 不納入提交。
- **完成**：核對三張新圖鑑卡與三條新名詞皆為 reviewed、審核帳號 Wang-Yi-Zhang；保留使用者的審核變更，AI 未執行標記。同步 SDD 11／12 的本批完成狀態；下方草稿階段紀錄為歷史狀態。
- **驗證**：重新執行 lint、Astro／內容 check（0 診斷）、215 項單元測試、正式 build 及 71 頁產物檢查均通過；已審名詞 33/33、圖鑑 33/33、情境 31/34。沿用已確認的系統 npm CLI 路徑。未跑 e2e，本次未改互動程式；git diff --check 通過。
- **下一步**：建立 PR 後由維護者查看 CI、審閱並決定是否合併；AI 不核准或合併。非暴力溝通審核者背景等人工資格仍依 [知識範圍](sdd/12-knowledge-scope.md) §5，由人類負責確認。其他舊里程碑落差未在本批處理。

## 2026-09-27：非暴力溝通、主觀意義與客觀意義
- **審核指令補正**：後續核對 `mark-reviewed.ts` 發現圖鑑與名詞同 ID 會被工具拒絕；三條新名詞 ID 已改為 `nonviolent-communication-term`、`subjective-meaning-term`、`objective-meaning-term`，卡片的 `terms` 與內文引用同步更新。六項合併 `--dry-run` 通過，未執行正式標記。此為前次新增內容的相容性修正，非工具規則變更。
- **目標／分支**：依使用者要求加入三個概念；使用者確認「主觀／客觀意義」採語言／溝通角度。沿用 `main`，基底 `0238dbf`，本次尚未提交或發布；既有未追蹤 `.claude/` 保留。
- **已完成／檔案**：新增 `src/content/entries/zh-TW/` 下的 `nonviolent-communication.md`、`subjective-meaning.md`、`objective-meaning.md`，以及 `src/content/terms/zh-TW/terms.yaml` 的 3 條名詞；皆為 `draft`、`aiAssisted: true`、空審核者。每卡包含生活／保育虛構例子、常見誤解與小檢核。同步 `CONTEXT.md`、SDD 11／12 及本紀錄，未改 schema、依賴或已審內容。
- **來源與界線**：已讀取 CNVC 的 Preparation 與 Purpose of NVC 頁面，以及 SEP 的 Paul Grice、Pragmatics 條目。「主觀／客觀意義」明列為本站教學用語，分開說話者意圖、公共語言／語境依據、聽者理解，不宣稱為統一學術二分法。非暴力溝通介紹框架，不宣稱普遍效果或療效。
- **驗證**：Node 24.11.1；lint、Astro／內容 check（0 診斷）、215 項單元測試、正式 build 與 68 頁產物檢查通過。含草稿 Astro build 為 74 頁；另以既有 `checkInternalLinks` 驗證全部草稿頁站內連結，確認 3 張新卡有 noindex、名詞標記已轉換、正式產物未包含新卡與新名詞；篇幅報告無新內容提醒。`git diff --check` 通過。未跑 e2e／瀏覽器視覺檢查，本次只新增內容與文件，未改互動程式。
- **環境與驗證修正**：預設 `npm` 包裝器指向不存在的使用者 npm CLI；改以 `node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'` 執行相同 scripts，未修改環境設定。曾誤對 `dist-drafts` 執行正式 `check-dist.ts`，因草稿、noindex 與預覽 sitemap 等正式發布規則失敗；該次不算通過，已改用上述草稿專用斷言，正式 `dist` 檢查通過。
- **待人工確認／下一步**：人工核對例子、來源支持範圍及「客觀意義」的教學簡化；非暴力溝通依 SDD 12 §5 需具心理學背景的審核者。確認後由人類依審核指南標記 reviewed；本次沒有新增正式情境題，也未核准或合併 PR。
- **既有文件落差**：目前內容檢查為名詞 30/33、圖鑑 30/33、情境 31/34 reviewed；舊里程碑仍列訴諸傳統與進階題待審、cons-013 待重審，與目前內容狀態有落差。應由維護者依實際審核／Git 紀錄同步，未由 AI 代認定人工審核完成。
- **相關文件**：[內容格式](sdd/03-content-schema.md)、[防誤用](sdd/08-misuse-prevention.md)、[知識範圍 §6](sdd/12-knowledge-scope.md)、[里程碑](sdd/11-milestones.md)、[審核指南](review/review-guide.md)、[ADR-0020](adr/0020-concept-kind-and-knowledge-scope.md)、[ADR-0021](adr/0021-bias-evidence-strength-and-psychology-scope.md)。

## 2026-09-27：更新紀錄頁與 Atom 訂閱源（更新通知第 1 項）
- **目標與範圍**：讓使用者得知內容更新，且不違反紅線（無推播、無 Email、無追蹤、無黑帽文案）。使用者選擇先做第 1 項；本機「新」標記與 `/me/` 提示未做。
- **分支**：`feat/updates-feed`，自 `origin/main`（`0238dbf`，PR #43 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。工作目錄中既有的未追蹤 `.claude/` 未觸碰。
- **已完成**：ADR-0024（使用者接受，Decision Owner @Wang-Yi-Zhang）；內容 `published` 欄位（schema 版本 3）；`npm run review` 首次審核自動填 `published`、既有值不覆寫；`updates` 集合與第一則說明；`/updates/` 頁（依月份、首批內容只顯示數量）；`/updates/feed.xml`（僅 reviewed、最多 50 筆、草稿建置為空）；各頁 `<head>` alternate 連結與頁尾連結；sitemap 納入；`check-dist` 檢查訂閱源格式與不含未審內容；同步 01、03、04、06、07、11、CONTEXT、審核指南。
- **驗證**：提交前以 Node 24.11.1 重新執行 `npm run lint`、`npm run check`、222 個單元測試、`npm run build`（69 頁，產物與站內連結檢查通過）、85 個 e2e，皆通過；並修正「首批內容」段落句號後多出的空白。原始驗證為本機副本（Node 22，專案要求 Node 24）`npm run check`、`npm run lint`、222 個單元測試、正式 `npm run build`（69 頁，產物檢查通過）；訂閱源以 XML 解析器驗證為合法 Atom。含草稿建置的 85 個 e2e（含新增 4 個：頁尾連結、訂閱源無草稿、淺色／深色 axe）全數通過。
- **待人工確認**：`updates.yaml` 第一則說明的日期與文字；既有已審內容沒有 `published`，一律顯示為「首批內容」，不推測日期。
- **下一步**：審閱後提交並開 PR；依 ADR-0024 Review Point 評估第 2、3 項。
- **相關文件**：[ADR-0024](adr/0024-updates-page-and-feed.md)、[schema](sdd/03-content-schema.md)、[審核指南](review/review-guide.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：兩項 P1 修正
- **目標／分支**：修正必要段落驗證缺口與 cons-013 的推論說明；`codex/p1-content-validation`，基底 `de62097`；本節隨修正提交並依使用者要求建立 PR，commit／PR 以 GitHub 與 Git 紀錄為準。前次架構檢視報告一併保存供追溯；原有 `.claude/` 不納入提交。
- **已完成**：`scenario-sections.ts` 提供共用必要段落驗證，正式內容檢查、提案轉入與人工標記工具皆使用；新增缺漏／空白／錯誤標題、CRLF、reviewed 本文缺失及人工工具不寫入的回歸測試。人工標記仍須另跑全站 check 驗證引用與比例，本次未改變其全部發布規則。
- **內容修正**：依提案流程建立並轉入 `contributions/scenarios/detection-inference-p1.md`，cons-013 明確區分必然條件句與機率性證據判斷；退回 draft、清空舊審核者，先前審核保留於 Git。正式建置暫不包含該題，未代為人工審核；其餘題目狀態不變。
- **驗證**：201 項單元測試通過；lint 首次發現測試中的 non-null assertion，修正後通過；Astro／內容 check 通過（30/34 情境題 reviewed），正式 build 與 67 頁產物檢查通過。未跑 e2e（本次無 UI 互動變更）。既有 USGS 來源頁本次存取回傳 403，未宣稱重新查核全文。
- **待人工確認／下一步**：閱讀 cons-013 的進階解說，確認不把機率判斷當成演繹保證；核對來源適用範圍後，依審核指南重新標記 reviewed。P2 項目未處理。相關規範：[內容格式](sdd/03-content-schema.md)、[防誤用](sdd/08-misuse-prevention.md)、[逐步協作](review/scenario-contributions.md)、[審核指南](review/review-guide.md)。

## 2026-09-27：進階題型第 3 階段與「訴諸傳統」
- **目標與範圍**：使用者要求執行 ADR-0022 §6 第 3 階段，並補充「訴諸傳統」謬誤的圖鑑卡與情境題；ADR-0020 改為接受另開分支（`docs/accept-adr-0020`）。
- **分支**：`content/phase3-and-appeal-to-tradition`，自 `origin/main`（`3797c60`，PR #30 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。兩項內容放在同一分支，是為了避免分別開分支時都分配到 `daily-015` 造成題號衝突，也讓第 3 階段的題目能把新卡當作選項。
- **已完成**：
  - `appeal-to-tradition` 卡（draft，與訴諸自然成對；保育例子兩方各一）與日常情境題 `daily-015`「中秋晚會照舊」（judge、basic）。
  - 5 題進階題 draft，皆以 `npm run scenario -- new … --format` 建立再轉入：`daily-016`（choice／反例）、`daily-017`（choice／形式辨識）、`cons-015`（multi）、`cons-016`（validity-soundness，形式無效）、`cons-017`（choice／反例）。連同第 2 階段的 3 題，每主題各 4 題。
  - 更新 SDD 02、05、11、12。
- **立場平衡**：保育題共 17 題，由保育方犯錯 7 題（cons-015、cons-017 為新增），超過三分之一。
- **驗證**：見對應 PR 說明。
- **待人工確認**：
  - 「訴諸傳統」卡與 daily-015、daily-016、cons-017 引用的 SEP／OpenStax 是否直接討論該概念，尚未逐字核對，已在 `supports` 註明。
  - cons-015 把草率概括與訴諸自然列為「可接受」；cons-017 的「外來種／入侵種」區分未附生態學來源，情境中的例子明確標為假設情況。
  - daily-016 的第二個選項（短會也有好決定）是否會被認為也能推翻原主張。
- **下一步**：人工審核 8 題進階題、「訴諸傳統」卡與 daily-015。
- **相關文件**：[ADR-0022](adr/0022-advanced-question-formats.md)、[知識範圍](sdd/12-knowledge-scope.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：進階題型第 2 階段（作答頁、工具、e2e）
- **目標與範圍**：依 ADR-0022 §6 第 2 階段，做出 `multi`、`validity-soundness`、`choice` 的作答頁與前端腳本，讓 `npm run scenario` 支援 `--format`，並補 e2e 與 axe。
- **分支**：`feat/advanced-formats-ui`，自 `origin/main`（`1b0f39a`，PR #26 合併後）建立；本節隨 commit 提交，PR 與 commit 以 GitHub／Git 紀錄為準。
- **已完成**：
  - `quiz.ts` 新增 `gradeMulti`、`soundnessOf` 純函式；情境題頁依 `format` 呈現作答區與「看答案與解說」（逐項解說、兩軸說明），移除第 1 階段的建置失敗保護。
  - 前端腳本：單選題與 `validity-soundness` 的兩軸共用「單選群組」流程；`multi` 逐項標示 ✓／↻／✗／△，圖示搭配文字。沒有 JavaScript 時答案與逐項解說收在 `<details>`。
  - `npm run scenario -- new … --format multi|validity-soundness|choice` 產生對應欄位；`edit` 不可換題型。
  - 3 題 draft（`aiAssisted: true`）：daily-013（multi）、daily-014（choice／隱藏前提）、cons-014（validity-soundness），皆以工具建立提案再轉入，算進第 3 階段的 8 題。
  - 更新 03、04、情境協作指南、里程碑。
- **為什麼先寫 3 題**：e2e 以含草稿的建置執行，沒有新題型內容就無法測作答頁；另建測試專用的內容載入機制會增加正式程式的複雜度，因此改以草稿題測試。草稿不會發布。
- **驗證**：見對應 PR 說明。
- **待人工確認**：
  - 3 題的正解與選項是否有第二個合理答案，特別是 daily-013 把稻草人列為「可接受」、daily-014 的干擾選項是否太容易排除。
  - daily-014 的 OpenStax 來源是否討論隱藏前提，尚未逐字核對；「省略三段論」的說法未附來源。
  - cons-014 由開發方提出論證；保育題由保育方犯錯的比例為 5／14，仍符合 08 的三分之一原則。
- **過程中的問題（Learning Review 素材）**：使用者的開發伺服器上，judge 題（如 daily-010、cons-004）沒有選項。原因是第 1 階段變更 `content.config.ts` 時，執行中的舊開發伺服器偵測到設定指紋改變、清除快取，卻用記憶體裡的舊 schema 重建；指紋是新的、資料是舊格式，重開伺服器後仍沿用。處理方式：情境題頁遇到不明題型時改為明確報錯並說明處理方法，`content.config.ts` 註解補上「先停止伺服器、刪除 `.astro/data-store.json`」；本次修改該檔也讓使用者目前的伺服器自動重建快取，已確認兩題恢復。正式建置與 CI 不受影響。
- **下一步**：第 3 階段補齊其餘 5 題（日常 2、保育 3，含形式辨識與反例選擇），再人工審核 8 題。
- **相關文件**：[ADR-0022](adr/0022-advanced-question-formats.md)、[畫面與互動](sdd/04-ux-interaction.md)、[內容格式](sdd/03-content-schema.md)、[情境協作指南](review/scenario-contributions.md)、[里程碑](sdd/11-milestones.md)。

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

## 2026-09-27：人與 AI 協作框架檢視
- **目標與範圍**：檢視共用規範、架構、CI、內容審核、治理及交接的優缺點；僅評估，未實施流程或架構決策。
- **Git 現況**：main，HEAD `72c78c2`；開工時只有未追蹤 `.claude/`，完整保留。本次僅追加本交接紀錄，未提交。
- **主要發現**：靜態架構、共用規範、schema、產物檢查與分層測試可降低 AI 修改風險；人工責任仍集中一人。更新說明無 status 且全量取用，里程碑卻仍記載文字待確認，需釐清紅線與 ADR-0025 的適用範圍及實際審核證據。現有 schema 檢查審核者欄位，不能證明其審核了目前版本；來源存在也不證明主張成立。含草稿的 Chromium e2e 與正式發布集合不同。交接文件已有同檔頂端衝突紀錄，文件同步成本可見。
- **驗證**：`npm test` 因使用者 npm 啟動器找不到 npm-cli.js 失敗；改以 `node node_modules/vitest/vitest.mjs run` 執行，17 個檔案、235 個測試通過。沒有重跑 lint、Astro check、build、e2e，沒有查核遠端 GitHub ruleset、CODEOWNERS team 或正式部署。文件差異執行 `git diff --check`。
- **待人工決定／下一步**：優先核對更新說明的發布與人工審核紀錄、CODEOWNERS 與分支保護實況，並評估內容修訂與審核版本綁定、第二位審核者及正式建置 smoke test。上述均為建議；如採納架構或流程變更須另走 ADR，不由 AI 自行決策。
- **相關文件**：[架構](sdd/06-architecture.md)、[資安](sdd/07-security-privacy.md)、[治理](sdd/10-governance.md)、[里程碑](sdd/11-milestones.md)、[審核指南](review/review-guide.md)、[ADR-0025](adr/0025-revision-disclosure.md)。

## 2026-09-27：首次貢獻入口與接力草案
- **目標與範圍**：依使用者「開始」指示，完成首次貢獻流程的第一輪文件；新增 ADR-0026 提議、四張任務卡與接力／真人試走範例，更新 CONTRIBUTING、README 和里程碑。
- **分支與差異**：main，基底 `72c78c2`；本次尚未提交。開工既有 `docs/handoff.md` 的框架檢視追加紀錄與未追蹤 `.claude/` 均保留。本次三個新檔為 `docs/adr/0026-first-contribution-pilot.md`、`docs/review/first-contribution-tasks.md`、`docs/review/first-contribution-walkthrough.md`。
- **完成**：試讀、查證、技術修改三種入口；來源查核、修訂說明試讀、手機操作與環境指引四張任務卡，均有範圍、交付條件、提交管道及接力需求。範例區分個人貢獻、待審與發布；接力者及 Decision Owner 未自行指定。
- **驗證**：Node 唯讀檢查六份新增／修改入口文件的 55 個本機連結（包含頁內錨點），全部通過；對照既有 Issue 範本、提案及審核指南檢查流程一致性；`git diff --check` 通過。文件未新增執行指令，任務引用 README 既有操作；未重跑環境安裝、lint、check、單元測試、build 或 e2e，因本次僅修改文件。外部表單／網站操作及真人試走尚未實測。
- **待人工決定與下一步**：ADR 維持提議；由人類承接 Decision Owner，安排一位自願參與者試走一張卡並確認接力者。未建立對外招募 Issue、未發布、未修改正式內容或審核狀態。里程碑只勾選文件草案準備，未把真人驗證寫成完成。
- **相關文件**：[ADR-0026](adr/0026-first-contribution-pilot.md)、[任務卡](review/first-contribution-tasks.md)、[接力與試走](review/first-contribution-walkthrough.md)、[里程碑](sdd/11-milestones.md)。

## 2026-09-27：提交首次貢獻試行文件
- **授權與分支**：使用者要求 commit、發 PR；分支 `codex/first-contribution-pilot`，基底 `72c78c2`。本節隨文件提交，PR 與 commit 以 Git 紀錄為準。
- **提交範圍**：首次貢獻入口、四張任務卡、接力範例、ADR-0026 提議、README／里程碑及本次對話的框架檢視交接紀錄；未追蹤 `.claude/` 不納入。
- **驗證與待辦**：沿用上一節 55 個本機連結與錨點檢查結果，提交前再跑 `git diff --check`。本次僅文件修改，未重跑程式測試；遠端 CI 與人工審閱待 PR 建立後確認。ADR 仍待人類決定，未進行真人試走，未授權或執行合併。
