# 證據判定紀錄：倖存者偏誤（`survivorship-bias`）

- 卡別：bias
- 證據強度：robust（2026-09-27 由 @Wang-Yi-Zhang 決定，PR #27；本紀錄為事後補記）
- 開放檢視：待決策者確認（本卡在 ADR-0021 前發布，未列入 ADR-0030 開放檢視清單）
- 最近判定：尚未依 ADR-0038 由人工判定；本紀錄由 AI 起草（2026-09-29），供審核者核對

## 來源

| 來源 | 類型 | 研究團隊 | 支持範圍 | 已核對原文 |
|---|---|---|---|---|
| Mangel & Samaniego (1984). Abraham Wald's work on aircraft survivability. *Journal of the American Statistical Association*, 79(386), 259–267. | 統計學史與方法論文（非心理學實證研究） | Mangel、Samaniego | Wald 的飛機存活分析：只看返航飛機會得出錯誤結論；支持「推理錯誤本身」成立 | 否 |

## 反證搜尋

| 日期 | 查詢詞 | 資料庫或工具 | 結果 |
|---|---|---|---|
| 2026-09-29 | survivorship bias psychology experiment people neglect missing failures selection bias study | 網頁搜尋 | 大多是統計學或科普說明，沒有找到針對「人們多常犯倖存者偏誤」的後設分析，也沒有找到反證 |
| 2026-09-29 | selection neglect metacognitive myopia Fiedler sampling bias judgment | 網頁搜尋、Crossref | 找到 Fiedler、Prager 與 McCaughey（2023, *Current Directions in Psychological Science*, 32(1), 49–56, https://doi.org/10.1177/09637214221126906）等「後設認知近視」研究：人們不太會修正樣本選擇造成的偏差。相關，但不是專門針對倖存者偏誤 |

## 未能查核的範圍

- 未讀 Mangel 與 Samaniego（1984）全文。
- 未系統搜尋「選擇偏誤忽略」的實驗文獻；Fiedler 系列研究只看了摘要。

## 判定理由

AI 認為 **ADR-0038 的門檻不太適用本卡，需決策者決定**：

- 倖存者偏誤首先是**統計上的推理錯誤**：只看通過篩選的樣本，對全體下結論，錯誤在邏輯與數學上成立，不需要實驗證明。這一點可以視為 `robust`。
- 但 `evidence` 欄位原本的意思（ADR-0021）是「這個心理傾向的實證強度」。若問「人們是否常犯這個錯」，目前沒找到專門的後設分析，依 ADR-0038 門檻最多只能判到 `moderate`，甚至可能未達。

可行做法（供決策者選擇）：
1. 在 ADR-0038 或 12 §5 補一句：以統計或邏輯錯誤為主的偏誤卡，`robust` 指「錯誤本身成立」，並在卡上說明。
2. 依心理實證判定，改為 `moderate` 或更低，並補充 Fiedler 等研究。
3. 將本卡改列非形式謬誤或概念卡，不用 `evidence`（改動較大）。

## 剩下的不確定

- 上述三個做法都需要人工決定；第 2、3 項會改動已審內容，依 ADR-0025 處理。

## 修訂歷程

- 2026-09-29：AI 起草補記（ADR-0038 過渡），尚待人工判定。
