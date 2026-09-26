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
    formPrefillBase: '',          // TODO: 完整 viewform 網址，表單題目定稿後填入
    formEntryIdField: '',         // TODO: 「題目或卡片 ID」題的 entry.xxxx
    formPageUrlField: '',         // TODO: 「頁面網址」題的 entry.xxxx（選用）
    issueBase: 'https://github.com/ecologic-tw/ecologic-tw.github.io/issues/new',
  };
  ```
  `formPrefillBase` 為空時退回短網址。
- Issue：`?template=content-error.yml&title=[勘誤] <id>&content-id=<id>`（Issue Forms 支援以欄位 id 預填）。

## 處理流程
1. 維護者每月（至少每季）檢視表單回應試算表與 Issues。
2. 表單回應需要處理者，由維護者轉開 GitHub Issue（去除個資），標籤：`content-error`／`suggestion`／`new-scenario`／`a11y`。
3. 情境投稿經改寫為符合 08 寫作準則後以 `draft` 進入內容，依 10 審核。
4. 採用的投稿者若同意，列入貢獻者名單（可匿名）。

表單題目設計見 `docs/feedback/google-form-design.md`。
