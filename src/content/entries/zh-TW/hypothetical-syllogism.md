---
id: hypothetical-syllogism
kind: inference
title: 假言三段論
en: Hypothetical syllogism
summary: 如果 P 就 Q，如果 Q 就 R；所以，如果 P 就 R。
form: 'P → Q, Q → R ∴ P → R'
quickCheck:
  question: '「如果熬夜，早上就起不來；如果早上起不來，就會錯過早班公車。」可以推出什麼？'
  options:
    - '如果熬夜，就會錯過早班公車'
    - '如果錯過早班公車，就表示前一晚熬夜了'
    - '如果沒熬夜，就不會錯過早班公車'
  answer: 0
  explanation: '把兩個條件句串起來，得到第一項。第二項是從結果推回原因（肯定後件），第三項是否定前件，兩者都推不出來。'
related: [ slippery-slope, modus-ponens ]
terms: [ conditional, validity ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹有效性與前提真假的區分；來源不是虛構例子的事實紀錄。"
  - title: "Stanford Encyclopedia of Philosophy — Interpretations of Probability"
    url: https://plato.stanford.edu/entries/probability-interpret/
    supports:
      - "條件機率需要指明條件；不能只憑兩個局部條件機率算出最終結果。"
updated: 2026-09-26
aiAssisted: true
---

## 說明

兩個[[conditional]]可以串起來：如果 P 成立就有 Q，如果 Q 成立就有 R，那麼如果 P 成立就有 R。條件句本身不必描述因果關係。串接本身是[[validity|有效]]的。

這個形式也是「滑坡謬誤」常借用的外殼：鏈子本身沒錯，問題通常出在其中某一環不成立。

## 生活例子

> 如果今晚熬夜，明天早上就會起不來。
>
> 如果早上起不來，就會錯過早班公車。
>
> 所以，如果今晚熬夜，就會錯過早班公車。

## 保育例子

> 如果田邊的樹籬被移除，昆蟲就會變少。
>
> 如果昆蟲變少，吃昆蟲的鳥就會找不到足夠食物。
>
> 所以，如果樹籬被移除，吃昆蟲的鳥就會找不到足夠食物。

推論有效。每一環是否成立、影響有多大，需要調查資料支持。

## 何時合理

形式有效不保證前提為真。使用上述虛構例子時，要另外查證每一個條件句，不能把「常常」當成「必然」。

## 進階

形式：P → Q, Q → R ∴ P → R，也稱為條件句的遞移性。若每一環只是「很可能」，就不能直接套用這個演繹形式。即使知道 P(Q|P) 與 P(R|Q)，仍不足以決定 P(R|P)；還需要其他條件與依賴關係。不能直接把各環的機率相乘，當成最後結果的機率。
