# 參與貢獻

謝謝你願意一起把話說得更好。

## 先讀這個
我們的文化是**自由決定、公開承擔、共同學習**，詳見[《共好型自主敏捷社群指引》](docs/共好型自主敏捷社群指引.md)與[行為準則](CODE_OF_CONDUCT.md)。簡單說：
- 你可以直接提案、直接動手，不需要等誰批准才敢開始。
- 說「我不知道」「我不同意」「我做不完了」都沒問題，越早說越好。
- 挑戰想法，不挑戰人。出錯時我們問「怎麼發生的」，不問「是誰」。

## 不會寫程式？
- 填表單回報或投稿情境：https://forms.gle/ZAacF8i7hQ7QF8LC9
- 有 GitHub 帳號：到 Issues 選擇範本開單

## 新增或修改內容
1. 閱讀 `docs/sdd/08-misuse-prevention.md` 寫作準則與 `docs/sdd/03-content-schema.md` 欄位說明。
2. 複製一個既有檔案當範本，放在 `src/content/…/zh-TW/`。
3. 新內容 `status: draft`；使用 AI 協助請標 `aiAssisted: true`。
4. 本機執行 `npm run check` 確認通過，開 PR 並完成模板中的審核檢核表。
5. 維護者審核通過後改為 `reviewed` 並填入 `reviewers`。

## 修改程式
- 依 `docs/sdd/11-milestones.md` 挑選項目；新增套件或改變架構需附 ADR（`docs/adr/0000-template.md`）。
- 提交前：`npm run lint && npm run check && npm test`。
- commit message 用英文、Conventional Commits 格式。

## 授權
提交即同意程式碼以 MIT、內容以 CC BY-SA 4.0 授權釋出。

## 其他參與方式
- 想試一個新點子：開「實驗提案」Issue（Hypothesis／Experiment／Evidence／Review）。
- 發現已上線內容或流程出錯：開「Learning Review」Issue。
- 想承擔某個角色：在每半年的「角色檢視」Issue 留言，或直接開 Issue 自薦。

## 行為準則
見 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
