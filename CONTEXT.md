# CONTEXT.md — 專案用語（Ubiquitous Language）

程式、文件、Issue 一律使用下列用語；新增用語先更新本檔。

| 用語 | 英文識別字 | 定義 |
|---|---|---|
| 圖鑑卡 | `entry` | 一個邏輯概念的說明頁。種類見「卡別」。 |
| 卡別 | `kind` | `law` 思維定律／`inference` 有效推論／`formal-fallacy` 形式謬誤／`informal-fallacy` 非形式謬誤／`bias` 認知偏誤 |
| 情境題 | `scenario` | 一段虛構對話或陳述，讓使用者判讀其推理是否有問題。 |
| 主題 | `theme` | `daily` 日常生活／`conservation` 野生生物保育 |
| 對照題 | `control` | 推理其實沒問題的情境題（`isControl: true`），用來防止「看到什麼都說是謬誤」。 |
| 判讀 | `judgement` | 使用者對情境題的回答（選擇某圖鑑卡或「沒有問題」）。 |
| 解說 | `explanation` | 作答後顯示的說明，分基礎與進階兩層。 |
| 形式結構 | `form` | 進階模式顯示的符號化推理結構，如 `P→Q, Q ∴ P`。 |
| 更好的說法 | `betterPhrasing` | 參考改寫：保留原意但推理較健全的說法。 |
| 改寫練習 | `rewrite` | 使用者自行改寫，對照檢核清單自評；不上傳。 |
| 檢核清單 | `checklist` | 改寫自評的 3–4 個檢核點。 |
| 何時不算謬誤 | `notFallacyWhen` | 圖鑑卡必填：該模式在什麼條件下是合理推理。 |
| 善意回應法 | `charitableResponse` | 圖鑑卡必填：遇到對方這樣說時，如何不貼標籤地回應。 |
| 名詞 | `term` | 名詞解釋表中的一條。 |
| 模式 | `mode` | `basic` 基礎／`advanced` 進階。 |
| 收集 | `collected` | 使用者至少答對一題與該卡相關的情境題後，該卡在個人圖鑑中「點亮」。 |
| 徽章 | `badge` | 成就標記，只依學習里程碑發放，不依時間或頻率。 |
| 內容狀態 | `status` | `draft` 草稿（不發布）／`reviewed` 已審（發布）／`retired` 下架。 |
| 維護者 | maintainer | 具 repo 寫入權、可核准 PR 的人。 |
| 角色 | role | 承擔特定責任的位置，不是職位或地位；見 10-governance 角色名冊。 |
| Decision Owner | decision owner | 對某項決策負責推進、公開理由與追蹤結果的人；寫在 ADR 中。 |
| Review Point | review point | 預先約定重新檢視某決策或實驗的時間與依據。 |
| Learning Review | learning review | 出錯後理解問題如何形成、改善系統的檢討（不找戰犯）。 |
| 角色檢視 | role review | 每半年公開檢視角色與權力分配，防止隱形主管。 |
| 紅線 | red line | `CLAUDE.md` 所列不可違反的規則；修改屬社群基本規則。 |
