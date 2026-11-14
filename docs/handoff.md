# 目前狀態（交接）

> 只寫**現在**的狀態，交接時覆寫，不追加歷史（[ADR-0035](adr/0035-handoff-current-state-only.md)）。每次任務的完整紀錄在各 PR 說明的「交接」段；進度以 [里程碑](sdd/11-milestones.md) 為準。
> 本檔內容不代表工作區已驗證；接手時先核對 `git status` 與 `git log`。

- **最後更新**：2026-11-14，Claude（Claude Code）

## 目前工作區
- **`docs/accept-adr-0023`**（自 `main` `783b1b4` 建立）：決策者接受 [ADR-0023](adr/0023-sustainability-and-contributor-value.md)，Issue #38 已關閉；ADR-0026 中「不代表接受該提案」的說法同步更新。
- 已合併：#114（astro 7.4.7，`satteri` 升到 0.11.7）、#115（交接與文件整理）。Dependabot alert #6 隨 #114 修補。

## 待人工決定
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
1. 審閱並合併本 PR；決定 ADR-0035 回顧結論。
2. 依 ADR-0023「後果」排定貢獻者頁面、合作指南、PR 模板利益揭露欄位與角色名冊的實作順序（各自另開 PR）。
3. 以 `npm run dev` 檢視兩則思想源流草稿，人工核對原典後審核發布。
4. 決定確認偏誤是否補來源，並人工核對證據判定紀錄的原文。
5. 多方觀點、應對工具箱、爭點地圖、綜合挑戰、鋼人練習、閱讀筆記都在等試讀者回饋（各 ADR 的回顧點；招募見 Issue #62）。

## 參考
- 2026-09-29 以前的完整交接歷史：`git show 2205dba:docs/handoff.md`（或 `git log -p -- docs/handoff.md`）
- 進度：[11 里程碑](sdd/11-milestones.md)；互動擴充規劃：[SDD 13](sdd/13-interaction-roadmap.md)
