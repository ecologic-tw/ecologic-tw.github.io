# 內容審核指南（M5）

AI 協助撰寫的內容從草稿開始（`status: draft`、`aiAssisted: true`），只有人工審核後的 `reviewed` 內容才會發布。本指南說明如何分批審核與退回草稿；目前進度以內容檔案及 `npm run check` 結果為準。

> 紅線 4：只有人工審核者可以把內容改為 `reviewed`。AI 不可代為執行本指南的標記步驟。

## 審核什麼（依 docs/sdd/08）
每一項都對照 PR 模板的「內容審核檢核表」，其中**最重要的是邏輯正確性**：AI 常把合理的推論誤標為謬誤。

- 情境為虛構，無真實人名、機關、可辨識事件
- 無精確地點或敏感物種棲地資訊（最多到「某縣山區」）
- 正解正確，干擾選項不會也是合理答案
- 「何時不算謬誤」確實成立
- 措辭不羞辱、不引戰
- 保育題立場分布符合平衡原則；涉及仍有社會爭議的議題時，由第二位審核者確認
- 事實陳述附可靠來源

## 為什麼要照順序
建置會擋下兩種情況，順序不對就會失敗：
1. **已審內容不能引用草稿**：圖鑑卡引用名詞、其他卡（`related`、`pairWith`）；情境題引用正解與干擾選項的卡、名詞。
2. **已審情境題的對照題比例**：每個主題要在 15%–30% 之間。

分析結果：
- 22 張圖鑑卡透過 `related`／`pairWith` 全部連在一起，**只能一次全部改為 reviewed**。可以分多天審，最後一次標記。
- 情境題依編號每 4 題一批，每批剛好有 1 題對照題（004、008、012），逐批標記時比例始終是 25%。

## 發布前的來源與審核門檻（ADR-0017）

- 圖鑑卡、情境題、名詞都需要 `updated`，發布時至少一個非空的來源書目與一位不同的審核帳號。
- `sources.supports` 可標明支援哪項主張及限制。人工仍需看原文；引用存在不代表支援整篇內容。
- `requiresSecondReview: true` 的爭議內容至少兩位不同審核者；同帳號不同大小寫不算兩人。此規則原本已在保育寫作規範中要求，本次加入程式檢查。
- **對照題雙審目前不啟用**：`src/lib/review-policy.ts` 中 `controlRequiresSecondReview: false`，一般對照題仍一人即可。未來有人力時先補齊已審對照題的第二審核者，再透過 PR 改為 `true`，跑 `npm run check` 與測試；不要用環境變數讓本機與 CI 規則不同。
- 所有審核帳號都必須對應實際完成審核的人。只有一人時，爭議內容先保留 draft；不可填假帳號、AI 名稱或關掉爭議旗標湊數。
- 人工工具支援多個 `--reviewer`，會先驗證整批指定項目，任一項失敗就不寫入。它不驗證帳號本人、來源真實性或全部跨內容引用，標記後仍需 `npm run check` 與 PR 審核。

兩人已實際完成審核時，指令例如（替換為真實帳號）：

```sh
npm run review -- --reviewer ReviewerOne --reviewer ReviewerTwo cons-001 --dry-run
```

下面的批次只是相依順序，**不代表已滿足審核或來源要求**。含爭議題的批次需兩人；草稿仍需逐項審閱，不能直接照抄指令就算完成審核。

## 批次與指令
每一批：審核 → 修改內容 → 執行標記指令 → `npm run check` → 開 PR（完成檢核表）→ 合併。合併後該批內容就會出現在正式網站。

以下指令中的 `Wang-Yi-Zhang` 請換成實際審核者的 GitHub 帳號。先加 `--dry-run` 可只看會改哪些檔案。

### 第 1 批：名詞（30 條）
沒有相依，可以先做。

```sh
npm run review -- --reviewer Wang-Yi-Zhang argument premise conclusion inference proposition truth-value validity soundness conditional antecedent consequent sufficient-condition necessary-condition negation conjunction disjunction contradiction deduction induction counterexample fallacy cognitive-bias sample representative-sample correlation causation confounder burden-of-proof base-rate principle-of-charity
```

其中 `inference`、`truth-value`、`sufficient-condition`、`conjunction`、`deduction` 目前沒有被任何卡或題目引用，只會出現在名詞頁。可保留，或在這批一併刪除。

### 第 2 批：圖鑑卡（22 張，含 8 題卡內小檢核）
需要第 1 批先合併。

```sh
npm run review -- --reviewer Wang-Yi-Zhang ad-hominem affirming-the-consequent appeal-to-authority appeal-to-nature availability-heuristic confirmation-bias correlation-causation denying-the-antecedent disjunctive-syllogism fallacy-fallacy false-dilemma hasty-generalization hypothetical-syllogism law-of-excluded-middle law-of-identity law-of-non-contradiction modus-ponens modus-tollens principle-of-sufficient-reason slippery-slope straw-man survivorship-bias
```

### 第 3–8 批：情境題（每批 4 題）
需要第 2 批先合併。

