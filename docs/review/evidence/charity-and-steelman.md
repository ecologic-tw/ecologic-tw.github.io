# 證據判定紀錄：善意詮釋與鋼人論證（`charity-and-steelman`）

- 卡別：concept
- 證據強度：不適用（概念卡不加 `evidence`）
- 開放檢視：是（2026-09-28 發布，ADR-0030）
- 最近判定：尚未依 ADR-0038 由人工判定；本紀錄由 AI 起草（2026-09-29），供審核者核對

## 來源

| 來源 | 類型 | 研究團隊 | 支持範圍 | 已核對原文 |
|---|---|---|---|---|
| Dennett (2013). *Intuition Pumps and Other Tools for Thinking*. W. W. Norton. | 哲學著作（規範性建議，非實證研究） | Dennett | Rapoport 規則：先重述對方立場到對方滿意，再批評 | 否 |
| Eyal, Steffel & Epley (2018). Perspective mistaking. *Journal of Personality and Social Psychology*, 114(4), 547–571. | 實證研究（同一團隊的 25 個實驗） | Eyal、Steffel、Epley | 在其實驗情境中，想像對方觀點沒有提高理解準確度，直接詢問（perspective-getting）才有幫助；卡上引用 | 否（卡上已標「適用範圍待人工核對原文」） |

## 反證搜尋

| 日期 | 查詢詞 | 資料庫或工具 | 結果 |
|---|---|---|---|
| 2026-09-29 | "perspective mistaking" Eyal Steffel Epley replication perspective-getting | 網頁搜尋 | 沒有找到其他團隊的直接複製研究；找到的多是原論文與媒體報導 |
| 2026-09-29 | perspective taking interpersonal accuracy replication OR meta-analysis "perspective-getting" | 網頁搜尋 | 找到 2025 年 *Annual Review of Psychology* 一篇關於想法與感受準確度的整合回顧（未讀），以及後設準確度的系統性回顧；沒有找到直接推翻 Eyal 等結論的研究 |

## 未能查核的範圍

- Eyal 等（2018）與上述回顧都未讀全文。
- 未查其他團隊是否以不同作業驗證「想像觀點」與「直接詢問」的差異。

## 判定理由

AI 建議：**維持現狀**。卡的主要內容（善意詮釋、鋼人論證）是討論規範，不是實證主張，不需證據強度。唯一的實證主張來自 Eyal 等（2018）：25 個實驗，但都出自同一團隊，沒有找到獨立複製。若這是偏誤卡，依 ADR-0038 會停在「未達 `moderate`」。卡上已寫「在其實驗情境中」並標示適用範圍待核對，語氣與證據相符。

## 剩下的不確定

- 若之後把「直接詢問比想像更準確」寫成一般原則（例如移除「在其實驗情境中」），需要先找到獨立團隊的證據。
- 核對原文時，確認 25 個實驗中哪些屬「陌生人判斷」、哪些屬「親近關係」，以及卡上的鋼人論證例子是否落在研究範圍內。

## 修訂歷程

- 2026-09-29：AI 起草補記（ADR-0038 過渡），尚待人工判定。
