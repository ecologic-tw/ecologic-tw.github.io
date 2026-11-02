# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-11-02，Claude（Claude Code）

## 目前工作區
- **`chore/types-node-24-and-handoff`**（自 `main` `35c4642` 建立）：Dependabot 不再提 `@types/node` 主版號升級（型別須與 `engines` 的 Node 24 一致），並更新本檔。
- 已合併：PR #101（思想源流程式與 2 則草稿，[ADR-0039](adr/0039-origins-of-ideas.md)）、#106、#107、#108、#109、#110。#110 原本的 `satteri` 0.11 與 `@astrojs/markdown-satteri` 不相容，已改回 0.10.5，Dependabot 不再單獨升 satteri 的 minor/major（[ADR-0013](adr/0013-m1-markdown-e2e-and-dev-csp.md)）。
- 本機 e2e 需先 `npx playwright install chromium`（#107 升級了 Playwright）；#110 的 e2e 只在 CI 跑過並通過。

## 待人工決定
- **PR #111**（`@types/node` 24 → 26）：建議關閉；改用 Node 26 時再一起升 `engines`、`.nvmrc`、CI 與型別。
- **Dependabot alert #5**（minimatch DoS，中風險）：只在開發工具 eslint、typescript-eslint 內，eslint 10.13 限定 minimatch 10.x，自動修補失敗。建議等 eslint 升級，或在 GitHub 以「風險可接受」關閉並寫明理由。
- **ADR-0023**：Issue #38 公開徵詢已於 2026-10-11 截止，沒有留言；ADR 仍為提議，待決策者決定是否接受並關閉 Issue。
- **ADR-0035 回顧點（2026-10-31 已過）**：本檔維持在 60 行內；這次接手可靠本檔、里程碑與 PR 重現進度。觀察到的問題：PR #101 合併後本檔未更新，「PR 待審」的狀態停留約 10 天。是否要在合併時順手更新，待決策者回顧。
- 思想源流兩則草稿：引文與翻譯需人工核對原典（[核對紀錄](review/origins/README.md)中標「待查證」的項目），莊子一則的「文字遊戲」讀法尚缺學術出處。核對後才能審核發布（發布時補 `updates.yaml` 與開放檢視公告）。
- 粗體檢查漏網：`「**……。**」`（句號在粗體內、後接引號）在網站上不會變粗體，但 `npm run check` 沒有報錯；檢查規則待補。
- 確認偏誤建議補 Hart 等（2009）、Ditto 等（2019）後設分析為來源。7 份證據判定紀錄的原文仍待人工核對。
- 已發布卡上「待心理學背景的審核者判定」等文字（`hindsight-bias`、`framing-effect`、`nonviolent-communication`）措辭偏向以身分把關；人工判定紀錄時一併決定是否修訂。
- 回饋表單 Q17 說明欄貼上「列名告知」（見 `docs/feedback/google-form-design.md`），需在 Google 表單後台操作。
- `docs/review/p0-p1-checklist.md`：2026-09-27 那一輪的一次性清單，仍有 14 項未勾。建議在開頭標註「歷史清單」，並刪掉 `review-guide.md` 第 149 行已過時的「本次修訂仍是 AI 草稿」。
- `docs/review/2026-09-27-architecture-audit.md`：當時的審查快照，ADR-0025 有引用。建議保留，只在開頭標註「歷史快照」。
- [ADR-0026](adr/0026-first-contribution-pilot.md) 的試行安排（仍是提議，還沒有真人試走）。
- 第二位審核者：cons-001、005、009、018、019 需要雙審，是 M5 的主要卡點（Issue #62）。
- 「訴諸傳統」卡需要另找來源。

## 近期日期
- **約 2026-12-29**：[ADR-0030](adr/0030-psychology-open-review.md) 回顧點。
- **2027-01**：實驗 #36 檢討，也是 ADR-0023 回顧點。
- **2027-03**：第一次角色檢視。

## 下一步
1. 決定 #111 與 minimatch 警示；ADR-0023 是否接受、ADR-0035 回顧結論。
2. 以 `npm run dev` 檢視兩則思想源流草稿，人工核對原典後審核發布。
3. 決定確認偏誤是否補來源，並人工核對證據判定紀錄的原文。
4. 多方觀點情境找試讀者，依 ADR-0036 回顧點檢視（讀者是否找得到入口、是否先讀角色卡、共同點與先問什麼的正解是否唯一）。
5. 應對工具箱依 ADR-0037 回顧點找試讀者回饋；爭點地圖、綜合挑戰、鋼人練習也在等試讀者回饋（各 ADR 的回顧點）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
