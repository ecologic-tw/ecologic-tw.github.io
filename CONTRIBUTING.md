# 參與貢獻

謝謝你願意一起從各說各話，走向共同思考。

## 先讀這個
我們的文化是**自由決定、公開承擔、共同學習**，詳見[《共好型自主敏捷社群指引》](docs/共好型自主敏捷社群指引.md)與[行為準則](CODE_OF_CONDUCT.md)。簡單說：
- 你可以直接提案、直接動手，不需要等誰批准才敢開始。
- 說「我不知道」「我不同意」「我做不完了」都沒問題，越早說越好。
- 挑戰想法，不挑戰人。出錯時我們問「怎麼發生的」，不問「是誰」。

## 不會寫程式？
- 填表單回報或投稿情境：https://forms.gle/ZAacF8i7hQ7QF8LC9
- 有 GitHub 帳號：到 Issues 選擇範本開單

## 新增或修改內容
不必一次做完，也不必先知道謬誤名稱。**一段虛構對話、一個來源、一次試讀或一句改寫都是可獨立提交的貢獻**。不會寫程式可在投稿 Issue 留下目前完成的部分、希望別人接力的事，以及願意公開的署名／筆名（可不署名）。

情境題可使用 [逐步協作指南](docs/review/scenario-contributions.md)：工具會建立不影響網站的提案，列出待補事項，完成後自動分配題號並轉入正式草稿。修改現有題目時先建立修訂提案，原題在討論期間維持原狀；貢獻者與審核者分開記錄。

以下為正式內容準備與發布步驟，不是第一次投稿的門檻：
1. 閱讀 `docs/sdd/08-misuse-prevention.md` 寫作準則與 `docs/sdd/03-content-schema.md` 欄位說明。
2. 複製一個既有檔案當範本，放在 `src/content/…/zh-TW/`。
3. 新內容 `status: draft`；使用 AI 協助請標 `aiAssisted: true`。
4. 補齊支持主張的 `sources`；爭議保育內容標 `requiresSecondReview: true`，需第二位不同審核者。對照題雙審目前尚未啟用，見審核指南。
5. 本機執行 `npm run check` 確認通過，開 PR 並完成模板中的審核檢核表。
6. 維護者審核通過後改為 `reviewed` 並填入 `reviewers`。

## 修改程式
- 依 `docs/sdd/11-milestones.md` 挑選項目；新增套件或改變架構需附 ADR（`docs/adr/0000-template.md`）。
- 提交前：`npm run lint && npm run check && npm test`。
- commit message 用英文、Conventional Commits 格式。

## 使用 AI 工具協作
Codex、Claude Code 或其他 AI 工具均遵守 [AGENTS.md](AGENTS.md) 的共用規範；內容審核與決策責任不因工具不同而改變。

| 工具 | 規範入口 |
|---|---|
| Codex | 根目錄 `AGENTS.md`；從本專案目錄開始任務，先確認讀到共用規範 |
| Claude Code | `CLAUDE.md` 導讀至 `AGENTS.md`，依導讀完整閱讀 |
| 其他 AI 工具 | 明確要求讀取 `AGENTS.md`；無法存取 repo 時，提供檔案內容及任務所需文件 |

可複製以下提示開工或切換工具：

```text
請先完整閱讀 AGENTS.md、CONTRIBUTING.md、CONTEXT.md 與 docs/sdd/11-milestones.md，
按本次任務讀取相關 SDD、ADR 與既有交接紀錄，簡述適用的紅線與目前進度。
先確認分支和 git status，保留既有未提交變更，再接手以下任務：
（填入目標、範圍與交接紀錄的位置）
完成後說明變更、實際驗證結果、未完成事項及下一步，並依 AGENTS.md 留下交接紀錄。
```

交接紀錄放在既有 PR／Issue 或 repo 文件（未指定時可用 `docs/handoff.md`），不要只保存在單一 AI 的對話中。新增工具入口時只導向共用規範，避免複製出不同版本。流程理由見 [ADR-0016](docs/adr/0016-shared-ai-instructions.md)。

## 授權
提交即同意程式碼以 MIT、內容以 CC BY-SA 4.0 授權釋出。

## 其他參與方式
- 想試一個新點子：開「實驗提案」Issue（Hypothesis／Experiment／Evidence／Review）。
- 發現已上線內容或流程出錯：開「Learning Review」Issue。
- 想承擔某個角色：在每半年的「角色檢視」Issue 留言，或直接開 Issue 自薦。

## 行為準則
見 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
