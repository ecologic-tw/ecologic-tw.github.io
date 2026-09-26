---
id: modus-tollens
kind: inference
title: 否定後件
en: Modus tollens
summary: 如果 P 就 Q；Q 不成立，所以 P 不成立。
form: 'P → Q, ¬Q ∴ ¬P'
pairWith: denying-the-antecedent
quickCheck:
  question: '「如果他已經出門，玄關的鞋子就不會在。鞋子還在玄關。」可以推出什麼？'
  options:
    - '他已經出門了'
    - '他還沒出門'
    - '沒辦法確定'
  answer: 1
  explanation: '條件句成立，後件（鞋子不在）不成立，就能推出前件也不成立：這是否定後件。'
related: [modus-ponens]
terms: [conditional, consequent, negation, validity, soundness]
status: draft
reviewers: []
updated: 2026-09-26
aiAssisted: true
---

## 說明

有一個[[conditional]]「如果 P，那麼 Q」，又知道[[consequent]] Q 不成立，就可以推出 P 也不成立。這也是[[validity|有效]]推論，常用來檢驗一個說法：若它成立，應該會看到某個結果；沒看到，就表示說法有問題。

## 生活例子

> 如果他已經出門，玄關的鞋子就不會在。
>
> 鞋子還在玄關。
>
> 所以，他還沒出門。

## 保育例子

> 如果這片林地有石虎活動，自動相機就一定會拍到。
>
> 相機架了三個月，一張都沒拍到。
>
> 所以，這片林地沒有石虎活動。

形式完全有效，但第一句值得懷疑：相機只涵蓋小範圍，動物可能剛好沒經過鏡頭。結論是否可信，取決於「一定會拍到」這個前提成不成立。

## 何時合理

條件句要真的可靠。像上面的例子，比較謹慎的說法是「沒拍到，表示石虎在這裡活動的機會可能不高」，而不是斷定「沒有」。

## 進階

形式：P → Q, ¬Q ∴ ¬P，符號 ¬ 表示[[negation]]。科學上的「可否證性」檢驗常借用這個形式：理論預測 Q，觀察到非 Q，理論就需要修正。實務上，因為前提常包含輔助假設（例如「相機運作正常」），被否定的可能是輔助假設而不是理論本身。
