# 邏生門／EcoLogic

從各說各話，走向共同思考：用生活與保育的情境，練習辨識邏輯瑕疵、調整表述視角。

- 網站：https://ecologic-tw.github.io/（[關於本站](https://ecologic-tw.github.io/about/)）
- 內容：思維定律、有效推論、形式／非形式謬誤、認知偏誤
- 主題：日常生活、野生生物保育
- 回饋：https://forms.gle/ZAacF8i7hQ7QF8LC9 （一般民眾）／[GitHub Issues](https://github.com/ecologic-tw/ecologic-tw.github.io/issues/new/choose)（貢獻者）

## 聲明
本專案為社群教育專案，**不代表任何政府機關或團體立場**，也不使用任何機關標誌。所有情境皆為虛構，不指涉真實的人物、機關或事件。

## 隱私
不使用 cookie，沒有流量統計、廣告或第三方程式。作答紀錄只存在使用者自己的瀏覽器（localStorage `ecologic:v1`），不會上傳；改寫練習的文字不儲存。

## AI 協作與審核
部分內容由 AI 協助撰寫初稿（標示 `aiAssisted: true`），一律經人工審核改為 `reviewed` 後才會出現在網站上。

使用 Codex、Claude Code 或其他 AI 工具參與開發，請先讀共用規範 [AGENTS.md](AGENTS.md)。Claude Code 的 [CLAUDE.md](CLAUDE.md) 也導向同一份規範；開工提示與跨工具交接方式見 [CONTRIBUTING.md](CONTRIBUTING.md#使用-ai-工具協作)。

## 唯一官方網址
為避免仿冒，本專案只使用：
- 網站：https://ecologic-tw.github.io/
- 回饋表單：https://forms.gle/ZAacF8i7hQ7QF8LC9
- 原始碼與討論：https://github.com/ecologic-tw

## 參與
我們的文化：自由決定、公開承擔、共同學習（[社群指引](docs/共好型自主敏捷社群指引.md)）。
第一次參與可從 [試讀、查證或技術小任務](CONTRIBUTING.md#第一次參與先選一小件事) 開始；入口目前為試行草案，允許只完成一部分，由其他人接力。
請見 [CONTRIBUTING.md](CONTRIBUTING.md)、[行為準則](CODE_OF_CONDUCT.md)；資安問題請見 [SECURITY.md](SECURITY.md)。
設計文件在 [docs/sdd/](docs/sdd/)，決策紀錄在 [docs/adr/](docs/adr/)。

## 環境準備與快速上手

### 環境準備

- 安裝 Git、Node.js **24.x** 與隨附的 npm；版本依 [`.nvmrc`](.nvmrc) 與 [`package.json`](package.json) 為準，與 CI 保持一致。
- 準備終端機（Windows 可用 PowerShell）與文字編輯器。先執行 `git --version`、`node --version`、`npm --version`，確認指令可用且 Node.js 為 24.x。
- 本專案是純靜態網站，本機開發不需後端、資料庫、API key 或 `.env` 設定；首次安裝套件與測試瀏覽器需要網路連線。

### 取得專案並啟動

```sh
git clone https://github.com/ecologic-tw/ecologic-tw.github.io.git
cd ecologic-tw.github.io
npm ci
npm run dev
```

已有專案副本者，直接進入該目錄，先以 `git branch --show-current`、`git status` 核對分支與未提交變更，保留既有工作後再執行 `npm ci`。安裝依鎖定檔 `package-lock.json` 進行；切換分支或更新依賴後也請重新執行。

開啟終端機顯示的本機網址（通常為 `http://localhost:4321/`），即可預覽網站；修改檔案後會自動更新，以 `Ctrl+C` 停止伺服器。開發模式會顯示草稿，**不表示內容已通過人工審核或可發布**。

### 檢查與正式建置

以下指令皆在專案根目錄執行；開發伺服器運作時可另開終端機。

```sh
npm run lint       # ESLint 與格式檢查
npm run check      # Astro 型別與內容 schema 檢查
npm test           # 單元測試（執行一次）
npm run build      # 正式建置、產物檢查與內容品質報告
npm run preview    # 預覽剛建置的網站
```

正式建置輸出至 `dist/`，只發布 `status: reviewed` 的內容；先完成 `npm run build` 再執行 `npm run preview`，並開啟終端機顯示的網址。預覽不會自動重建，修改後需重新建置。

影響互動時，另執行端對端與無障礙測試：

```sh
npx playwright install chromium   # 首次執行或 Playwright 更新後安裝
npm run test:e2e
```

測試設定會自動建置含草稿的版本至 `dist-drafts/`，並在連接埠 `4322` 啟動預覽伺服器，不必手動啟動。Linux 若缺少瀏覽器系統依賴，可使用 CI 相同的 `npx playwright install --with-deps chromium` 安裝。

### 接手前先看

1. 閱讀 [共用開發規範](AGENTS.md)、[貢獻指南](CONTRIBUTING.md)、[專案用語](CONTEXT.md) 與 [里程碑](docs/sdd/11-milestones.md)，再按任務查閱 SDD 與 ADR。
2. 核對 [交接紀錄](docs/handoff.md)、目前 Git 差異及相關 Issue／PR；文件中的歷史驗證結果不代表目前工作區已驗證。
3. 程式變更完成後執行 lint、check 與單元測試；影響建置或互動時加跑 build 或相關 e2e。只改文件時檢查連結、規範一致性與 `git diff --check`。
4. 新增內容維持 `draft`，AI 協助內容標示 `aiAssisted: true`，依 [審核指南](docs/review/review-guide.md) 交由人類審核。交接時記下變更、實際驗證結果與待辦事項。

## 授權
- 程式碼：MIT（見 `LICENSE`）
- 內容（`src/content/` 下之題目、解說、名詞）：CC BY-SA 4.0，姓名標示為「邏生門貢獻者們（https://github.com/ecologic-tw）」（見 `LICENSE-CONTENT.md`）
