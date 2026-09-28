# 07 資安與隱私

## 威脅模型摘要
| 威脅 | 可能來源 | 對策 |
|---|---|---|
| 金鑰外洩 | 前端或 repo 放 token | 紅線禁止；開啟 secret scanning＋push protection；PR 模板檢查項 |
| 供應鏈攻擊 | npm 套件、Actions | 依賴最小化；`package-lock.json` 必提交、CI 用 `npm ci`；Dependabot（npm＋actions）；Actions 以 SHA 鎖版；CI 執行 `npm audit --audit-level=high` |
| XSS | 內容 Markdown 夾帶 HTML／腳本；使用者輸入 | 內容禁止原生 HTML（lint＋rehype 移除 raw HTML）；使用者輸入一律 `textContent`，永不 `innerHTML` |
| 惡意匯入檔 | 進度 JSON 匯入 | 100 KB 上限、zod 嚴格驗證、僅接受已知 id，不渲染檔內字串 |
| 帳號接管／惡意 PR | 貢獻者帳號被盜 | Org 強制 2FA；`main` 分支保護（需 1 位維護者核准、需 CI 通過、禁止 force push）；禁用 `pull_request_target` |
| 釣魚仿冒 | 他人複製網站改外連 | 網站所有外連集中於白名單設定；關於頁公告唯一官方網址與表單網址 |
| 個資蒐集 | 表單、投稿內容 | 表單不收 Email；投稿頁提醒勿填個資；審核時移除 |

## 內容安全政策（CSP）
GitHub Pages 無法自訂 HTTP header，以 `<meta http-equiv="Content-Security-Policy">` 設定：
```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'self'; object-src 'none'
```
- Astro 預設可能內嵌小型腳本／樣式：設定 `build.inlineStylesheets: 'never'` 與 `vite.build.assetsInlineLimit: 0`，或改用 Astro 內建 CSP（hash）功能（實作時查證當前版本支援度，擇一並記錄於 ADR）。
- 禁止 `is:inline` 腳本與行內事件屬性（`onclick=`）。
- `frame-ancestors` 無法用 meta 設定；網站無登入或狀態變更操作，點擊劫持風險可接受。

## 外部連結白名單
只允許：`forms.gle`、`docs.google.com/forms`、`github.com/ecologic-tw`、`creativecommons.org`、`opensource.org`，以及內容 `sources` 中經審核的網址。一律 `rel="noopener noreferrer"`。建置期檢查非白名單外連（`sources` 除外）。

網站外部連結另加 `target="_blank"` 與另開視窗提示，優先使用 `ExternalLink.astro`；內部導覽維持同頁。正式產物檢查會拒絕未另開視窗的外連（ADR-0019）。

## 隱私
- 無 cookie、無分析、無第三方請求；可宣告「本站不蒐集任何個人資料」。
- localStorage 只存 `ecologic:v1`（進度與模式），`/me/` 提供一鍵清除。
- 改寫練習內容**不儲存**（只存完成次數）。
- `/about/` 隱私段落以白話說明以上事項。
- 更新通知只用靜態 Atom 訂閱源：由使用者的閱讀器自行抓取，本站不知道誰訂閱；不做推播、不蒐集 Email（ADR-0024）。建置產物檢查確認訂閱源不含未審內容。

## GitHub Organization 設定清單（維護者初始化時執行）
最近一次檢查：2026-09-26（以 `gh api` 唯讀查詢）。
- [ ] Require 2FA for all members
- [ ] 至少 2 位 Owner
- [x] Pages：Source 設為 GitHub Actions；Enforce HTTPS
- [x] Secret scanning＋push protection、Dependabot alerts＋security updates
- [x] `main` branch ruleset：需 PR、1 位 CODEOWNERS 核准、CI 通過、禁止 force push 與刪除（單人維護期間 Organization admin 可 bypass，僅限 PR）
- [x] Actions：Workflow permissions 預設 read-only；禁止 Actions 建立／核准 PR
- [x] Private vulnerability reporting 開啟（配合 SECURITY.md）

## 部署 workflow 要點
- 觸發：push 到 `main`、手動。
- `permissions: { contents: read, pages: write, id-token: write }`，僅部署 job 有 pages 權限。
- 步驟：checkout → setup-node（讀 .nvmrc）→ `npm ci` → `npm run check` → `npm test` → `npm run build` → upload-pages-artifact → deploy-pages。
- PR 觸發另一個 `ci.yml`：同樣檢查但不部署，`permissions: contents: read`。
- 純文件 PR（只改 `docs/**` 或根目錄 `*.md`，`DESIGN.md` 除外）略過 `check`、`e2e`，只跑 `docs` job（`git diff --check`、`npm run check:docs`）；判斷失敗時照跑完整檢查。純文件合併到 main 不重新部署（ADR-0028）。
