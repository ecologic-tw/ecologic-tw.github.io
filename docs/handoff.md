# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-09-29，Claude（Cowork）

## 目前工作區
兩個分支自 `main`（`2d16cdd`，含 PR #88 ADR-0036）建立，已在本機提交、**尚未推送**，彼此獨立：
- **`fix/about-privacy-and-font-license`**：關於頁隱私說明改為「網站本身不蒐集」，補上表單暱稱、GitHub 公開內容、GitHub Pages 記錄 IP 三件事；補霞鶩文楷的 SIL OFL 授權全文（`/licenses/`）；`updates.yaml` 公告；`docs/feedback/google-form-design.md` 加個資法第 8 條的「列名告知」文字。驗證：lint、276 個單元測試、build（88 個 HTML）、相關 e2e 17 個通過。
- **`feat/response-toolbox`**（本檔所在）：[ADR-0037](adr/0037-response-toolbox.md)（提議）與第一階段實作草稿：「我的圖鑑」新增「我的應對工具箱」（可列印）、進度文字改為「試過」、答錯時補一句「每一次嘗試都算數」。驗證：lint、check、278 個單元測試、build、116 個 e2e（含 axe）通過。
- 驗證在另一份工作副本以 Node 22 執行，以 PR 的 CI 為準。
- **未追蹤**：`Claude outputs/`（過時草稿，可刪）。

## 待人工決定
- 是否接受 [ADR-0037](adr/0037-response-toolbox.md)；接受前不要合併 `feat/response-toolbox`。
- 回饋表單 Q17 說明欄貼上「列名告知」（見 `docs/feedback/google-form-design.md`），需在 Google 表單後台操作。
- ADR-0036 試行案例的主題（日常或保育），在第 3 階段草稿 PR 前決定。日常案例若不屬爭議議題可單審發布；保育案例要等第二位審核者。
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
1. 推送兩個分支並開 PR；ADR-0037 接受後才合併工具箱。
2. ADR-0036（已合併）依其第 12 點分三個 PR 實作：schema → 頁面 → 1 則試行草稿。
3. 爭點地圖、綜合挑戰、鋼人練習都在等試讀者回饋（各 ADR 的 Review Point）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
