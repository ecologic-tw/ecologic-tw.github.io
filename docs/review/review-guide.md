# 內容審核指南（M5）

目前所有內容都是 AI 協助撰寫的草稿（`status: draft`、`aiAssisted: true`），正式網站不會顯示。本指南說明如何分批審核，讓每一批合併後網站都能正常建置。

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

## 需要特別注意的地方

### 內文標示「待查證」（3 處）
審核時補上來源或改寫，並刪除「待查證」段落：
- `law-of-identity`：同一律在不同教材的表述方式
- `principle-of-sufficient-reason`：「中文教材將其列為思維基本規律」需補具體教材
- `appeal-to-authority`：「窗戶碰撞是城市鳥類的重要死因之一」為示意例句，需補來源或改寫

### 其他建議細看
- `affirming-the-consequent`：「何時不算謬誤」提到溯因推理，確認說法恰當
- 3 張認知偏誤卡的文獻（Nickerson 1998、Tversky & Kahneman 1973、Mangel & Samaniego 1984）：確認書目正確
- 對照題的推理是否真的沒有問題：`daily-004`、`daily-008`、`daily-012`、`cons-004`、`cons-008`、`cons-012`
  - `cons-012` 的「要嘛找夥伴、要嘛延期」是否可能被認為是假兩難
- `cons-001`（禁漁區）：是否屬於仍有社會爭議的議題，需要第二位審核者

## 怎麼看草稿
- `npm run dev`：開發伺服器會顯示草稿，頁面上方有「草稿」提示
- 直接讀 `src/content/` 下的 Markdown 檔
