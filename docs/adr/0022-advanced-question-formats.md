# ADR-0022 進階題型與多選題的資料模型與作答規則
- 日期：2026-09-27
- 狀態：接受（2026-09-27，@Wang-Yi-Zhang）
- Decision Owner：@Wang-Yi-Zhang
- Review Point：第一批進階題（每主題 4 題）發布滿一個月、或累積 5 則相關回饋時；檢視多選題是否讓讀者「總覺得一定有錯」，以及審核負擔是否可承受

## 背景
`docs/sdd/12-knowledge-scope.md` §4 規劃五種進階題型：多重判讀（多選）、有效 × 健全判定、隱藏前提、形式辨識、反例選擇。目前情境題只有一種作答方式：從「干擾選項＋正解＋沒有問題」中單選，`answer` 是一個圖鑑卡 id 或 `none`。

12 §4 原本寫「`answer` 將改為 `answers[]`」。盤點實際影響後發現：
1. 既有 25 題情境題（20 題已審）都要改 frontmatter。依 ADR-0019，修改既有題目要走 edit 提案，promote 後會退回 draft，已審題目會下架，也可能讓對照題比例不合規；若直接用腳本批次改寫，則是在未經人工審核的情況下修改已審內容。
2. `answer` 同時被收集判定、「謬誤的謬誤」徽章、對照題判定（`isControl ⇔ answer === 'none'`）、情境題頁、`npm run scenario` 工具與測試使用。
3. 「有效 × 健全」「隱藏前提」「形式辨識」「反例選擇」的選項不是圖鑑卡，而是自訂文字或兩個判斷軸，`answers[]` 也裝不下。

## 決策
1. **以 `format` 欄位區分題型，不遷移既有題目。** 情境題 schema 改為依 `format` 區分的聯集，預設 `judge`：沒有 `format` 的既有題目完全不變、不需重審。

   | `format` | 題型 | 選項來源 | 答對條件 |
   |---|---|---|---|
   | `judge`（預設） | 現行單選判讀 | 圖鑑卡＋「沒有問題」 | 選中 `answer` |
   | `multi` | 多重判讀（多選） | 圖鑑卡 | 選中全部 `answers`，且沒選任何 `distractors` |
   | `validity-soundness` | 有效 × 健全 | 兩個固定判斷軸 | 兩軸都答對 |
   | `choice` | 隱藏前提／形式辨識／反例選擇 | 自訂文字 | 選中唯一正確選項 |

2. **新題型只出現在進階模式**：`format` 不是 `judge` 時必須 `difficulty: advanced`。基礎模式、主題完成徽章（只看 basic 題）不受影響。

3. **各題型欄位**（示意，實作時寫入 03）：
   ```yaml
   # multi：選項＝answers ∪ acceptable ∪ distractors，共 4–6 個，三者互斥
   format: multi
   answers: [straw-man, false-dilemma]   # 1–3 個；允許只有 1 個，避免讀者從題型猜出數量
   acceptable: [slippery-slope]          # 選填 0–2 個：有道理但非主要問題，選或不選都不算錯
   distractors: [ad-hominem, appeal-to-nature]
   notes:                                # 每個選項都必填個別解說
     straw-man: ……

   # validity-soundness：健全＝有效且前提可信，由程式推導，不另存
   format: validity-soundness
   validity: invalid                     # valid | invalid
   premises: uncertain                   # credible | not-credible | uncertain
   notes: { validity: ……, premises: …… }

   # choice：共用一個作答元件，task 只決定標題與提示文字
   format: choice
   task: hidden-premise                  # hidden-premise | form | counterexample
   prompt: 這段推理沒有說出口的前提是？
   choices:                              # 3–4 個，恰好一個 correct: true，每個都要 note
     - { text: ……, correct: true, note: …… }
   ```
   - `multi` 不提供「沒有問題」選項（`answers` 至少一個，它永遠不會是正解）。對照題仍只有 `judge` 題，`isControl` 規則不變。
   - `betterPhrasing`、`checklist`（改寫練習）在 `judge`、`multi` 必填；`validity-soundness`、`choice` 選填，沒有時不顯示改寫區。
   - 自訂文字（`prompt`、`choices`、`notes`）套用既有的網址、電話、Email 檢查。

4. **作答與結果顯示**（補充 04）：
   - 全部採選擇式，`multi` 用核取方塊，其餘用單選，不做拖曳。`multi` 的題目說明寫明「選出所有適用的，可能只有一個」。
   - `multi` 送出後逐項標示，圖示一律搭配文字、不只靠顏色：✓ 選到的正解／↻ 還沒選到的正解／✗ 選了但不適用／△ 可接受。整體結果文案沿用「答對了」「換個角度看看」，不計分、不顯示部分得分。
   - 沒有 JavaScript 時沿用現行做法：題目與選項照常顯示，正解與逐項解說收在「看答案與解說」`<details>`。

