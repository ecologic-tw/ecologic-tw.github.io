---
title: 不是棲地就不用調查？
theme: conservation
format: validity-soundness
validity: invalid
premises: uncertain
notes:
  validity: 前提說的是「如果是棲地，就要調查」，沒有說「只有棲地才要調查」。從「不是棲地」推出「不需要調查」是否定前件，形式無效：就算兩個前提都為真，也可能有其他理由需要調查。
  premises: 第一個前提是說話者提出的規則，題幹沒有說明依據；第二個前提「這裡不是棲地」本身就需要調查才能確認。只看題幹，無法判斷前提是否可信。
difficulty: advanced
form: 'P → Q，¬P ⊢ ¬Q（無效）'
betterPhrasing:
  - 「目前沒有資料顯示這裡是保育類動物的棲地。不過這個判斷本身也需要調查才能確認，而且還有水土保持、周邊生態等其他因素要評估。」
checklist:
  - 分清楚「如果 P 就 Q」和「只有 P 才 Q」
  - 想到其他可能也需要調查的理由
  - 說明前提本身是怎麼確認的
terms: [ conditional, antecedent, validity, soundness ]
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹有效性與健全性的定義，以及有效性與前提真假的區分。"
contributors: []
aiAssisted: true
requiresSecondReview: false
status: reviewed
reviewers:
  - Wang-Yi-Zhang
updated: 2026-09-27
id: cons-016
isControl: false
---

## 情境

> 開發單位的代表：「如果開發地點是保育類動物的棲地，就要先做詳細的生態調查。這裡不是保育類動物的棲地，所以不需要做生態調查。」

## 解說

先看形式：[[conditional]]只說「如果是棲地，就要調查」，沒有說「只有棲地才要調查」。從[[antecedent]]不成立（不是棲地），推出「不需要調查」，是[否定前件](/guide/denying-the-antecedent/)的形式，所以這個推理[[validity|無效]]：就算兩個前提都為真，也可能因為其他理由而需要調查。

再看前提：第一個前提是說話者自己提出的規則；第二個前提「這裡不是棲地」，本身就需要調查才能確認。形式無效，所以不論前提是否可信，這個論證都不[[soundness|健全]]。

## 進階解說

這題的兩軸答案是「無效」與「無法從題幹判斷」，推導出的結果是「不健全」：只要形式無效，論證就不可能健全，前提可不可信不會改變這個結果。反過來，形式有效時，才需要再看前提是否可信。
