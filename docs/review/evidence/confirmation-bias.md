# 證據判定紀錄：確認偏誤（`confirmation-bias`）

- 卡別：bias
- 證據強度：robust（2026-09-27 由 @Wang-Yi-Zhang 決定，PR #27；本紀錄為事後補記）
- 開放檢視：待決策者確認（本卡在 ADR-0021 前發布，未列入 ADR-0030 開放檢視清單）
- 最近判定：尚未依 ADR-0038 由人工判定；本紀錄由 AI 起草（2026-09-29），供審核者核對

## 來源

| 來源 | 類型 | 研究團隊 | 支持範圍 | 已核對原文 |
|---|---|---|---|---|
| Nickerson (1998). Confirmation bias: A ubiquitous phenomenon in many guises. *Review of General Psychology*, 2(2), 175–220. | 敘述性回顧（非系統性回顧、非後設分析） | Nickerson | 確認偏誤的定義與多種表現；卡上現有唯一來源 | 否 |
| Hart, Albarracín, Eagly, Brechan, Lindberg & Merrill (2009). Feeling validated versus being correct: A meta-analysis of selective exposure to information. *Psychological Bulletin*, 135(4), 555–588. https://doi.org/10.1037/a0015701 | 後設分析 | Hart、Albarracín 等 | 選擇性接觸：偏好支持自己立場的資訊，整體 d ≈ 0.36；受防衛與正確性動機調節；資訊與當前目標相關時，會出現偏好反面資訊的情形。**卡上尚未引用** | 否（依搜尋摘要） |
| Ditto, Liu, Clark, Wojcik, Chen, Grady, Celniker & Zinger (2019). At least bias is bipartisan. *Perspectives on Psychological Science*, 14(2), 273–291. https://doi.org/10.1177/1745691617746796 | 後設分析 | Ditto 等 | 51 項實驗、逾 18,000 人：同樣的資訊支持自己政治立場時評價較高（評估面的確認偏誤／我方偏誤）。**卡上尚未引用** | 否（依搜尋摘要） |

## 反證搜尋

| 日期 | 查詢詞 | 資料庫或工具 | 結果 |
|---|---|---|---|
| 2026-09-29 | confirmation bias selective exposure meta-analysis | 網頁搜尋、Crossref | 找到 Hart 等（2009）後設分析，支持效果存在，但有調節變項與反向情形 |
| 2026-09-29 | myside bias meta-analysis; positive test strategy Klayman Ha confirmation bias critique | 網頁搜尋、Crossref | 找到 Ditto 等（2019）後設分析，以及 Baron 與 Jost（2019）對其的批評（未查原文）。Klayman 與 Ha（1987, *Psychological Review*, 94(2), 211–228, https://doi.org/10.1037/0033-295X.94.2.211）主張「正向檢驗策略」多數情況是合理的，不一定是偏誤 |

沒有找到「確認偏誤整體重複驗證失敗」的研究。找到的反方意見是**概念上的**：確認偏誤是涵蓋多種現象的統稱，其中「正向檢驗」本身不一定是錯。

## 未能查核的範圍

- 兩份後設分析與 Nickerson（1998）都未讀全文，只依摘要與搜尋結果。
- 未查 Wason 選擇作業與確認偏誤的關係（有文獻以「匹配偏誤」解釋該作業的表現）；卡上以 Wason 作業為例，待人工核對。
- 只查英文文獻。

## 判定理由

AI 建議：**維持 robust，但需補來源**。依 ADR-0038 門檻，`robust` 需要後設分析或系統性回顧；卡上目前唯一的來源是敘述性回顧，單靠它不足以支持 `robust`。Hart 等（2009）與 Ditto 等（2019）兩份不同團隊的後設分析分別支持「選擇性接觸」與「評估不對等」兩種表現，補進 `sources` 後可支持 `robust`。

## 剩下的不確定

- 補來源屬 ADR-0025「補充」，需人工核對原文後修訂卡片並寫修訂說明。
- 「確認偏誤」是統稱，不同表現的證據強度不同；卡的定義涵蓋「注意、相信、忽略」，是否需要說明範圍，由審核者判斷。
- 卡上「何時是合理捷思」已提到充分證據下不需一遇反例就推翻，與 Klayman 與 Ha 的觀點一致；是否要引用，由審核者判斷。

## 修訂歷程

- 2026-09-29：AI 起草補記（ADR-0038 過渡），尚待人工判定。
