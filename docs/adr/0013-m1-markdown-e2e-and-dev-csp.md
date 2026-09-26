# ADR-0013 M1：Markdown 轉換改用 Sätteri 外掛、e2e 測試工具、CSP 僅於正式建置輸出
- 日期：2026-09-26
- 狀態：提議
- Decision Owner：@Wang-Yi-Zhang
- Review Point：M2 完成時（作答頁加入互動腳本後），或 Astro／Sätteri 主版本更新時

## 背景
M1 需要：內文 `[[名詞]]` 轉成可鍵盤操作的浮出說明（04）、`## 進階` 區塊漸進揭露，以及驗收「關閉 JS 可閱讀、鍵盤可操作 popover、axe 無嚴重問題」（11）。實作中另發現兩件事：
1. Astro 7 的預設 Markdown 處理器改為 Sätteri，remark 外掛需另裝 `@astrojs/markdown-remark`（連帶 unified 生態系約 20 個套件）。
2. M0 的 CSP `<meta>` 在開發伺服器也會輸出，而 `npm run dev` 以行內 `<style>` 注入樣式，導致開發環境所有樣式被 CSP 擋下（正式網站不受影響）。

## 決策
1. **Markdown 轉換**：以 Sätteri 的 hast 外掛實作（`src/lib/markdown-ecologic.ts`），不安裝 `@astrojs/markdown-remark`。
   - 在 `package.json` 明確宣告 `@astrojs/markdown-satteri`（dependencies）與 `satteri`（devDependencies，供單元測試）。兩者本來就是 Astro 的相依套件，版本相同、已去重，**依賴樹中沒有新增套件**。
   - 名詞浮出說明使用原生 HTML `popover`／`popovertarget`：開關、Esc 關閉、焦點返回都由瀏覽器處理，不需要 JavaScript。
2. **e2e 測試**：新增 `@playwright/test` 與 `@axe-core/playwright`（06 已選定的測試工具），CI 新增 `e2e` job。
   - e2e 需要測到草稿內容，因此以 `ECOLOGIC_DRAFTS=1` 另外建置到 `dist-drafts/`，正式的 `dist/` 不受影響。
3. **CSP**：`<meta http-equiv="Content-Security-Policy">` 只在正式建置（`import.meta.env.PROD`）輸出。正式產物仍由 `scripts/check-dist.ts` 逐頁檢查。

## 依據的資訊與假設
- 已實測：Sätteri 外掛可替換文字節點、以 `after` 掛勾重組區塊；外掛內拋出的錯誤會中止編譯（找不到的名詞 id 會讓建置失敗）。
- 已實測：Sätteri 不允許直接搬移既有節點，需複製成一般物件再插入（見 `clone()`）。
- 假設 1：原生 popover 在主要瀏覽器已普遍支援；不支援的瀏覽器會把說明直接顯示在文中，內容仍可閱讀。
- 假設 2：開發環境不需要 CSP 保護（只在本機執行）。

## 已知風險
- 風險 1：Sätteri 版本仍在 0.x，外掛 API 可能變動 → 單元測試（`tests/unit/markdown-ecologic.test.ts`）以實際 Markdown 轉換驗證，升版時會先在 CI 失敗。
- 風險 2：開發環境看不到 CSP 違規 → 若新增的程式碼產生行內腳本或樣式，要到 `npm run build` 的 `check-dist` 才會發現。
- 風險 3：e2e 需下載 Chromium，CI 時間約增加 1–2 分鐘。
- 風險 4：popover 預設置中顯示，不會貼在名詞旁邊；若使用者覺得跳動感太大，可改用 CSS anchor positioning（瀏覽器支援度需再評估）。

## 考慮過的選項（含不同意見）
- **安裝 `@astrojs/markdown-remark` 沿用 remark 外掛**：生態系成熟，但新增約 20 個套件，且違背 Astro 7 的預設方向。
- **popover 以 JavaScript 實作**：可精準定位，但關閉 JS 時無法使用，且要自行處理焦點管理與 Esc。
- **開發環境保留 CSP、改用 nonce**：靜態網站無法每次請求產生 nonce，不可行。

## 後果
- 內容作者只要在內文寫 `[[名詞 id]]`，建置時會自動轉換並檢查 id 是否存在、已審內容是否引用了草稿名詞。
- 新增指令 `npm run test:e2e`；CI 的 PR 檢查多一個 `e2e` job（可視需要加入 main 分支的必要檢查）。
