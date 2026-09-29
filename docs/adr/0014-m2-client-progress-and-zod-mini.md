# ADR-0014 M2：作答互動、提前實作 progress.ts 核心、前端改用 zod/mini
- 日期：2026-09-26
- 狀態：接受（2026-09-29，@Wang-Yi-Zhang）
- Decision Owner：@Wang-Yi-Zhang
- Review Point：M3 完成時（加入匯入匯出與徽章後），或單頁 JS 接近 50 KB gzip 時

## 背景
M2 的作答流程、模式切換與題目列表完成狀態（04）都需要讀寫本機進度，而 `progress.ts` 原本排在 M3（11）。另外，模式切換在每一頁都會載入進度模組，若用 Astro 內附的完整 zod，每頁多約 25 KB gzip。

## 決策
1. **提前實作 `progress.ts` 核心**：`load`／`save`／`update`、模式、作答紀錄、改寫次數。M3 再加入匯出／匯入／清除、徽章與收集。
   - 介面與 06 略有不同：以 `update(change)` 搭配純函式（`setMode`、`recordAnswer`、`addRewrite`）更新，方便單元測試。
   - 個別欄位損壞時只重設該欄位（`catch`），不會因一個欄位壞掉而清空全部進度。
2. **前端用 `zod/mini`**：在 `package.json` 宣告 `zod`，版本範圍與 Astro 相同（`^4.5.4`，實際去重為 4.6.5），**依賴樹中沒有新增套件**。內容 schema 仍用 `astro/zod`。
   - 會打包進前端的模組（`quiz.ts`、`progress.ts`）不可 import `content-schema.ts`，否則會把完整 zod 帶進瀏覽器。`NO_PROBLEM` 因此改定義在 `quiz.ts`。
3. **作答頁的漸進增強**：沒有 JavaScript 時選項隱藏，答案與解說收在「看答案與解說」`<details>`；有 JavaScript 時打亂選項、作答後才揭露解說與改寫練習。CSP `form-action 'none'` 也確保表單不會意外送出。
4. **情境題本文分段轉換**：作答頁需要把「情境」與「解說」放在不同位置，因此在建置時依 `## 情境`／`## 解說`／`## 進階解說` 切段，各自用與全站相同的 Sätteri 外掛轉成 HTML（`src/lib/scenario-sections.ts`）。

## 依據的資訊與假設
- 實測（含草稿建置）：作答頁 JS 合計約 9 KB gzip（`progress` 6.9 KB、作答腳本 0.9 KB，其餘各 < 1 KB），遠低於 NFR-05 的 50 KB。改用 zod/mini 前約 28 KB。
- 假設 1：模式在頁面載入後才由 JavaScript 套用；基礎模式下，進階內容可能短暫閃現後隱藏。進階內容多收在 `<details>` 或列表項目中，影響有限。

## 已知風險
- 風險 1：`zod` 被 Dependabot 單獨升級，與 Astro 內附版本分歧 → `npm ls zod` 會顯示兩個版本；若發生，將範圍改回與 Astro 一致。
- 風險 2：有人在前端模組 import `content-schema.ts`，JS 體積暴增 → 建置後可檢查 `dist/_astro/*.js` 大小；M5 Lighthouse 也會反映。
- 風險 3：分段轉換使用 `set:html` 插入建置期產生的 HTML。內容來源只有 repo 內經 `check-content` 檢查（禁止原生 HTML）的 Markdown，不含使用者輸入。

## 考慮過的選項（含不同意見）
- **progress 讀取不用 zod、自行檢查欄位**：前端最小，但與 M3 匯入時的 zod schema 會有兩套規則，容易不一致。
- **維持完整 zod**：每頁多約 20 KB，仍在 50 KB 預算內，但沒有必要。
- **模式切換改用 cookie 或網址參數**：cookie 違反紅線 2；網址參數讓分享的連結帶有個人偏好。

## 後果
- M3 只需在 `progress.ts` 上擴充，不必改動 M2 的作答流程。
- 作答紀錄與改寫次數從 M2 起就會累積在使用者的瀏覽器，M3 的徽章可以直接使用。
