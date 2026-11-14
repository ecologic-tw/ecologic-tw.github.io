# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-11-14，Claude（Claude Code）

## 目前工作區
- **`chore/handoff-cleanup`**（自 `main` `5cfcba9` 建立）：更新本檔、兩份 2026-09-27 審查文件標註「歷史」、修正審核指南已過時的「本次修訂仍是 AI 草稿」，並補粗體檢查的單元測試。
- **PR #114**（astro 7.4.4 → 7.4.7）：astro 7.4.7 釘住 `@astrojs/markdown-satteri` 0.4.7，它改依賴 `satteri` ^0.11.6；我們的 `satteri` 0.10.5 因此出現兩份，`astro check` 報 hast 外掛型別錯誤。已在該分支加一個 commit，把 `satteri` 升到 0.11.7（回到同一份，[ADR-0013](adr/0013-m1-markdown-e2e-and-dev-csp.md)）。本機 lint、check、單元測試、e2e 132 項全過，建置產物與 `main` 逐檔相同。分支上有非 Dependabot 的 commit，Dependabot 之後不會自動 rebase，衝突時請關掉重開。
- 已合併：#112、#113（`@types/node` 24.19.2）。#111（`@types/node` 26）已關閉。

## 待人工決定
- **合併 PR #114**：合併後 Dependabot alert #6（astro，中風險）會關閉。該漏洞在 `@astrojs/node` 的圖片端點；本站是純靜態、依賴樹中沒有 `@astrojs/node`，實際不受影響。
- **ADR-0023**：Issue #38 公開徵詢已於 2026-10-11 截止，沒有留言；ADR 仍為提議，待決策者決定是否接受並關閉 Issue。
- **ADR-0035 回顧點（2026-10-31 已過）**：本檔又落後約 12 天（#112 合併後「目前工作區」未更新）。是否要在合併時順手更新，待決策者回顧。
- 思想源流兩則草稿：引文與翻譯需人工核對原典（[核對紀錄](review/origins/README.md)中標「待查證」的項目），莊子一則的「文字遊戲」讀法尚缺學術出處。核對後才能審核發布（發布時補 `updates.yaml` 與開放檢視公告）。
- 粗體檢查漏網（PR #101 回報）：在 Markdown 層重現不出來。`「**……。**」` 在 Sätteri 0.10／0.11 都會轉成粗體，`**「……」**` 這種真正不會變粗體的寫法，`npm run check` 也會報錯（見 `tests/unit/emphasis-check.test.ts`）。若當時是在畫面上看到不粗，可能是字型或樣式問題，需要當時的頁面與原文才能再查。
- 確認偏誤建議補 Hart 等（2009）、Ditto 等（2019）後設分析為來源。7 份證據判定紀錄的原文仍待人工核對。
- 已發布卡上「待心理學背景的審核者判定」等文字（`hindsight-bias`、`framing-effect`、`nonviolent-communication`）措辭偏向以身分把關；人工判定紀錄時一併決定是否修訂。
- 回饋表單 Q17 說明欄貼上「列名告知」（見 `docs/feedback/google-form-design.md`），需在 Google 表單後台操作。
- [ADR-0026](adr/0026-first-contribution-pilot.md) 的試行安排（仍是提議，還沒有真人試走）。
- 第二位審核者：cons-001、005、009、018、019 需要雙審，是 M5 的主要卡點（Issue #62）。
- 「訴諸傳統」卡需要另找來源。

## 近期日期
- **約 2026-12-29**：[ADR-0030](adr/0030-psychology-open-review.md)、[ADR-0038](adr/0038-evidence-based-review.md) 回顧點。
- **2027-01**：實驗 #36 檢討，也是 ADR-0023 回顧點。
- **2027-03**：第一次角色檢視。

## 下一步
1. 審閱並合併 #114 與本 PR；決定 ADR-0023 是否接受、ADR-0035 回顧結論。
2. 以 `npm run dev` 檢視兩則思想源流草稿，人工核對原典後審核發布。
3. 決定確認偏誤是否補來源，並人工核對證據判定紀錄的原文。
4. 多方觀點、應對工具箱、爭點地圖、綜合挑戰、鋼人練習、閱讀筆記都在等試讀者回饋（各 ADR 的回顧點；招募見 Issue #62）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
