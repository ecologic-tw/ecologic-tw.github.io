---
version: alpha
name: 邏生門 田野手冊
description: 邏生門／EcoLogic 的視覺系統。數值與 src/styles/global.css 一致，修改時兩邊同步。
colors:
  primary: "#1F3A2E"
  secondary: "#4F6B4A"
  tertiary: "#7A5A2E"
  neutral: "#F1EFE2"
  paper: "#F1EFE2"
  paper-deep: "#E6E3D0"
  ink: "#1F3A2E"
  moss: "#4F6B4A"
  soil: "#7A5A2E"
  mist: "#CFCBB4"
  kind-concept: "#2F5F66"
  kind-law: "#56687A"
  kind-inference: "#4F6B4A"
  kind-formal-fallacy: "#86661E"
  kind-informal-fallacy: "#94492E"
  kind-bias: "#6A4E6D"
  paper-dark: "#141B17"
  paper-deep-dark: "#1D2621"
  ink-dark: "#E2E4D4"
  moss-dark: "#93B08B"
  soil-dark: "#CFA96B"
  mist-dark: "#3A463E"
  kind-concept-dark: "#8EC0C4"
  kind-law-dark: "#9FB2C4"
  kind-inference-dark: "#93B08B"
  kind-formal-fallacy-dark: "#D2B35E"
  kind-informal-fallacy-dark: "#DF9A7C"
  kind-bias-dark: "#C5A4C8"
typography:
  display:
    fontFamily: LXGW WenKai TC
    fontSize: 3.375rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.08em
  heading-1:
    fontFamily: LXGW WenKai TC
    fontSize: 2.25rem
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0.04em
  heading-2:
    fontFamily: LXGW WenKai TC
    fontSize: 1.6875rem
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0.04em
  heading-3:
    fontFamily: LXGW WenKai TC
    fontSize: 1.3125rem
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0.04em
  list-title:
    fontFamily: system-ui
    fontSize: 1.3125rem
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.04em
  body:
    fontFamily: system-ui
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: 0.02em
  small:
    fontFamily: system-ui
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.8
  latin-name:
    fontFamily: Iowan Old Style
    fontSize: 1.125rem
    fontWeight: 400
    letterSpacing: 0em
rounded:
  tab: 1px
  sm: 2px
  md: 3px
spacing:
  gutter-min: 16px
  gutter-max: 40px
  stack-sm: 0.75rem
  stack-md: 1.5rem
  section: 3rem
  measure: 34em
  wide: 72rem
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  page-secondary-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.moss}"
    typography: "{typography.small}"
  draft-banner:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.soil}"
    typography: "{typography.small}"
  divider:
    backgroundColor: "{colors.mist}"
    height: 1px
  panel:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 1.5rem
  panel-secondary-text:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.moss}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: 0.5rem 1.25rem
  mode-switch-selected:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
  kind-label-concept:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-concept}"
  kind-label-law:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-law}"
  kind-label-inference:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-inference}"
  kind-label-formal-fallacy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-formal-fallacy}"
  kind-label-informal-fallacy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-informal-fallacy}"
  kind-label-bias:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.kind-bias}"
  page-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-dark}"
    typography: "{typography.body}"
  page-secondary-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.moss-dark}"
  draft-banner-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.soil-dark}"
  divider-dark:
    backgroundColor: "{colors.mist-dark}"
    height: 1px
  panel-dark:
    backgroundColor: "{colors.paper-deep-dark}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.md}"
  panel-secondary-text-dark:
    backgroundColor: "{colors.paper-deep-dark}"
    textColor: "{colors.moss-dark}"
  button-primary-dark:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.paper-dark}"
    rounded: "{rounded.md}"
  mode-switch-selected-dark:
    backgroundColor: "{colors.moss-dark}"
    textColor: "{colors.paper-dark}"
  kind-label-concept-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-concept-dark}"
  kind-label-law-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-law-dark}"
  kind-label-inference-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-inference-dark}"
  kind-label-formal-fallacy-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-formal-fallacy-dark}"
  kind-label-informal-fallacy-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-informal-fallacy-dark}"
  kind-label-bias-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.kind-bias-dark}"
---

## Overview

田野手冊風格（docs/sdd/04「視覺方向」）：像一本帶到野外的觀察筆記。紙張微帶橄欖色的米白、墨綠字、苔綠與土色輔助，標題用手寫感的文楷。整體安靜、克制，只在首頁使命下方用一行鳥類足跡作為唯一的記憶點。

受眾是高中以上的一般大眾與保育從業人員。語氣是「步道同行者」，不是「糾錯者」：視覺上不用紅色大叉、倒數或排行，答錯只顯示「換個角度看看」（docs/sdd/05）。

