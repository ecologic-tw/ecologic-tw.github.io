# 情境的逐步協作

## 先做一小部分就好

提供構想、找來源、確認推理、改寫句子、試讀或最後審核，都可以由不同的人接力。投稿不要求知道答案，也不要求一次寫完所有欄位。使用 GitHub「投稿新情境」Issue，或在 `contributions/scenarios/` 提交小型 PR 即可；Issue／PR 不是私密空間，請勿填個資或真實可辨識事件。

| 階段 | 可交付的成果 | 接手的人可做什麼 |
|---|---|---|
| 構想 | 一段虛構對話或指出既有題目的疑問 | 討論想教的推理，辨別是否是合理推論 |
| 補充 | 一項來源、答案理由或措辭修正 | 核對來源，補解說與其他選項 |
| 試讀 | 指出看不懂、歧義或可能有第二個正解的地方 | 調整題幹、答案、改寫及檢核清單 |
| 整理 | 欄位與待辦已補齊 | 用工具轉成正式 draft，再走人工審核 |

每次只需寫清楚「做了什麼、還缺什麼」。不必自動認領全部待辦；沒把握就保留待確認，不填假的來源、答案或審核者。

## 建立新提案

在專案根目錄執行（需要既有 Node／npm 環境）：

```sh
npm run scenario -- new community-light --theme daily --title "社區路燈的新構想"
```

產生 `contributions/scenarios/community-light.md`。可先只寫 `## 情境`，其餘留空；這個目錄不進 Astro 內容集合，不影響網站建置或已審題目比例。提案名稱用小寫英數及連字號，已存在時工具不會覆寫。

保育主題使用 `--theme conservation`。有 AI 協助撰寫時加 `--ai`，或將提案的 `aiAssisted` 設為 `true`。

### 進階題型

進階模式的題型用 `--format` 指定（[ADR-0022](../adr/0022-advanced-question-formats.md)），預設是一般的單選判讀：

```sh
npm run scenario -- new lunch-menu --theme daily --title "營養午餐的菜單" --format multi
```

| `--format` | 題型 | 要補的欄位 |
|---|---|---|
| `multi` | 多重判讀（多選） | `answers`、`acceptable`（可空）、`distractors`，合計 4–6 個圖鑑卡；`notes` 為每個選項寫一句解說 |
| `validity-soundness` | 有效 × 健全 | `validity`（`valid`／`invalid`）、`premises`（`credible`／`not-credible`／`uncertain`），以及兩軸的 `notes` |
| `classify` | 爭點地圖（基礎與進階模式皆可，ADR-0034） | `items`：3–5 句，每句 `id`、`text`、`answer`（`fact`／`value`／`definition`／`interest`）、選填 0–1 個 `acceptable`、`note` |
| `choice` | 隱藏前提／形式辨識／反例選擇／鋼人練習／案例的共同點與先問什麼 | `task`（`hidden-premise`／`form`／`counterexample`／`steelman`／`common-ground`／`ask-first`）、`prompt`、`choices`（3–4 個，恰好一個 `correct: true`，每個都有 `note`） |

這些題型固定為進階題、不能當對照題。`validity-soundness` 與 `choice` 的改寫練習（`betterPhrasing`、`checklist`）是選填，需要時自行加上。修改既有題目時沿用原題題型，不能用 `edit` 換題型。

多方觀點案例的小題加上 `--case <案例 id>`（[ADR-0036](../adr/0036-multi-perspective-case.md)），例如 `--format choice --case daily-case-01`。小題固定為進階題；轉入時會檢查案例存在，並沿用案例的雙審標記。案例本身目前由維護者直接以草稿撰寫。

## 修改現有情境

```sh
npm run scenario -- edit cons-008 crossing-evidence
```

工具複製現有題目到提案工作區，保留來源、貢獻者與 AI 標記，清空提案中的舊審核者；正式題目暫不變。先改需要處理的部分即可。提案中的 `target` 和 `baseHash` 用於保護原題，不要手動更改；若原題在期間被別人更新，工具拒絕覆寫。請比較新舊差異，建立新的 edit 提案，再把自己的修訂逐段整合進去。

## 留下貢獻與待辦

頂端 YAML 例如：

```yaml
contributors:
  - name: 自願公開的筆名
    contribution: 提供情境構想
nextSteps:
  - 請其他人核對答案是否合理
  - 待補來源支持的具體主張
```

可以逐筆追加本人同意的署名與貢獻；同一人做了更多工作時更新原項目即可。也可以建立時加 `--contributor "公開筆名" --contribution "補充來源"`。留白可不署名，不影響投稿；不要填 Email、電話或未取得同意的他人姓名。AI 工具保留在 `aiAssisted`／PR 協作紀錄，不冒充人類貢獻者。

正式內容沿用 `contributors`，發布後顯示「一起完成這份內容的人」。`reviewers` 仍只記錄實際完成該版本審核的人；署名不會讓內容自動通過審核。舊內容沒有署名時不猜測作者，之後取得同意再補。

## 檢查目前還缺什麼

```sh
npm run scenario -- check community-light
```

會列出答案、選項、改寫、檢核清單、必要段落及 `nextSteps` 等待補項目。未完成是正常狀態，可以先提交提案讓其他人接力；`check` 不寫入檔案。

## 整理成正式草稿

共同確認待辦完成後，將 `nextSteps` 改為 `[]`，先預覽：

```sh
npm run scenario -- promote community-light --dry-run
npm run scenario -- promote community-light
npm run check
```

工具沿用正式 schema 及全站引用／安全檢查，新題自動分配下一個 daily／cons 題號，`isControl` 依 `answer: none` 推導；不需手動同步兩個欄位。轉入永遠是 `draft`，`reviewers` 清空，不會發布。提案標記 `promotedTo` 後移到 `contributions/scenarios/promoted/` 保留作為紀錄，防止重複轉入，名稱也不能再用；後續修訂使用新的 edit 提案。

修改既有題目的 promote 會把該題改回 draft，可能影響已審對照題比例，工具會拒絕造成現有內容檢查錯誤的轉入。遇到比例限制，不要關掉規則；先完成提案，與維護者安排整批修訂及人工審核，必要時依 [退回審核指南](review-guide.md) 調整發布批次。不要將尚未重審的修訂直接合併上線。

最後由人類依 [審核指南](review-guide.md) 確認來源、正解與發布組合，再標記 reviewed。提案可以多人分次完成，發布品質要求不變。

## 維護成本的變化

原本需複製完整正式檔、手改題號、清審核資料並一次備齊所有欄位；現在初次只需標題／主題與一段想法，編號與轉入檢查交給工具。仍由人類負責知識判斷、引用支持範圍及真實署名。這是 Git 檔案與 Issue／PR 的協作流程，不需要 CMS、後端或額外套件。
