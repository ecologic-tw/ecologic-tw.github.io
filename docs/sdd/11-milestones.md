# 11 里程碑與驗收

每完成一項，勾選並於 PR 說明中引用。

## M0 專案骨架
- [ ] Astro 專案初始化（static、TypeScript strict）、`.nvmrc`、ESLint／Prettier
- [ ] `src/content.config.ts` 依 03 完成 schema；`scripts/check-content.ts`
- [ ] `ci.yml`（PR）與 `deploy.yml`（main）依 07；Actions 以 SHA 鎖版
- [ ] `dependabot.yml`、`CODEOWNERS`、PR 模板
- [ ] CSP meta 生效，瀏覽器 console 無 CSP 違規
- **驗收**：空白首頁部署到 `ecologic-tw.github.io`；故意寫錯一個內容欄位時 CI 失敗

## M1 圖鑑與名詞
- [ ] `/guide/`、`/guide/<id>/`、`/terms/`、名詞 popover
- [ ] 22 張圖鑑卡 draft、30 條名詞 draft
- **驗收**：關閉 JS 可閱讀；鍵盤可操作 popover；axe 無嚴重問題

## M2 情境題
- [ ] `/practice/*`、`/scenario/<id>/`、作答流程、解說分層、模式切換
- [ ] 改寫練習與檢核清單
- [ ] 24 題情境題 draft（日常 12、保育 12；每主題對照題 2–3 題；保育題平衡原則）
- **驗收**：`quiz.ts` 單元測試（選項含正解與「沒有問題」、打亂不重複）；e2e 走完一題

## M3 八角與個人圖鑑
- [ ] `progress.ts`、`badges.ts`、`/me/`、匯出匯入清除
- **驗收**：徽章規則單元測試；匯入惡意／超大檔被拒；localStorage 不可用時網站仍可用

## M4 回饋與治理
- [ ] 回饋入口與預填連結（09）
- [ ] `/about/`（使命、非官方聲明、隱私、授權、參與）
- [ ] 填入 `CODE_OF_CONDUCT.md` 聯絡人與外部觀察員；角色名冊填入實際帳號
- [ ] 建立 Issue 標籤：`learning-review`、`experiment`、`governance`
- [ ] Google 表單依 `docs/feedback/google-form-design.md` 建置、取得 entry id 填入設定
- **驗收**：從題目頁點回報，表單／Issue 已帶入題目 ID

## M5 審核與上線
- [ ] 全部 MVP 內容經人工審核改為 `reviewed`
- [ ] Lighthouse：Performance ≥ 90、Accessibility ≥ 95；手機實測
- [ ] Org 設定清單（07）全數完成
- **驗收**：正式網址上線；README 與 about 頁資訊一致

## 持續
- [ ] 每年 3 月、9 月角色檢視（第一次：2027-03）

## 後續（v1.1+）
每日情境、更多卡片（循環論證、訴諸無知、錯誤類比…）、英文版、評估隱私友善統計（需 ADR）。
