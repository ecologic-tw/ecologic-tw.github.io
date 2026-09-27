---
id: deduction-induction-abduction
kind: concept
title: 演繹、歸納與溯因
en: Deduction, induction and abduction
summary: 三種推理方向：從規則推個案、從個案推規則、從線索推最佳解釋。
quickCheck:
  question: '調查員在步道上看到新鮮的排遺和腳印，判斷「最近可能有食蟹獴經過」。這主要是哪一種推理？'
  options:
    - '演繹'
    - '歸納'
    - '溯因（推論到最佳解釋）'
  answer: 2
  explanation: '從觀察到的線索，推論最能解釋這些線索的原因，是溯因推理。它很有用，但結論是暫定的：其他動物、其他時間點都可能是替代解釋。'
related: [ validity-and-soundness, hasty-generalization, correlation-causation ]
terms: [ deduction, induction, inference, sample, representative-sample ]
status: draft
reviewers: []
sources:
  - title: "Douven, I. Abduction. Stanford Encyclopedia of Philosophy."
    url: https://plato.stanford.edu/entries/abduction/
    supports:
      - "溯因（推論到最佳解釋）的定義，以及它與演繹、歸納的區別。"
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹與歸納論證的區分。"
updated: 2026-09-27
aiAssisted: true
---

## 說明

| 推理 | 方向 | 結論的性質 |
|---|---|---|
| [[deduction]] | 從一般規則推到個案 | 前提為真時，結論必然為真 |
| [[induction]] | 從多個個案推到一般規則或預測 | 結論可能為真，強度取決於[[sample]]品質 |
| 溯因 | 從觀察到的線索推到最可能的解釋 | 暫定的最佳解釋，有新證據就可能修正 |

三者沒有高下之分，日常與科學工作都會交替使用。

## 生活例子

- 演繹：「會員週二打九折；今天週二；所以我能打九折。」
- 歸納：「這家店我去了十次都準時開門，明天應該也會準時開。」
- 溯因：「地板濕了、窗戶開著、外面在下雨，大概是雨打進來。」

## 保育例子

野外調查幾乎每天都用到溯因：從足跡、排遺、食痕推斷有什麼動物來過。好的調查員會同時列出替代解釋（是不是別的物種？是不是很久以前留下的？），再找能區分它們的證據。

歸納則出現在族群估計：從樣區推估整個區域。樣區是否具[[representative-sample|代表性]]，決定結論可不可靠。

## 常見誤解

- **「歸納和溯因的結論不確定，所以不可信。」**它們的強度有高低之分。證據充分的歸納與溯因，是科學知識的主要來源。
- **「最先想到的解釋就是最佳解釋。」**最佳解釋需要和替代解釋比較過。

## 進階

評估「最佳」解釋的常見標準包括：能解釋多少觀察、是否簡潔、是否與既有知識一致、能否做出可檢驗的預測。溯因的結論仍需要用演繹推出預測，再用歸納蒐集的資料檢驗。
