---
id: disjunctive-syllogism
kind: inference
title: 選言三段論
en: Disjunctive syllogism
summary: P 或 Q；P 不成立，所以 Q 成立。
form: 'P ∨ Q, ¬P ∴ Q'
related: [false-dilemma, law-of-excluded-middle]
terms: [disjunction, negation, validity]
status: draft
reviewers: []
updated: 2026-09-26
aiAssisted: true
---

## 說明

已知「P 或 Q」至少有一個成立，又知道 P 不成立，就可以推出 Q 成立。這是[[validity|有效]]推論，也就是常說的「刪去法」。

關鍵在第一句：選項必須真的涵蓋所有可能。如果還有 R、S 沒列出來，刪掉 P 也推不出 Q，這就是「假兩難」的問題。

## 生活例子

> 鑰匙不是在包包裡，就是在外套口袋。
> 包包裡找過了，沒有。
> 所以，鑰匙在外套口袋。

如果鑰匙其實可能掉在車上，第一句就不成立了。

## 保育例子

> 這隻受傷的貓頭鷹，不是被車撞，就是撞到窗戶。
> 牠身上沒有車撞的傷勢特徵。
> 所以，牠是撞到窗戶。

推論形式有效，但還有其他可能（例如誤食老鼠藥、被其他動物攻擊）沒有列入時，結論就不可靠。

## 何時合理

先確認[[disjunction]]的選項是否完整。能把「還有沒有其他可能？」想過一輪，刪去法就很好用。

## 進階

形式：P ∨ Q, ¬P ∴ Q。邏輯上的「或」通常是可兼的（兩者可以同時成立）；這個推論在可兼或不可兼的「或」之下都有效。
