# 邏生門／EcoLogic

用生活與保育的情境，一步一步練習好好說理。

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
請見 [CONTRIBUTING.md](CONTRIBUTING.md)、[行為準則](CODE_OF_CONDUCT.md)；資安問題請見 [SECURITY.md](SECURITY.md)。
設計文件在 [docs/sdd/](docs/sdd/)，決策紀錄在 [docs/adr/](docs/adr/)。

## 開發
需要 Node.js 24（見 `.nvmrc`）。

```sh
npm ci
npm run dev        # 開發伺服器（會顯示草稿內容）
npm run check      # 型別與內容檢查
npm test           # 單元測試
npx playwright install chromium   # 第一次跑 e2e 前
npm run test:e2e   # e2e 與無障礙測試
npm run build      # 正式建置（只含 reviewed 內容）
```

## 授權
- 程式碼：MIT（見 `LICENSE`）
- 內容（`src/content/` 下之題目、解說、名詞）：CC BY-SA 4.0，姓名標示為「邏生門貢獻者們（https://github.com/ecologic-tw）」（見 `LICENSE-CONTENT.md`）
