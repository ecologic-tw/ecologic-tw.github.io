# ADR-0028 純文件 PR 略過完整 CI 與部署

- 日期：2026-09-28
- 狀態：接受（2026-09-28，@Wang-Yi-Zhang）
- Decision Owner：@Wang-Yi-Zhang
- Review Point：實施後第一個月，檢查是否有純文件 PR 被誤判、或程式變更被誤判為純文件；若 `docs/` 開始被建置或測試讀取，須修改判斷規則

## 背景
`ci.yml` 對每個 PR 都執行完整檢查（npm audit、lint、check、單元測試、build）與 e2e（安裝 Chromium、全部瀏覽器測試）；`deploy.yml` 每次合併到 main 都重新部署。專案有大量純文件 PR（ADR、SDD、交接紀錄、審核文件），這些檔案不被建置或測試讀取（`*.md` 已排除於 Prettier），完整 CI 主要是重跑未變動的程式。`AGENTS.md` 已規定只改文件時檢查引用、規範一致性與 `git diff --check`，但 CI 未對齊。

`main` 的 ruleset 目前只把 `check` 列為必要檢查（2026-09-28 經 GitHub API 確認）。

## 決策
1. `ci.yml` 新增 `changes` job，以 `git diff --name-only` 判斷變更範圍，不使用第三方 Action。
   - **純文件**：只改 `docs/**` 或根目錄 `*.md`，且不含 `DESIGN.md`（有單元測試比對色票）。
   - 其他任何檔案（含 `src/content/`、`.github/`、`package*.json`）一律視為需要完整檢查。
2. `check`、`e2e` 在純文件時以 `if` 略過；GitHub 將略過的必要檢查視為通過，因此不使用 `paths-ignore`（會讓必要檢查永遠等待）。
3. **Fail-safe**：`changes` 失敗或未完成時，`check`、`e2e` 照常執行，避免略過被誤當通過。手動執行（無 PR 基準）一律完整檢查。
4. 新增 `docs` job（所有 PR 都跑）：`git diff --check` 與 `npm run check:docs`（Markdown 相對連結必須指向存在的檔案）。
5. `deploy.yml` 以 `paths` 排除 `docs/**` 與根目錄 `*.md`（`DESIGN.md` 除外）；需要時可手動執行部署。

## 依據的資訊與假設
- 假設：`docs/` 與根目錄 Markdown 不參與建置、測試與網站內容；目前只有 `DESIGN.md` 例外。
- GitHub 行為：以 `if` 略過的 job 對必要檢查回報為成功；以路徑過濾未觸發的 workflow 則不回報，必要檢查會停在等待。

## 已知風險
- 日後有程式開始讀取 `docs/` 或其他根目錄 Markdown 時，純文件判斷會漏跑測試 → 新增這類讀取時必須同步修改 `changes` 規則（Review Point 檢查）。
- 純文件 PR 不檢查外部網址 → 由既有每週 `source-links.yml` 與人工審閱補足。
- 決策當時 `e2e` 與 `docs` 不是必要檢查，失敗也不會阻擋合併 → 已由管理員於 2026-09-28 將 `e2e`、`docs` 加入 ruleset 必要檢查（見文末實施紀錄）。

## 考慮過的選項（含不同意見）
- `paths-ignore`：最簡單，但必要檢查會停在等待，純文件 PR 無法合併。
- 第三方路徑過濾 Action：功能完整，但違反依賴最小化（紅線 8），且需額外審查供應鏈。
- 維持現狀：最保守，但每個純文件 PR 花數分鐘 CI 並觸發不必要的重新部署。

## 後果
純文件 PR 只需幾十秒的輕量檢查；程式與內容 PR 行為不變。新增 `check:docs` 指令與對應單元測試。

## 實施紀錄（2026-09-28）
- 程式 PR #55（改 `.github/`）：`changes`、`docs`、`check`、`e2e` 四項皆執行並通過。
- 純文件 PR #56：`changes`、`docs` 通過，`check`、`e2e` 顯示為略過且可合併；合併後 Deploy 未觸發。
- ruleset `protect-main` 必要檢查改為 `check`、`e2e`、`docs`（來源 GitHub Actions，經 GitHub API 確認）；`changes` 不列入，因其失敗時 `check`、`e2e` 會照跑完整檢查。
