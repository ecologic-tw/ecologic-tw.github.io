# ADR-0011 M0 工具鏈依賴與 CSP 實作方式
- 日期：2026-09-26
- 狀態：提議
- Decision Owner：@Wang-Yi-Zhang
- Review Point：M1 完成時（開始有互動腳本與內容渲染），或 Astro 下一個主版本發布時

## 背景
M0 需初始化 Astro 專案、內容 schema 檢查、CI 與 CSP（docs/sdd/06、07、11）。紅線 8 要求新增 npm 套件須說明理由；07 要求 CSP 採「關閉行內化」或「Astro 內建 CSP（hash）」擇一並記錄。

## 決策
### 1. 依賴（全部版本鎖於 `package-lock.json`）
| 套件 | 類別 | 理由 |
|---|---|---|
| `astro` ^7 | 執行期 | ADR-0001 選定框架；其內附 zod（`astro/zod`），不另裝 zod |
| `@astrojs/check`、`typescript` ^5 | 開發 | `astro check` 型別檢查（06）。`@astrojs/check` 目前 peer 僅支援 TS 5／6，故不用 TS 7 |
| `@types/node` ^24 | 開發 | `scripts/*.ts` 的 Node API 型別 |
| `eslint`、`@eslint/js`、`typescript-eslint`、`eslint-plugin-astro`、`globals` | 開發 | ESLint（06、11）；另以規則禁止 `innerHTML`／`outerHTML`／`insertAdjacentHTML`（07 XSS） |
| `prettier`、`prettier-plugin-astro` | 開發 | Prettier（11） |
| `vitest` | 開發 | 單元測試（06） |
| `yaml` ^2 | 開發 | `scripts/check-content.ts` 解析 frontmatter／`terms.yaml`；已是 Vite 的相依套件，不增加供應鏈面 |

刻意**不**加入：`tsx`（改用 Node 24 內建的 TypeScript 型別剝除直接執行 `.ts`）、獨立的 `zod`、`gray-matter`、`markdownlint`（留待 M1 內容撰寫時再評估）。

### 2. CSP：採「關閉行內化＋自寫 `<meta>`」，不採 Astro 內建 CSP
- `src/lib/csp.ts` 為政策單一來源，`src/layouts/Base.astro` 輸出 `<meta http-equiv="Content-Security-Policy">`，內容與 07 完全一致。
- `astro.config.mjs` 設 `build.inlineStylesheets: 'never'`、`vite.build.assetsInlineLimit: 0`，並關閉 dev toolbar。
- 已實測：Astro 7 的 `<script>` 在此設定下輸出為外部 `type="module" src=` 檔案。
- `scripts/check-dist.ts`（`npm run build` 最後一步）逐頁檢查：CSP meta 存在且與 `csp.ts` 一致、無行內 `<script>`／`<style>`／`style=`／`on*=`、外連在白名單內且帶 `rel="noopener noreferrer"`。違反即建置失敗。

## 依據的資訊與假設
- 假設 1：MVP 不需要 Astro island（Preact 等）。island 會注入行內腳本，屆時需改採 Astro 內建 CSP 的 hash 方式或放寬政策——須新 ADR。
- 假設 2：Node 24 的型別剝除足以執行 `scripts/*.ts`（僅用可剝除語法；tsconfig 開 `erasableSyntaxOnly` 保證）。

## 已知風險
- 風險 1：Astro 升版後改變腳本／樣式輸出方式 → `check-dist` 會讓建置失敗，而不是悄悄違反 CSP。
- 風險 2：`check-dist` 以正規表示式檢查 HTML，可能誤判或漏判罕見寫法；若發生，會看到建置失敗訊息指向具體檔案，屆時再改用 HTML parser（需評估新依賴）。
- 風險 3：npm 11 預設不執行未核准的 install script，`esbuild` 的 postinstall 未執行；目前 esbuild 仍可正常運作（其二進位檔由 optional dependency 提供）。若 CI 出現 esbuild 錯誤，需核准該 script。

## 考慮過的選項（含不同意見）
- **Astro 內建 `security.csp`**：自動為行內腳本／樣式計算 hash。優點是未來加 island 時不用改；缺點是政策含 hash、與 07 的字面政策不同，且外部腳本需額外設定。現階段沒有行內程式碼，較嚴格的 `'self'` 足夠。
- **zod 另裝**：與 Astro 內附版本可能不一致，造成兩套 schema 行為不同，故不採用。

## 後果
- 內容 schema 只有一份（`src/lib/content-schema.ts`），Astro 建置與 `check-content` 共用；schema 採嚴格模式，**拼錯的欄位名稱也會被擋下**。
- 之後任何行內程式碼都會讓建置失敗，開發者需改成外部檔案。
