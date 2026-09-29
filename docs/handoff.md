# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-09-29，Claude（Claude Code）

## 目前工作區
- **`content/evidence-revisions`**（自 `main` `9c00938` 建立，待審）：依決策者 2026-09-30 的決定修訂三張已審卡——可得性捷思補「進階」說明經典實驗的複製困難與三則來源（維持 moderate）；倖存者偏誤說明 `robust` 指錯誤本身成立（12 §5 規則 1、ADR-0038 補充）；框架效應小檢核改為風險選擇框架。`updates.yaml` 三則修訂說明，證據判定紀錄同步。
- PR #99（證據判定紀錄）已合併。
- **未追蹤**：`Claude outputs/`（過時草稿，可刪）。

## 待人工決定
- 框架效應本文的生活例子（優格「95% 無脂」）與保育例子（保留七成／失去三成棲地）也屬屬性框架，超出證據範圍；要改例子或補屬性框架來源，待決策者決定。確認偏誤建議補 Hart 等（2009）、Ditto 等（2019）後設分析為來源。7 份證據判定紀錄的原文仍待人工核對。
- 已發布卡上「待心理學背景的審核者判定」等文字（`hindsight-bias`、`framing-effect`、`nonviolent-communication`）措辭偏向以身分把關；人工判定紀錄時一併決定是否修訂。
- 回饋表單 Q17 說明欄貼上「列名告知」（見 `docs/feedback/google-form-design.md`），需在 Google 表單後台操作。
- `docs/review/p0-p1-checklist.md`：2026-09-27 那一輪的一次性清單，仍有 14 項未勾。建議在開頭標註「歷史清單」，並刪掉 `review-guide.md` 第 134 行已過時的「本次修訂仍是 AI 草稿」。
- `docs/review/2026-09-27-architecture-audit.md`：當時的審查快照，ADR-0025 有引用。建議保留，只在開頭標註「歷史快照」。
- [ADR-0026](adr/0026-first-contribution-pilot.md) 的試行安排（仍是提議，還沒有真人試走）。
- 第二位審核者：cons-001、005、009、018、019 需要雙審，是 M5 的主要卡點。
- 「訴諸傳統」卡需要另找來源。

## 近期日期
- **2026-10-11**：[ADR-0023](adr/0023-sustainability-and-contributor-value.md) 公開徵詢截止（Issue #38）。
- **2026-10-31**：ADR-0035 回顧點（handoff 是否維持 60 行內、接手是否順利；目前沒有自動檢查行數）。
- **約 2026-12-29**：[ADR-0030](adr/0030-psychology-open-review.md) 回顧點。
- **2027-03**：第一次角色檢視。

## 下一步
1. 審閱並合併 `content/evidence-revisions`；之後決定框架效應本文例子與確認偏誤補來源，並人工核對證據判定紀錄的原文。
2. 多方觀點情境找試讀者，依 ADR-0036 回顧點檢視（讀者是否找得到入口、是否先讀角色卡、共同點與先問什麼的正解是否唯一）。
3. 應對工具箱依 ADR-0037 回顧點找試讀者回饋。
4. 爭點地圖、綜合挑戰、鋼人練習都在等試讀者回饋（各 ADR 的回顧點）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
