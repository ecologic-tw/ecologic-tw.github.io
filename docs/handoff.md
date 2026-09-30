# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-09-30，Claude（Cowork）

## 目前工作區
- **`feat/origins-kant-zhuangzi`**（自 `main` `5db0c6e` 建立，本機已提交、尚未推送）：[ADR-0039](adr/0039-origins-of-ideas.md) 思想源流（提議）與實作：`origins` 集合、圖鑑卡頁預設收合的「思想源流」區塊、內容檢查與審核工具支援；試行 2 則草稿（康德〈答「何謂啟蒙？」之問〉、莊子〈秋水〉濠梁之辯）與[原典核對紀錄](review/origins/README.md)。驗證（Node 22）：lint、check、297 個單元測試、build（93 個 HTML）、132 個 e2e（含思想源流 4 個與 axe）通過。
- PR #100（三張偏誤卡依證據修訂）已合併。
- **未追蹤**：`Claude outputs/`（過時草稿，可刪）。

## 待人工決定
- 粗體檢查漏網：`「**……。**」`（句號在粗體內、後接引號）在網站上不會變粗體，但 `npm run check` 沒有報錯；思想源流已改寫法，檢查規則待補。
- 是否接受 [ADR-0039](adr/0039-origins-of-ideas.md)；兩則思想源流的引文與翻譯需人工核對原典（紀錄中標「待查證」的項目），莊子一則的「文字遊戲」讀法尚缺學術出處。
- 確認偏誤建議補 Hart 等（2009）、Ditto 等（2019）後設分析為來源。7 份證據判定紀錄的原文仍待人工核對。
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
1. 推送 `feat/origins-kant-zhuangzi` 並開 PR；ADR-0039 接受後，人工核對原典再審核發布。
2. 決定確認偏誤是否補來源，並人工核對證據判定紀錄的原文。
3. 多方觀點情境找試讀者，依 ADR-0036 回顧點檢視（讀者是否找得到入口、是否先讀角色卡、共同點與先問什麼的正解是否唯一）。
4. 應對工具箱依 ADR-0037 回顧點找試讀者回饋。
5. 爭點地圖、綜合挑戰、鋼人練習都在等試讀者回饋（各 ADR 的回顧點）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
