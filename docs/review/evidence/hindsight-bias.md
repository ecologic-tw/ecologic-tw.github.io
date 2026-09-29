# 證據判定紀錄：後見之明偏誤（`hindsight-bias`）

- 卡別：bias
- 證據強度：robust（AI 暫定，卡上已標示；2026-09-28 以開放檢視發布，ADR-0030）
- 開放檢視：是
- 最近判定：尚未依 ADR-0038 由人工判定；本紀錄由 AI 起草（2026-09-29），供審核者核對

## 來源

| 來源 | 類型 | 研究團隊 | 支持範圍 | 已核對原文 |
|---|---|---|---|---|
| Fischhoff (1975). *JEP: HPP*, 1(3), 288–299. https://doi.org/10.1037/0096-1523.1.3.288 | 原始研究 | Fischhoff | 得知結果會影響對事前可預測性的判斷 | 否 |
| Guilbault, Bryant, Brockway & Posavac (2004). *Basic and Applied Social Psychology*, 26(2–3), 103–117. https://doi.org/10.1080/01973533.2004.9646399 | 後設分析 | Guilbault 等 | 95 項研究、252 個效果量，整體約 .39；減少偏誤的操弄沒有顯著降低效果 | 否 |
| Roese & Vohs (2012). *Perspectives on Psychological Science*, 7(5), 411–426. https://doi.org/10.1177/1745691612454303 | 回顧 | Roese、Vohs | 後見之明偏誤的組成；考慮其他可能的解釋有助於減少偏誤 | 否 |
| Christensen-Szalanski & Willham (1991). The hindsight bias: A meta-analysis. *OBHDP*, 48(1), 147–168. https://doi.org/10.1016/0749-5978(91)90010-Q | 後設分析 | Christensen-Szalanski、Willham | 122 項研究，效果小（d ≈ 0.35）；對任務越熟悉，偏誤越小（依搜尋摘要）。**卡上尚未引用** | 否 |
| Chen, Kwan, Ma 等 (2021). Retrospective and prospective hindsight bias: Replications and extensions of Fischhoff (1975) and Slovic and Fischhoff (1977). *Journal of Experimental Social Psychology*, 96, 104154. https://doi.org/10.1016/j.jesp.2021.104154 | 大樣本直接複製研究 | Chen 等（與原研究者不同團隊） | 複製 Fischhoff（1975）實驗 2（N = 890，d ≈ 0.60）與 Slovic 與 Fischhoff（1977）（N = 608，d ≈ 0.40），都支持效果（依搜尋摘要）。**卡上尚未引用** | 否 |

## 反證搜尋

| 日期 | 查詢詞 | 資料庫或工具 | 結果 |
|---|---|---|---|
| 2026-09-29 | hindsight bias replication Fischhoff 1975 registered replication | 網頁搜尋、Crossref | 找到 Chen 等（2021）成功複製；也找到一份巴西樣本的預先登記直接複製（Seda、Fatori、Batistuzzo 等，OSF 預印本，https://doi.org/10.31219/osf.io/x394e_v4），探索性分析的效果很小（d ≈ 0.12），作者認為原實驗的可複製性低 |
| 2026-09-29 | Christensen-Szalanski Willham 1991 hindsight bias meta-analysis effect size | 網頁搜尋、Crossref | 找到較早的後設分析，支持效果存在但偏小 |

## 未能查核的範圍

- 以上研究都未讀全文。
- 巴西複製研究是預印本（Crossref 類型為 posted-content），未查到正式發表版本；樣本 431 人，結果屬探索性分析。
- 只查英文文獻。

## 判定理由

AI 建議：**維持 robust**。有兩份不同團隊的後設分析（1991、2004）與一份大樣本直接複製研究（2021）支持。巴西預印本的效果小，但尚未經同儕審查，也只是單一樣本，目前不構成「已知的重大複製失敗」。

## 剩下的不確定

- 巴西預印本若正式發表且結論不變，應重新評估，並在本文提及。
- 補充 Christensen-Szalanski 與 Willham（1991）、Chen 等（2021）為來源屬「補充」，可在人工判定時一併決定。
- 卡上「待心理學背景的審核者判定」的措辭，在 ADR-0038 後可改為說明證據判定依據（見本紀錄），由人工決定。

## 修訂歷程

- 2026-09-29：AI 起草補記（ADR-0038 過渡），尚待人工判定。
