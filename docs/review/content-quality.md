# P2／P3 內容品質工具

## 網站呈現與搜尋

圖鑑卡、情境題及名詞會顯示原生可展開的「參考資料」，列出書目與 `supports` 引用範圍；不需 JavaScript。情境題的資料放在「看答案」內，避免先透露判讀方向。無網址的書目仍會呈現；可點擊的來源限 HTTP(S)。

每頁有正式網址 canonical 與 Open Graph metadata，使用自託管 `public/social-card.png`（1200 × 630）。改圖可執行 `node scripts/create-social-card.mjs`，需既有 Playwright Chromium；該腳本使用本機字型，不存取遠端圖片。

正式 `/sitemap.xml` 包含首頁、關於、圖鑑／名詞／練習列表及已審內容頁，不列個人進度頁、草稿或下架頁。`/robots.txt` 指向 sitemap。開發／含草稿預覽全站 noindex、robots 禁爬且 sitemap 為空；這不是存取控制，草稿仍只應用於開發環境。建置檢查會驗證 canonical、Open Graph、sitemap 與正式內容範圍。

## 審核覆蓋率與閱讀長度

```sh
npm run report:content
```

`npm run build` 也自動產生 `reports/content-quality.md` 與 `.json`。報告不上傳到公開網站、不納入 Git；PR CI 保存為 `content-quality` artifact（30 天）。數據包含全部內容、已審集合及三種內容類別：有來源比例、至少兩位不同審核帳號比例、AI 協助比例，皆列分子與分母；空集合百分比為不適用。雙審 0% 不表示違規，仍依各內容的實際審核門檻判斷。

閱讀提醒使用以下初始編輯預算，集中於 `src/lib/content-quality.ts`：

| 內容 | 基礎字元 | 進階字元 |
|---|---:|---:|
| 圖鑑卡 | 1200 | 900 |
| 情境題 | 700 | 500 |
| 名詞定義 | 180 | — |

最長句另以 100 字元提醒。去除標題與 Markdown 格式、連結目的地，名詞標記換成顯示名稱；計算非空白 Unicode 字元（含標點）。卡片計入摘要及小檢核，題目計入參考改寫與檢核清單，排除來源書目及介面字串。這是篇幅與句長提示，**不是科學閱讀年級或理解難度判定**。本工具不自動改內容或審核狀態，也不因超標擋建置。

看到提醒時，先檢查句子可否拆開、基礎段落是否藏了過多專業前提、延伸內容是否適合放在 `## 進階`／`## 進階解說`；必要資訊可以保留並在 PR 解釋。最後仍需讀者試讀，調整門檻須說明理由。

## 來源 URL 維護

```sh
npm run check:links
```

讀取三種內容的 `sources.url`（含草稿／下架），去重後檢查，最多同時 3 個請求，每個逾時 15 秒。產生 `reports/source-links.md` 與 `.json`，JSON 包含檢查時間、原 URL、HTTP 狀態及重新導向目的地。

- `ok`：HTTP 2xx；不代表內容正確、支持主張或不是驗證頁。
- `broken`：404／410 等失敗，指令回傳非零；請核對來源的新位置或書目。
- `manual`：401／403／429、伺服器錯誤、逾時或網路問題；不認定失效，請人工開啟或稍後再查。報告仍會列出，不自動刪除來源。

`.github/workflows/source-links.yml` 每週一 02:20 UTC（臺灣 10:20）及手動執行，結果出現在 Actions Summary 與 `source-links` artifact。工作流程合併至 main 後才會排程；不建立 Issue、不寄送額外訊息，也不將外站連線列為發布 CI 的必要條件。

首次本機檢查（2026-09-27）：18 個不同 URL，16 個 HTTP 成功；Science DOI 回 403，USGS 占據率文獻逾時，兩項列為人工確認。這是當次連線結果，不是永久有效性證明。

## 發布前人工確認

- [ ] 在手機展開參考資料，確認書目與引用範圍清楚且不溢出。
- [ ] 部署後確認社群平台分享預覽（平台可能快取舊資料）；本機 metadata 通過不保證平台已更新快取。
- [ ] 人工核對 `manual` 連結及來源內容是否支持主張。
- [ ] 依讀者試讀回饋確認篇幅門檻適當，不將「無提醒」等同易懂。

決策見 [ADR-0018](../adr/0018-content-quality-and-discovery.md)。
