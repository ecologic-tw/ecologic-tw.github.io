# ADR-0018 來源呈現、搜尋索引與內容品質報告

- 日期：2026-09-27
- 狀態：接受（2026-09-29，@Wang-Yi-Zhang）
- 決策者：@Wang-Yi-Zhang
- 回顧點：首次部署後檢查分享預覽、搜尋索引及連結報告，並於下次內容擴充檢視閱讀門檻

## 背景與決策

依外部驗證 P2／P3，補上參考資料 UI、canonical／Open Graph、sitemap／robots、來源 URL 檢查、審核覆蓋率與閱讀長度提醒。不改內容審核狀態，不啟用對照題雙審，不新增依賴。

- 共用來源元件顯示書目及 supports，沒有網址仍顯示書目；情境題來源放在答案揭露區內，避免來源洩漏判讀方向。名詞使用原生 details，無 JavaScript 仍能展開。
- canonical 使用設定的正式站址，忽略查詢與片段。Open Graph 使用自託管分享圖。草稿預覽全站 noindex，robots 禁止爬取；正式 sitemap 只列正式可索引頁面，排除草稿、retired 與個人進度頁。
- 建置產生 reports/content-quality.json 與 Markdown 報告，涵蓋全體／已審內容與各類別的來源、不同雙審帳號、AI 協助比例，以及逐項閱讀長度。不放入公開網站產物。
- 中文閱讀長度以非空白可見字元估計，分基礎與進階；不是閱讀年級或理解難度的科學量表。超過編輯門檻只警告，由人類判斷拆段、移入進階或保留，不自動改寫已審內容。
- 來源連結檢查獨立於發布 CI，提供手動與每週 GitHub Actions；去重 URL、限制併發與逾時。404／410 等失敗與 403／429／網路問題分開，後者標為待人工確認，不假裝有效；不自動刪來源或發布訊息。

## 假設、風險與替代方案

來源可連線不表示內容支持主張；200 也可能是驗證頁。外站暫時阻擋不應中斷正式建置。報告呈現的是檔案 metadata，不保證人類審核實際發生。閱讀門檻為初始編輯預算，需使用者試讀調整。

選擇原生 Astro 靜態 endpoints、Node fetch 與現有 Playwright，避免為少量頁面加入 SEO／連結檢查套件。排程僅產生 Actions 報告，不建立 Issue 或寄送訊息。

參考：[Open Graph](https://ogp.me/)、[Sitemap protocol](https://www.sitemaps.org/protocol.html)、[Astro endpoints](https://docs.astro.build/en/guides/endpoints/)。
