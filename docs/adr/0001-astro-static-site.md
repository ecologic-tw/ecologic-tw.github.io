# ADR-0001 採用 Astro＋Markdown 內容集，靜態部署於 GitHub Pages
- 日期：2026-09-26　狀態：接受
## 背景
需免費託管、易傳承，接手者可能不是工程師；內容量會持續增加。
## 決策
Astro 靜態輸出；內容以 Markdown/YAML 撰寫並以 zod schema 驗證；GitHub Actions 部署。
## 考慮過的選項
純 HTML/JSON（無驗證、難擴充）、Eleventy（schema 驗證弱）、React SPA（依賴多、SEO 差、對非工程師不友善）。
## 後果
需 Node 工具鏈；換得「改 .md 即可貢獻」與「寫錯欄位會被擋下」。
