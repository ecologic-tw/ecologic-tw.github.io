# AI 協作交接紀錄

## 2026-09-27：將 Codex 納入共用規範
- **目標與範圍**：依既有規範支援 Codex、Claude Code 與其他 AI 工具接手；本次只修改協作文件及 Issue 範本引用。
- **工作狀態**：PR 分支 `codex/shared-ai-instructions`，基底為 `origin/main`（`5a7530d`）；本紀錄隨規範更新一同提交，接手時請以 PR、`git log` 與 `git status` 確認最新狀態。
- **已完成**：新增 `AGENTS.md` 作為共用規範；`CLAUDE.md` 改為導讀；`CONTRIBUTING.md` 補上開工提示與交接流程；同步 README、CONTEXT、SDD 06／10、社群指引及實驗 Issue 範本的引用；新增 ADR-0016 與本紀錄。
- **驗證**：`git diff --check` 通過；與起點 `CLAUDE.md` 比對，八項紅線與社群文化／AI 協作段落逐字相同；共用規範低於 32 KiB；使用專案既有 `yaml` 套件成功解析實驗 Issue 範本並核對紅線引用。相對文件連結已檢查。
- **未執行**：未跑程式單元測試、建置及 e2e，本次沒有改程式或網站內容；尚未在新的 Codex／Claude Code 工作階段實測載入及交接。
- **待處理與風險**：ADR-0016 維持「提議」，由人類維護者確認；不同工具可能未自動讀取規範，開工時使用 CONTRIBUTING 的提示確認。AI 不得自行核准或合併 PR。
- **下一步**：審閱本次文件變更；切換工具時要求摘要適用規範與 Git 現況，確認能接手。M5 的人工內容審核等事項仍未完成，不因本次文件更新而勾選。
- **相關文件**：[共用規範](../AGENTS.md)、[開工提示](../CONTRIBUTING.md#使用-ai-工具協作)、[ADR-0016](adr/0016-shared-ai-instructions.md)、[治理與傳承](sdd/10-governance.md)、[里程碑](sdd/11-milestones.md)。