| 批次 | 指令 |
|---|---|
| 3 | `npm run review -- --reviewer Wang-Yi-Zhang daily-001 daily-002 daily-003 daily-004` |
| 4 | `npm run review -- --reviewer Wang-Yi-Zhang daily-005 daily-006 daily-007 daily-008` |
| 5 | `npm run review -- --reviewer Wang-Yi-Zhang daily-009 daily-010 daily-011 daily-012` |
| 6 | `npm run review -- --reviewer Wang-Yi-Zhang cons-001 cons-002 cons-003 cons-004` |
| 7 | `npm run review -- --reviewer Wang-Yi-Zhang cons-005 cons-006 cons-007 cons-008` |
| 8 | `npm run review -- --reviewer Wang-Yi-Zhang cons-009 cons-010 cons-011 cons-012` |

批次可以合併（例如 3–5 一起），只要每個主題已審的題目中，對照題仍在 15%–30%。

### 只有一位審核者時的保育題安排

`cons-001`、`cons-005`、`cons-009` 需要第二位審核者，先維持草稿。其餘 9 題若全部發布，3 題對照題占 33.3%，會超過上限。

可先審核並發布 `cons-002`、`cons-003`、`cons-004`、`cons-006`、`cons-007`、`cons-008`、`cons-010`、`cons-011` 共 8 題，對照題為 2／8＝25%；`cons-012` 暫留草稿。這是發布組合建議，每題仍須實際完成審核。若分成更小批次，每次都需重新檢查比例。

## 退回審核或暫緩發布

發現內容需修訂、原審核不完整，或要調整發布批次時，可以將 `reviewed` 改回 `draft`。目前標記工具只支援送審完成的標記，**沒有退回指令**，請手動編輯指定項目，避免整批取代。

1. 找到內容：圖鑑卡在 `src/content/entries/zh-TW/<id>.md`，情境題在 `src/content/scenarios/zh-TW/<id>.md`，名詞在 `src/content/terms/zh-TW/terms.yaml` 中對應 `id` 的項目。
2. 將該項目的 `status: reviewed` 改為 `status: draft`，並把 `updated` 改為實際修改日期（`YYYY-MM-DD`）。Markdown 修改頂端 YAML 區塊；名詞只修改該筆資料並保留縮排。
3. 依退回原因處理 `reviewers`：
   - **只暫緩發布、內容與審核結論未變**：保留實際審核者紀錄。
   - **內容需重審或原審核無效**：將 `reviewers` 清為 `[]`；先前紀錄由 Git 歷史保留。標記工具會合併既有帳號，因此不要把舊版審核者留作新版已通過的依據。
4. 在 PR 或交接紀錄寫明題目 ID、退回原因、是否需重審與恢復條件。保留 `sources`、`aiAssisted`、`requiresSecondReview` 與正確的 `isControl`，不要為通過檢查改變題目分類或審核門檻。
5. 執行 `npm run check`。若有已審內容引用這筆草稿，需連同受影響內容調整發布安排；圖鑑卡互相引用時可能連帶影響多張卡與情境題。每個主題已審情境題的對照題比例仍須在 15%–30%。完成調整後再跑 `npm run build`，確認正式產物。
6. 透過 PR 合併並成功部署後，正式網站才會反映退回結果；只改本機檔案不會撤下已上線內容。

例如：保育題已審 9 題、其中 3 題對照題時，可把 `cons-012.md` 的狀態改回 `draft`，保留其審核者（若只是暫緩發布），比例便成為 2／8＝25%。

恢復發布時，由人類確認內容與審核紀錄仍適用；需要重審的項目先完成審核，再執行原有標記工具。以下帳號請換成實際審核者，先預覽，再寫入：

```sh
npm run review -- --reviewer Wang-Yi-Zhang cons-012 --dry-run
npm run review -- --reviewer Wang-Yi-Zhang cons-012
npm run check
npm run build
```

恢復 `cons-012` 前須先確認發布組合符合比例；若仍只有上述 8 題已審，直接恢復會再次變成 3／9＝33.3%。`--dry-run` 只預覽標記操作，不會替代全站引用與比例檢查。人力不足的爭議題仍維持草稿，待第二位不同審核者完成審核後再安排發布。

## 需要特別注意的地方

### P0／P1 修訂後的人工驗證

本次修訂仍是 AI 草稿，請依 [P0／P1 人工檢查清單](p0-p1-checklist.md) 核對概念、小檢核、來源與對照題；程式通過不等同於知識內容已審核。

### 其他建議細看
- `affirming-the-consequent`：「何時不算謬誤」提到溯因推理，確認說法恰當
- 3 張認知偏誤卡的文獻（Nickerson 1998、Tversky & Kahneman 1973、Mangel & Samaniego 1984）：確認書目正確
- 對照題的推理是否真的沒有問題：`daily-004`、`daily-008`、`daily-012`、`cons-004`、`cons-008`、`cons-012`
  - `cons-012` 的「要嘛找夥伴、要嘛延期」是否可能被認為是假兩難
- 已標記第二審核：`cons-001`（禁漁區）、`cons-005`（水庫）、`cons-009`（魚塭光電）；人類仍需檢查其他內容有無漏標。

## 怎麼看草稿
- P2／P3 的來源連結、覆蓋率與閱讀長度工具見 [內容品質工具](content-quality.md)。`npm run build` 會產生報告；閱讀提醒不等於未通過人工審核，也不會自動改寫內容。
- `npm run dev`：開發伺服器會顯示草稿，頁面上方有「草稿」提示
- 直接讀 `src/content/` 下的 Markdown 檔
