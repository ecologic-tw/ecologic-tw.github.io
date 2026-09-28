---
id: conditional-variants
kind: concept
title: 條件句的四種變形
en: Converse, inverse and contrapositive
summary: 原句只和「逆否」等價；「逆」和「否」都不能從原句推出。
form: 'P → Q ≡ ¬Q → ¬P；P → Q ⇏ Q → P；P → Q ⇏ ¬P → ¬Q'
quickCheck:
  question: '原句：「如果是保育類野生動物，就不能任意飼養。」下列哪一句必然和原句同真同假？'
  options:
    - '如果不能任意飼養，就是保育類野生動物。'
    - '如果不是保育類野生動物，就可以任意飼養。'
    - '如果可以任意飼養，就不是保育類野生動物。'
  answer: 2
  explanation: '第三句是逆否句，和原句等價。第一句是逆句，第二句是否句；其他法規或理由也可能限制飼養，所以它們都不能從原句推出。'
related:
  [
    necessary-and-sufficient-conditions,
    modus-tollens,
    affirming-the-consequent,
    denying-the-antecedent
  ]
terms: [ conditional, antecedent, consequent, negation ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "Hurley, P. J. A Concise Introduction to Logic（命題邏輯章節：條件句與邏輯等價）"
    supports:
      - "條件句與其逆否句等價，逆句與否句不等價。"
  - title: "Brennan, A. Necessary and Sufficient Conditions. Stanford Encyclopedia
      of Philosophy."
    url: https://plato.stanford.edu/entries/necessary-sufficient/
    supports:
      - "條件句與必要、充分條件的對應。"
updated: 2026-09-29
aiAssisted: true
---

## 說明

從一個[[conditional]]「如果 P，那麼 Q」出發，可以做出三種變形：

| 名稱 | 形式 | 和原句等價嗎？ |
|---|---|---|
| 原句 | 如果 P，那麼 Q | — |
| 逆 | 如果 Q，那麼 P | 不一定 |
| 否 | 如果非 P，那麼非 Q | 不一定 |
| 逆否 | 如果非 Q，那麼非 P | **一定等價** |

逆和否彼此等價，但都不能從原句推出。把原句當成逆句來用，就是[肯定後件](/guide/affirming-the-consequent/)；當成否句來用，就是[否定前件](/guide/denying-the-antecedent/)。

## 生活例子

> 原句：「如果下雨，地面就會濕。」
>
> 逆否：「如果地面沒濕，就沒有下雨。」（成立）
>
> 逆：「如果地面濕了，就是下過雨。」（不成立，可能是灑水）

## 保育例子

> 原句：「如果這區有穩定的石虎族群，長期監測應該會有紀錄。」
>
> 逆：「有紀錄，就代表有穩定族群。」

逆句不成立：單次紀錄可能只是個體路過。逆否句「長期監測都沒有紀錄，就不太可能有穩定族群」則和原句等價，但仍取決於原句本身是否可靠，也就是監測的偵測能力夠不夠。

## 常見誤解

- 「**反過來說也一樣**。」日常語言常把原句和逆句混為一談，例如把「用功就會進步」聽成「有進步就是用功了」。
- 「**逆否句是另一個新的主張**。」逆否句和原句說的是同一件事，只是換個角度表達。

## 進階

用[[negation]]符號表示：P → Q 等價於 ¬Q → ¬P。這個等價正是[否定後件](/guide/modus-tollens/)有效的原因：從 ¬Q 出發，套用逆否句，就能推出 ¬P。
