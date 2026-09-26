---
id: modus-ponens
kind: inference
title: 肯定前件
en: Modus ponens
summary: 如果 P 就 Q；P 成立，所以 Q 成立。
form: 'P → Q, P ∴ Q'
pairWith: affirming-the-consequent
quickCheck:
  question: '「如果下雨，活動就改到室內。今天下雨了。」可以推出什麼？'
  options:
    - '活動改到室內'
    - '活動沒有改到室內'
    - '沒辦法確定'
  answer: 0
  explanation: '條件句成立，前件（下雨）也成立，就能推出後件：這是肯定前件。'
related: [modus-tollens, hypothetical-syllogism]
terms: [conditional, antecedent, validity, soundness]
status: draft
reviewers: []
updated: 2026-09-26
aiAssisted: true
---

## 說明

有一個[[conditional]]「如果 P，那麼 Q」，又知道[[antecedent]] P 成立，就可以推出 Q 成立。這是最基本的[[validity|有效]]推論。

它和「肯定後件」長得很像，但方向相反，兩張卡可以對照著看。

## 生活例子

> 如果下雨，操場的活動就改到室內。
>
> 今天下雨了。
>
> 所以，活動改到室內。

## 保育例子

> 如果路段設有動物通道，石虎穿越時就比較不需要走上馬路。
>
> 這個路段設有動物通道。
>
> 所以，石虎在這裡穿越時比較不需要走上馬路。

推論形式沒有問題。至於結論可不可信，要看第一句條件句本身有沒有證據支持。

## 何時合理

只要條件句與 P 都為真，結論就一定為真，這叫[[soundness|健全]]。形式有效不等於結論正確：如果條件句本身不成立（例如「如果有動物通道，路殺就會完全消失」），推論再有效也會得出錯的結論。

## 進階

形式：P → Q, P ∴ Q。可以用真值表驗證：所有讓兩個前提都為真的情況，Q 都為真。
