# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-09-29，Claude（Cowork）

## 目前工作區
三個分支都自 `main`（`2205dba`，含 PR #83 爭點地圖）建立，已提交、待審，彼此獨立、合併順序不限：
- **`docs/accept-adr-0035`**（本檔所在）：接受 ADR-0035，handoff 改為只記目前狀態、PR 模板加「交接」段；11 里程碑精簡；AGENTS 文件地圖補 `DESIGN.md` 與 handoff；ADR-0011 到 0019 改為接受；`.gitignore` 加 `.claude/`。驗證：`npm run check:docs`、`git diff --check`。
- **`refactor/scenario-format-components`**：情境題頁面依題型拆成元件（`src/components/scenario/`），頁面 26 KB → 13 KB，不改行為。驗證：lint、check、276 個單元測試、build、113 個 e2e 通過；83 頁 HTML 與 360 張截圖逐像素比對與重構前相同。
- **`chore/promoted-proposals`**：17 份已轉入的情境提案移到 `contributions/scenarios/promoted/`；`promote` 轉入後自動搬移，已轉入的名稱不能再建立提案；README、投稿指南、SDD 06、ADR-0019 同步。驗證：276 個單元測試、eslint、Prettier、`check:docs`。
- 驗證都在另一份工作副本以 Node 22 執行（專案要求 Node 24），以 PR 的 CI 結果為準。
- **未追蹤**：`Claude outputs/`（前一版 handoff 草稿，已過時，可刪）。
- **2026-09-29 本機清理（不影響 repo 內容）**：刪除已被 gitignore 的建置與報告產物，以及 37 條已合併進 main 的本機分支（commit 都在 main 歷史中）；執行 `git gc`。

## 待人工決定
- `docs/review/p0-p1-checklist.md`：2026-09-27 那一輪的一次性清單，仍有 14 項未勾。建議在開頭標註「歷史清單」，並刪掉 `review-guide.md` 第 134 行已過時的「本次修訂仍是 AI 草稿」。
- `docs/review/2026-09-27-architecture-audit.md`：當時的審查快照，ADR-0025 有引用。建議保留，只在開頭標註「歷史快照」。
- [ADR-0026](adr/0026-first-contribution-pilot.md) 的試行安排（仍是提議，還沒有真人試走）。
- 第二位審核者：cons-001、005、009、018、019 需要雙審，是 M5 的主要卡點。
- 爭點地圖 daily-023、cons-022 的人工審核（逐句是否有第二種合理答案）；發布時同一個 PR 補 `updates.yaml` 功能說明。
- 「訴諸傳統」卡需要另找來源。

## 近期日期
- **2026-10-11**：[ADR-0023](adr/0023-sustainability-and-contributor-value.md) 公開徵詢截止（Issue #38）。
- **2026-10-31**：ADR-0035 Review Point（handoff 是否維持 60 行內、接手是否順利；目前沒有自動檢查行數）。
- **約 2026-12-29**：[ADR-0030](adr/0030-psychology-open-review.md) Review Point。
- **2027-03**：第一次角色檢視。

## 下一步
1. 審閱並合併上述三個 PR。
2. SDD 13 第 4 項「多方觀點情境」：先寫 ADR。新題型依 `docs/sdd/06` 的「情境題頁面與題型元件」加元件即可。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
