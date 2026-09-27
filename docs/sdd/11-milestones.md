# 11 里程碑與驗收

每完成一項，勾選並於 PR 說明中引用。

## M0 專案骨架
- [x] Astro 專案初始化（static、TypeScript strict）、`.nvmrc`、ESLint／Prettier（依賴理由見 ADR-0011）
- [x] `src/content.config.ts` 依 03 完成 schema；`scripts/check-content.ts`
- [x] `ci.yml`（PR）與 `deploy.yml`（main）依 07；Actions 以 SHA 鎖版
- [x] `dependabot.yml`、`CODEOWNERS`、PR 模板（CODEOWNERS 仍為 `@ecologic-tw/maintainers` 佔位，待 team 建立後確認）
- [x] CSP meta 生效，瀏覽器 console 無 CSP 違規（2026-09-26 於正式網址實測；`scripts/check-dist.ts` 於建置時把關，見 ADR-0011）
- **驗收**：空白首頁部署到 `ecologic-tw.github.io`；故意寫錯一個內容欄位時 CI 失敗
  - [x] 故意寫錯欄位 → `npm run check` 失敗（本機已驗證；測試見 `tests/unit/content-checks.test.ts`）
  - [x] 空白首頁部署到 `ecologic-tw.github.io`（2026-09-26，PR #1 合併後由 Deploy workflow 部署）
  - [x] 在 GitHub 上開 PR 驗證 CI 對錯誤內容會失敗（PR #2 的 CI 失敗；該 PR 誤合併進功能分支後已 revert，未進入 main）

## M1 圖鑑與名詞
- [x] `/guide/`、`/guide/<id>/`、`/terms/`、名詞 popover（原生 popover，不需 JS；見 ADR-0013）
- [x] 22 張圖鑑卡 draft、30 條名詞 draft（皆 `aiAssisted: true`，待人工審核）
- **驗收**：關閉 JS 可閱讀；鍵盤可操作 popover；axe 無嚴重問題
  - [x] 本機 `npm run test:e2e` 全數通過（含草稿建置，淺色與深色模式各 25 頁）
  - [x] CI `e2e` job 在 GitHub 上通過（PR #6）

## M2 情境題
- [x] `/practice/*`、`/scenario/<id>/`、作答流程、解說分層、模式切換（progress.ts 核心提前實作，見 ADR-0014）
- [x] 改寫練習與檢核清單（改寫內容不儲存，只計次數）
- [x] 24 題情境題 draft（日常 12、保育 12；每主題對照題 3 題；保育題 12 題中 5 題由支持保育方犯錯）
- **驗收**：`quiz.ts` 單元測試（選項含正解與「沒有問題」、打亂不重複）；e2e 走完一題
  - [x] 本機單元測試（`tests/unit/quiz.test.ts`）與 e2e（`tests/e2e/m2-scenario.spec.ts`）通過
  - [x] CI 在 GitHub 上通過（PR #8：check、e2e）

## M3 八角與個人圖鑑
- [x] `progress.ts`、`badges.ts`、`/me/`、匯出匯入清除（另加卡內小檢核與閱讀紀錄，見 ADR-0015）
- **驗收**：徽章規則單元測試；匯入惡意／超大檔被拒；localStorage 不可用時網站仍可用
  - [x] 本機單元測試（`tests/unit/badges.test.ts`、`progress.test.ts`）與 e2e（`tests/e2e/m3-me.spec.ts`）通過
  - [x] CI 在 GitHub 上通過（PR #10：check、e2e）

## M4 回饋與治理
- [x] 回饋入口與預填連結（09）：題目頁、圖鑑卡頁底部與全站頁尾
- [x] `/about/`（使命、非官方聲明、隱私、授權、參與），另加回饋管道、AI 協作說明與唯一官方網址（07 防仿冒）
- [x] 填入 `CODE_OF_CONDUCT.md` 聯絡人與外部觀察員；角色名冊填入實際帳號（外部觀察員與第二位管理員：招募中）
- [x] 建立 Issue 標籤：`learning-review`、`experiment`、`governance`（另建 `content-error`、`new-scenario`、`suggestion`；無障礙沿用既有的 `accessibility`）
- [x] Google 表單依 `docs/feedback/google-form-design.md` 建置、取得 entry id 填入設定（`src/lib/feedback.ts`）
- **驗收**：從題目頁點回報，表單／Issue 已帶入題目 ID
  - [x] 本機 e2e（`tests/e2e/m4-feedback.spec.ts`）通過
  - [x] CI 在 GitHub 上通過（PR #12：check、e2e）

