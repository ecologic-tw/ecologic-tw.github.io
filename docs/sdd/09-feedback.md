# 09 回饋機制

雙管道（ADR-0005），網站只放連結，不內嵌、不送出資料。

| 管道 | 對象 | 網址 | 用途 |
|---|---|---|---|
| Google 表單 | 一般民眾（免帳號） | https://forms.gle/ZAacF8i7hQ7QF8LC9 | 題目回報、使用感受、建議、情境投稿 |
| GitHub Issue Forms | 貢獻者 | `https://github.com/ecologic-tw/ecologic-tw.github.io/issues/new/choose` | 內容勘誤、新情境投稿、功能建議、無障礙問題 |

## 入口位置
- 每個情境題頁與圖鑑卡頁底部：「這題有問題／有建議？」→ 兩個按鈕（填表單／開 Issue）。
- 頁尾全站：「意見回饋」。
- `/about/` 說明兩種管道差異與處理流程。

## 預填題目 ID
- 表單：使用 Google 表單「取得預先填入的連結」取得完整網址（`docs.google.com/forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.<ENTRY_ID>=<值>`）。`forms.gle` 短網址無法帶參數，因此 `src/lib/feedback.ts` 設定：
  ```ts
  export const FEEDBACK = {
    formShortUrl: 'https://forms.gle/ZAacF8i7hQ7QF8LC9',
    formPrefillBase: 'https://docs.google.com/forms/d/e/1FAIpQLSfLYC6tg7ixZLtb6bVbcPQqURNFj7abswN_Y9777z1qS7adaw/viewform',
    fields: {
      type: 'entry.1967567927',     // Q1 你想告訴我們什麼？（選項文字須完全相同）
      contentId: 'entry.1393954149', // Q2 題目或卡片 ID
      mode: 'entry.868715057',       // Q3 你使用的模式：基礎／進階／不確定
    },
    typeValues: { report: '這一題／這張卡有問題', feedback: '使用心得與建議', submit: '我想投稿一個情境' },
    modeValues: { basic: '基礎', advanced: '進階' },
    issueBase: 'https://github.com/ecologic-tw/ecologic-tw.github.io/issues/new',
  };
  // 題目頁「回報」按鈕：type=report、contentId=<id>、mode=<目前模式>
  // 頁尾「意見回饋」：只帶 mode（不預選 type）
  // 所有值以 encodeURIComponent() 編碼；entry 代號於 2026-09-26 取得，題目刪除重建後須更新
  ```
  `formPrefillBase` 為空時退回短網址。

  範例（題目頁回報）：
  `…/viewform?usp=pp_url&entry.1967567927=%E9%80%99%E4%B8%80%E9%A1%8C%EF%BC%8F%E9%80%99%E5%BC%B5%E5%8D%A1%E6%9C%89%E5%95%8F%E9%A1%8C&entry.1393954149=cons-003&entry.868715057=%E5%9F%BA%E7%A4%8E`
- Issue：`?template=content-error.yml&title=[勘誤] <id>&content-id=<id>`（Issue Forms 支援以欄位 id 預填）。

## 處理流程
1. 維護者每月（至少每季）檢視表單回應試算表與 Issues。
2. 表單回應需要處理者，由維護者轉開 GitHub Issue（去除個資），標籤：`content-error`／`suggestion`／`new-scenario`／`a11y`。
3. 情境投稿經改寫為符合 08 寫作準則後以 `draft` 進入內容，依 10 審核。
4. 採用的投稿者若同意，列入貢獻者名單（可匿名）。

表單題目設計見 `docs/feedback/google-form-design.md`。
