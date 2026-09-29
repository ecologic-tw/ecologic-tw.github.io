# 證據判定紀錄：可得性捷思（`availability-heuristic`）

- 卡別：bias
- 證據強度：moderate（2026-09-27 由 @Wang-Yi-Zhang 決定，PR #27；本紀錄為事後補記）
- 開放檢視：待決策者確認（本卡在 ADR-0021 前發布，未列入 ADR-0030 開放檢視清單）
- 最近判定：尚未依 ADR-0038 由人工判定；本紀錄由 AI 起草（2026-09-29），供審核者核對

## 來源

| 來源 | 類型 | 研究團隊 | 支持範圍 | 已核對原文 |
|---|---|---|---|---|
| Tversky & Kahneman (1973). Availability: A heuristic for judging frequency and probability. *Cognitive Psychology*, 5, 207–232. https://doi.org/10.1016/0010-0285(73)90033-9 | 原始研究 | Tversky、Kahneman | 可得性捷思的提出與原始實驗；卡上現有唯一來源 | 否（DOI 原文曾回應 403，見 p0-p1 檢查清單） |
| Weingarten & Hutchinson (2018). Does ease mediate the ease-of-retrieval effect? A meta-analysis. *Psychological Bulletin*, 144(3), 227–283. https://doi.org/10.1037/bul0000122 | 後設分析 | Weingarten、Hutchinson | 「提取容易度」效果：校正發表偏誤後仍約 d ≈ 0.4（依搜尋摘要）。**卡上尚未引用** | 否 |

## 反證搜尋

| 日期 | 查詢詞 | 資料庫或工具 | 結果 |
|---|---|---|---|
| 2026-09-29 | availability heuristic replication failed Tversky Kahneman 1973 letter k Sedlmeier | 網頁搜尋、Crossref | **找到反證**：Sedlmeier、Hertwig 與 Gigerenzer（1998, *JEP: LMC*, 24(3), 754–770, https://doi.org/10.1037/0278-7393.24.3.754）指出經典的「字母 K 位置」實驗沒有成功的重複驗證，受試者的判斷大致反映實際字母頻率 |
| 2026-09-29 | ease of retrieval effect meta-analysis Weingarten Hutchinson 2018 Schwarz 1991 replication | 網頁搜尋、Crossref | **找到反證**：Groncki、Beaudry 與 Sauer（2021, *Memory*, 29(2), 234–254, https://doi.org/10.1080/09658211.2021.1882502）是 Schwarz 等（1991）的第一個預先登記直接複製研究（N = 661），沒有複製成功；另有 Yeager 等（2019）的大樣本複製也失敗（書目待查證） |

## 未能查核的範圍

- 以上研究都未讀全文，只依摘要、Crossref 書目與搜尋結果（含 Replicability-Index 部落格的整理）。
- Yeager 等（2019）的完整書目未查到。
- 未查媒體報導與風險知覺的研究（例如 Lichtenstein 等，1978），這類研究與卡上的新聞例子最相關，待查證。

## 判定理由

AI 建議：**依 ADR-0038 門檻字面，應考慮改為 `contested`，需人工判定**。

- 支持：Weingarten 與 Hutchinson（2018）後設分析支持提取容易度效果。
- 反對：兩個經典範式（字母位置、Schwarz 等 1991 的自信程度）都有失敗的重複驗證，其中包含預先登記的直接複製。
- 12 §5 規則 1：`contested` 指「有失敗的複製研究，或後設分析之間結論矛盾」。本卡同時有後設分析支持與直接複製失敗，符合字面條件。
- 另一種解讀：卡上的主張較寬（「用容易想起的程度判斷發生頻率」），失敗的是特定實驗範式，不等於整個概念被推翻；若採此解讀，可維持 `moderate`，但本文應補充說明經典實驗的複製困難。

## 剩下的不確定

- 改為 `contested` 屬證據強度改變，依 ADR-0025 至少屬「補充」，需寫修訂說明，並在本文正反證據並陳。
- 維持 `moderate` 也需補充經典實驗的複製困難，否則卡上語氣比證據強。

## 修訂歷程

- 2026-09-29：AI 起草補記（ADR-0038 過渡），尚待人工判定。