## M5 審核與上線
- [ ] 全部 MVP 內容經人工審核改為 `reviewed`（分批方式與指令見 `docs/review/review-guide.md`；`npm run check` 會顯示審核進度）
- [ ] Lighthouse：Performance ≥ 90、Accessibility ≥ 95；手機實測
- [ ] Org 設定清單（07）全數完成
- **驗收**：正式網址上線；README 與 about 頁資訊一致

## 知識擴充（ADR-0020、ADR-0021，docs/sdd/12）
- [x] `concept` 卡別、證據強度欄位、頁面標籤與色標（程式與測試）
- [x] 7 張新卡 draft：基礎概念 6 張＋訴諸無知（皆 `aiAssisted: true`）
- [x] 人工審核 7 張新卡（@Wang-Yi-Zhang，PR #24）
- [x] 人工補上 3 張既有偏誤卡的 `evidence`（@Wang-Yi-Zhang），並改為所有偏誤卡必填
- [x] 進階題型與多選題：另開分支，先寫 ADR（ADR-0022）
- [x] ADR-0022 接受（Decision Owner：@Wang-Yi-Zhang）
- [x] 進階題型第 1 階段：schema、建置期檢查、收集與徽章換算、單元測試
- [x] 進階題型第 2 階段：作答頁與前端腳本、`npm run scenario` 支援 `format`、e2e 與 axe
- [x] 進階題型第 3 階段：8 題 draft（日常 daily-013、014、016、017；保育 cons-014 至 017），涵蓋 multi、validity-soundness 與 choice 的三種任務
- [x] 人工審核 8 題進階題（@Wang-Yi-Zhang，PR #33）
- [x] 新增「訴諸傳統」卡與日常情境題 daily-015（draft）
- [x] 人工審核「訴諸傳統」卡與 daily-015（@Wang-Yi-Zhang，PR #33）
- [x] 至少 1 題以「訴諸無知／偵測率」為主題的保育情境題 draft（cons-013，`aiAssisted: true`）
- [x] 人工審核 cons-013（@Wang-Yi-Zhang）；同批開放對照題 cons-012
- [x] cons-013 機率推論修訂重新人工審核（@Wang-Yi-Zhang，PR #40）
- [x] 修訂「不當訴諸權威」（身分與地位、理論權威與實踐權威）並重新人工審核（@Wang-Yi-Zhang，PR #46）
- [x] 新增「訴諸武力」卡與日常題 daily-018、對照題 daily-019，人工審核（@Wang-Yi-Zhang，PR #46）
- [ ] 「訴諸傳統」卡的來源：SEP「Fallacies」條目未討論訴諸傳統（2026-09-27 核對），需另找來源
- [x] 遊蕩犬貓餵食爭議保育題 draft：cons-018（餵食方犯稻草人）、cons-019（保育方犯草率概括），`requiresSecondReview: true`
- [ ] 人工審核 cons-018、cons-019（爭議保育題，需兩位不同審核者確認平衡）；找到第二位審核者前維持 draft，暫不公開

## 更新通知（ADR-0024）
- [x] 第 1 項：`published` 欄位、`npm run review` 自動填入、`/updates/` 頁、Atom 訂閱源、頁尾與 `<head>` 連結、sitemap、產物檢查、單元與 e2e 測試
- [x] ADR-0024 接受（Decision Owner：@Wang-Yi-Zhang）
- [ ] 人工確認 `updates.yaml` 第一則說明的文字
- [ ] 第 2、3 項（本機「新」標記、`/me/` 提示）：依 ADR-0024 Review Point 再評估

## 修訂揭露（ADR-0025）
- [x] ADR-0025 接受（Decision Owner：@Wang-Yi-Zhang）
- [x] 更新說明加入 `about`、`impact`，內容頁顯示修訂日期與紀錄、正解修正提示；匯入保留撤下內容紀錄
- [x] 起草第一批修訂說明：cons-013、不當訴諸權威（AI 起草）
- [ ] 內容審核者確認第一批修訂說明的分級與文字

## 持續
- [x] 非暴力溝通、主觀意義與客觀意義：3 張 concept 卡及 3 條名詞 draft（語言／溝通角度，見 12 §6）
- [x] 人工審核上述溝通與意義內容（2026-09-27，使用者完成標記，reviewer：Wang-Yi-Zhang）；審核規範見 12 §5–6
- [ ] 每年 3 月、9 月角色檢視（第一次：2027-03）

## 後續（v1.1+）
每日情境、更多卡片（循環論證、錯誤類比…，見 12 §3）、英文版、評估隱私友善統計（需 ADR）。
