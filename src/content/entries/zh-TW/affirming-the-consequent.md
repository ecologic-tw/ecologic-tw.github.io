---
id: affirming-the-consequent
kind: formal-fallacy
title: 肯定後件
en: Affirming the consequent
summary: 如果 P 就 Q；看到 Q 成立，就以為 P 也成立。
form: 'P → Q, Q ∴ P'
pairWith: modus-ponens
notFallacyWhen: 當「只有 P 會造成 Q」也有理由支持，或只是把 P 當成需要再查證的可能解釋時，推理是合理的。
charitableResponse: 「Q 確實發生了。我們想想看，還有沒有別的原因也會造成 Q？」
related: [modus-ponens, correlation-causation]
terms: [conditional, consequent, counterexample]
status: draft
reviewers: []
updated: 2026-09-26
aiAssisted: true
---

## 說明

「如果 P，那麼 Q」只保證 P 會帶來 Q，並沒有說 Q 只能由 P 造成。看到[[consequent]] Q 成立，就推回 P 成立，推理形式是無效的。

它和「肯定前件」很像，差別在於肯定的是哪一邊。

## 生活例子

> 如果感冒，就會喉嚨痛。
> 我喉嚨痛。
> 所以，我感冒了。

喉嚨痛也可能是講太多話、過敏或太乾燥。只要找到一個[[counterexample]]：喉嚨痛但沒感冒，就說明這個推理形式不可靠。

## 保育例子

> 如果有人在山區盜獵，那裡的獼猴數量就會下降。
> 最近調查發現，那裡的獼猴數量下降了。
> 所以，一定有人在盜獵。

數量下降也可能來自食物變少、疾病、族群移動，或調查方法改變。直接斷定有人盜獵，可能冤枉在地居民，也可能錯過真正的原因。

## 何時不算謬誤

如果另外有理由相信「只有 P 會造成 Q」，推理就成立。另外，看到 Q 之後把 P 列為「可能的解釋」，再去找其他證據驗證，是正常的調查步驟（稱為溯因推理），只要不把它當成確定的結論即可。

## 善意回應法

「數量下降確實值得注意。除了盜獵，還有哪些原因也可能造成這個結果？我們可以怎麼區分？」

## 進階

形式：P → Q, Q ∴ P。真值表中，P 為假、Q 為真時，兩個前提都成立而結論不成立，所以形式無效。
