---
id: law-of-non-contradiction
kind: law
title: 不矛盾律
en: Law of non-contradiction
summary: 同一件事，不能在同一方面、同一時間，既說它是又說它不是。
form: '¬(P ∧ ¬P)'
quickCheck:
  question: '下列哪一組說法真的互相矛盾？'
  options:
    - '「這段溪今天早上有魚」和「這段溪今天早上沒有魚」'
    - '「這片森林晚上很安靜」和「這片森林清晨很吵」'
    - '「這個計畫對經濟有幫助」和「這個計畫對生態有影響」'
  answer: 0
  explanation: '只有第一組在同一個對象、同一段時間，同時說「是」又說「不是」。第二組的時間不同，第三組談的是不同面向。'
related: [ law-of-identity, law-of-excluded-middle ]
terms: [ contradiction, negation, proposition ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: Stanford Encyclopedia of Philosophy — Contradiction
    url: https://plato.stanford.edu/entries/contradiction/
updated: 2026-09-26
aiAssisted: true
---

## 說明

一個[[proposition]]和它的[[negation]]不能同時為真。如果一段說法同時主張了兩者，就出現了[[contradiction]]，至少有一個要修正。

實際討論中，看起來矛盾的說法，很多時候只是沒講清楚「在哪個方面」或「在什麼時候」。

## 生活例子

> 「我這個月很省，都沒亂花錢。」
>
> 「可是你上週買了三雙鞋。」
>
> 「那是特價，不算亂花。」

表面上是「沒亂花」與「買了三雙鞋」衝突，但對方其實在區分「亂花」和「有計畫的購買」。先釐清標準，再判斷是否真的矛盾。

## 保育例子

> 志工甲：「今天上午這份調查紀錄，在這段樣區完全沒有記錄到任何魚。」
>
> 志工乙：「今天上午同一份調查紀錄，在同一段樣區記錄到了三種魚。」

這裡明確指同一份紀錄、同一段樣區與同一時段，「完全沒有記錄到魚」與「記錄到三種魚」不能同時為真。可以先核對紀錄與用詞，不必猜誰說謊。若改成上月與本月，或上游與下游，則不必然矛盾。沒有記錄到魚也不等於已證明水中沒有魚。

## 何時合理

指出矛盾之前，先檢查兩句話是不是在講同一個對象、同一個範圍、同一段時間。「這片森林很安靜（晚上）」和「這片森林很吵（清晨鳥叫）」並不矛盾。

## 進階

形式寫成 ¬(P ∧ ¬P)。古典邏輯中，從矛盾可以推出任何命題（爆炸原理），所以矛盾會讓整個推理系統失去意義。

也有邏輯系統（次協調邏輯，paraconsistent logic）允許在局部容忍矛盾而不致爆炸，這屬於較專門的討論。
