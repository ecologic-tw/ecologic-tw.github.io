# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-09-29，Claude（Claude Code）

## 目前工作區
- **`docs/adr-0036-multi-perspective-case`**（自 `main` `8d1646c` 建立，待審）：提議 [ADR-0036](adr/0036-multi-perspective-case.md) 多方觀點情境，只改文件、尚未實作。同步 SDD 13 §6、11 里程碑。
- PR #84–#87 都已合併，爭點地圖試行題已發布。
- **未追蹤**：`Claude outputs/`（前一版 handoff 草稿，已過時，可刪）。

## 待人工決定
- ADR-0036 的四個待決事項（見 ADR 最後一節）：是否接受；小題改用 `choice` 而不是 `multi`；一律雙審或日常案例依 08 判斷；試行案例的主題。
- `docs/review/p0-p1-checklist.md`：2026-09-27 那一輪的一次性清單，仍有 14 項未勾。建議在開頭標註「歷史清單」，並刪掉 `review-guide.md` 第 134 行已過時的「本次修訂仍是 AI 草稿」。
- `docs/review/2026-09-27-architecture-audit.md`：當時的審查快照，ADR-0025 有引用。建議保留，只在開頭標註「歷史快照」。
- [ADR-0026](adr/0026-first-contribution-pilot.md) 的試行安排（仍是提議，還沒有真人試走）。
- 第二位審核者：cons-001、005、009、018、019 需要雙審，是 M5 的主要卡點。
- 「訴諸傳統」卡需要另找來源。

## 近期日期
- **2026-10-11**：[ADR-0023](adr/0023-sustainability-and-contributor-value.md) 公開徵詢截止（Issue #38）。
- **2026-10-31**：ADR-0035 Review Point（handoff 是否維持 60 行內、接手是否順利；目前沒有自動檢查行數）。
- **約 2026-12-29**：[ADR-0030](adr/0030-psychology-open-review.md) Review Point。
- **2027-03**：第一次角色檢視。

## 下一步
1. Decision Owner 決定 ADR-0036，之後依其第 12 點分三個 PR 實作（schema → 頁面 → 1 則試行草稿）。發布要等第二位審核者。
2. 爭點地圖、綜合挑戰、鋼人練習都在等試讀者回饋（各 ADR 的 Review Point）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
