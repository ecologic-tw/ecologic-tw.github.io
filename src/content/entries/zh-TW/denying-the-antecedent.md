---
id: denying-the-antecedent
kind: formal-fallacy
title: 否定前件
en: Denying the antecedent
summary: 如果 P 就 Q；看到 P 不成立，就以為 Q 也不成立。
form: 'P → Q, ¬P ∴ ¬Q'
pairWith: modus-tollens
notFallacyWhen: 當 P 是 Q 的唯一原因（也就是「只有 P 才會 Q」）有理由支持時，推理是合理的。
charitableResponse: 「P 沒發生是好消息。不過 Q 會不會還有其他途徑發生？」
quickCheck:
  question: '「如果有會員卡，結帳就能打九折。小明沒有會員卡，所以他結帳一定不能打折。」這個推論？'
  options:
    - '有效：前提為真時，結論一定為真'
    - '無效：沒有會員卡，也可能有其他打折方式'
    - '有效，因為這是否定後件'
  answer: 1
  explanation: '這是否定前件：從「前件不成立（沒有會員卡）」推出「後件不成立（不能打折）」。條件句只說有會員卡就能打折，沒說只有會員卡才能打折。有效的是否定後件：「結帳沒打折，所以沒有會員卡」。'
related: [ modus-tollens ]
terms: [ conditional, antecedent, necessary-condition, counterexample ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "論證、演繹有效性與歸納強度的區分；虛構情境的前提須另行查證。"
updated: 2026-09-27
aiAssisted: true
---

## 說明

「如果 P，那麼 Q」並沒有說「沒有 P 就沒有 Q」。看到[[antecedent]] P 不成立，就推出 Q 不成立，推理形式是無效的：Q 可能透過別的途徑發生。

它和「否定後件」很像，差別在於否定的是哪一邊。

## 生活例子

> 如果熬夜，隔天就會很累。
>
> 我昨天沒熬夜。
>
> 所以，我今天不會累。

就算沒熬夜，也可能因為生病、工作量大而疲倦。

## 保育例子

> 如果那個開發案通過，這片濕地的棲地就會被破壞。
>
> 開發案沒通過。
>
> 所以，這片濕地的棲地不會被破壞。

開發案沒通過固然減少了一個威脅，但棲地仍可能因為外來種、污染或水位改變而變差。以為「擋下開發就安全了」，可能讓後續的監測與管理鬆懈下來。

## 何時不算謬誤

如果另外有理由相信 P 是 Q 的[[necessary-condition]]，也就是「只有 P 會造成 Q」、沒有 P 就不會有 Q，那麼 P 不成立時，Q 也不會成立。

## 善意回應法

「開發案沒過，這個威脅確實少了一個。還有哪些因素也可能影響這片濕地？」

## 進階

形式：P → Q, ¬P ∴ ¬Q。真值表中，P 為假、Q 為真時，兩個前提都成立而結論不成立，所以形式無效。