5. **本機進度與徽章**：
   - `answered[id]` 維持 `{ correct, at }`，只記錄是否完全答對，不記錄選了哪些選項；進度版本維持 1，匯出匯入格式不變。
   - 內容索引把各題型統一換算成「答對可點亮的卡」：`judge` 為 `[answer]`（`none` 除外），`multi` 為 `answers`，其他題型為空。收集與「謬誤的謬誤」徽章改用這份清單，行為對既有題目不變；已得徽章照舊不收回。
   - 對照題比例（15%–30%）仍以該主題全部已發布情境題為分母，進階題不會讓比例計算失效。

6. **分階段實作，各自開 PR**：
   1. schema、建置期檢查、內容索引與徽章換算、單元測試（不含新內容）；同步更新 02、03。
   2. 情境題頁與前端作答腳本、`npm run scenario` 支援 `format`、e2e 與淺色／深色 axe；同步更新 04。
   3. 約 8 題進階題 draft（每主題 4 題，四種題型各至少 1 題），標 `aiAssisted: true`，待人工審核。

## 依據的資訊與假設
- 已確認：`answer` 的使用點為 `src/lib/quiz.ts`、`src/lib/badges.ts`、`src/lib/content-checks.ts`、`src/lib/content-schema.ts`、`src/scripts/scenario.ts`、`src/pages/scenario/[id].astro`、`src/pages/me/index.astro`、`scripts/scenario.ts` 與相關測試。
- 已確認：ADR-0019 的 edit 提案 promote 後會把原題改回 draft。
- 假設 1：`format` 預設值足以讓舊題目零修改通過新 schema；實作第 1 階段以既有 25 題實際跑 `npm run check` 驗證。
- 假設 2：四種題型共用「選擇式」元件，前端只需 radio／checkbox 兩種輸入，不需新增 npm 套件。
- 假設 3：「可接受答案」能吸收多數審核爭議（例如某段話同時帶有滑坡的味道，但不是主要問題）。

## 已知風險
- 風險 1：`multi` 沒有「沒有問題」選項，可能強化「一定有錯」的印象，與 08 防誤用目標相反 → 只在進階模式出現、對照題比例計算不變、題目說明允許只有一個問題；若在 Review Point 發現這種傾向，考慮加入互斥的「沒有問題」選項。
- 風險 2：每個選項都要個別解說，撰寫與審核量約為現行題目的 2–3 倍，目前只有一位審核者 → 第一批限 8 題，閱讀長度報告持續提醒篇幅。
- 風險 3：多選題的「正解／可接受／不適用」本身就是判斷，審核者之間容易有不同意見 → 爭議選項優先放進 `acceptable`，並在 `notes` 說明理由。
- 風險 4：收集與徽章改用換算清單，若換算錯誤會影響既有使用者的圖鑑顯示 → 以單元測試鎖定「既有 `judge` 題結果不變」。
- 風險 5：`choice` 的自訂文字不是圖鑑卡，無法沿用「選項＝卡名」的相關卡片連結 → 選填 `related` 欄位留待實作時決定，不在本 ADR 範圍。

## 考慮過的選項（含不同意見）
- **照 12 §4 把 `answer` 改為 `answers[]` 並遷移全部題目**：資料最一致，但會動到 20 題已審內容（退回 draft 或未經審核就被修改），且仍裝不下非圖鑑卡的題型。
- **另建 `advanced-scenarios` 內容集合**：完全隔離既有題目，但題號、列表、隨機一題、進度與徽章都要重寫一套，重複程式較多。
- **多選部分給分**：資訊量較多，但違反 05「不計分數排名」的精神，也容易變成分數比較。
- **拖曳排序或配對題**：互動較豐富，但鍵盤與螢幕報讀支援成本高，12 §4 已排除。
- **`multi` 加入互斥的「沒有問題」選項**：可緩解風險 1，但核取方塊與互斥選項混用，對鍵盤與螢幕報讀使用者較難理解；列為 Review Point 的備案。

## 後果
- 既有 25 題不需修改或重審；新題型可以逐題加入。
- 02 規則 2、03 情境題 schema、04 作答流程需要在實作 PR 中同步更新；12 §4 改為引用本 ADR。
- 前端作答腳本從單一流程改為依 `format` 分派，情境題頁的元件會變多，需要新的 e2e 與 axe 測試。
- 進度格式不變，使用者不需要重新匯出或匯入。