## Colors

- **角色對應**：primary＝ink、secondary＝moss、tertiary＝soil、neutral＝paper。程式中使用後者的名稱。
- **paper（#F1EFE2）**：頁面底色，田野筆記紙，比一般暖米白多一點橄欖綠。
- **paper-deep（#E6E3D0）**：情境引文、提示框等次層面板。
- **ink（#1F3A2E）**：墨綠，主要文字與標題。
- **moss（#4F6B4A）**：苔綠，次要文字、提示、主題左側線、模式切換選取狀態。
- **soil（#7A5A2E）**：土色，焦點外框、連結底線、足跡、草稿提示。
- **mist（#CFCBB4）**：分隔線與未選取邊框，不用於文字。
- **卡別色標**：溪（基礎概念，#2F5F66／深色 #8EC0C4，對比 6.17:1／8.75:1）、岩（思維定律）、苔（有效推論）、赭（形式謬誤）、鏽（非形式謬誤）、石楠（認知偏誤），像野外圖鑑書緣的分類索引，用於卡片左側色條與卡別文字。
- **深色模式**：以 `prefers-color-scheme` 切換，`-dark` 後綴的色票與淺色一一對應。

## Typography

- **標題（display、heading-1〜3）**：霞鶩文楷 TC，自託管（ADR-0012），只用 400 字重，不讓瀏覽器合成粗體。
- **列表標題（list-title）**：系統黑體 500。卡片名、題目名、名詞等列表字元種類多，用文楷會下載大量字型分塊（M5 量測後調整）。
- **內文（body）**：系統黑體，行高 1.85、字距 0.02em，適合中文長文閱讀；每行約 34 個全形字。
- **英名（latin-name）**：系統襯線斜體，比照野外圖鑑印物種學名的方式呈現英文名稱。
- 字級採古典比例 14／18／21／27／36／54。

## Layout

- 內文行長維持 34em（約 34 個全形字），兩側留白 16–40px 依視窗寬度變化。
- 頁首、頁尾與列表類頁面（首頁、題目列表、圖鑑總覽、名詞表、我的圖鑑）使用 72rem 寬版容器；視窗 64rem（1024px）以上改為多欄：首頁使命與主題並排、步驟一列四欄、題目列表兩欄、圖鑑與名詞多欄、練習進度與徽章並排。
- 情境題頁與圖鑑卡頁：內文欄維持 34em，相關卡片與下一步移到右側欄（14–20rem），捲動時右側欄停在畫面上方（視窗高度 44rem 以上）；窄螢幕回到單欄，相關連結排在內文之後。
- 關於本站等長篇文字頁維持單欄 34em。
- 區塊之間 3–4.5rem，段落之間 1rem。
- 手機優先，320px 寬度無橫向捲動（NFR-04）。

## Elevation & Depth

幾乎不用陰影。層次靠底色（paper → paper-deep）與細線（mist）區分。唯一的陰影是名詞浮出說明（popover），讓它浮在內文之上。

## Shapes

- 圓角很小：色條 1px、標籤 2px、面板與按鈕 3px。不用大圓角卡片。
- 卡別以左側色條呈現，不用整塊彩色底。

## Components

- **page**：頁面底色與內文。
- **panel**：情境引文、小檢核、提示框。
- **button-primary**：「送出判讀」等主要按鈕，墨綠底紙色字。
- **mode-switch-selected**：頁首「基礎｜進階」切換的選取狀態。
- **kind-label-***：圖鑑卡頁的卡別文字與列表色條。
- **draft-banner**：開發環境才會出現的草稿提示。
- **divider**：分隔線與未選取邊框（mist）。
- **prose-table**：Markdown 本文的對照表。表頭苔色小字、下方 2px 苔色線，列與列之間用 mist 細線，不畫直線；窄螢幕在儲存格內換行，不橫向捲動。

對比度（WCAG）：所有文字與背景組合皆達 AA 4.5:1。餘裕最小的是 panel-secondary-text（4.60:1）與 kind-label-formal-fallacy（4.62:1），調整 moss、paper-deep 或赭色時要先確認這兩組。

## Do's and Don'ts

- Do：對錯同時用圖示與文字表達，不只靠顏色（NFR-03）。
- Do：所有互動元件保留 3px 土色焦點外框。
- Do：顏色只從本檔色票取用，新增色票要同步 `src/styles/global.css`。
- Don't：使用行內 `style` 或 `<style>`，會被 CSP 擋下（ADR-0011）。
- Don't：用紅色大叉、倒數計時、排行榜等黑帽遊戲化元素（紅線 6）。
- Don't：把文楷用在內文或長列表。
- Don't：使用任何機關標誌或暗示官方背書的視覺元素（紅線 7）。
