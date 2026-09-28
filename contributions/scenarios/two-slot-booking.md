---
title: 活動中心只剩兩個時段
theme: daily
answer: none
distractors: [ false-dilemma, hasty-generalization, slippery-slope ]
difficulty: basic
form: 'P ∨ Q, ¬P ∴ Q'
betterPhrasing:
  - 「管理室說下週六只開放上午和下午，上午已經有社團登記了，所以要借活動中心的話只剩下午。如果下午大家不方便，我們也可以討論換日期或換場地。」
checklist:
  - 說明為什麼只有這兩個選項（資訊從哪裡來）
  - 確認被排除的選項真的不行
  - 結論只說到前提支持的範圍
terms: [ disjunction, premise ]
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "論證、演繹有效性與歸納強度的區分；本題情境是虛構的借用安排，前提由題幹給定。"
contributors: []
aiAssisted: true
requiresSecondReview: false
status: draft
reviewers: []
updated: 2026-09-28
nextSteps:
  - 人工確認正解：題幹的兩個選項是否確實窮盡，是否有人會合理地選「假兩難」
  - 核對來源 OpenStax 5.3 是否支持 supports 所寫範圍
  - 至少一位試讀者試讀，記錄看不懂或可能有第二個正解的地方（ADR-0027 Review Point）
  - 轉入前確認日常主題對照題比例仍在 15%–30%
---

## 情境

> 讀書會幹部在群組說明：「管理室回覆，下週六活動中心只開放上午和下午兩個時段借用，晚上不開放。上午已經被另一個社團登記了，登記表上看得到。所以我們如果要在下週六借活動中心，只剩下午可以借。」

## 解說

這段推理**沒有問題**。幹部說明了為什麼只有兩個選項（管理室只開放這兩個時段），也說明了為什麼上午不行（登記表上已有社團），結論也只說「要借活動中心的話」只剩下午。

只有兩個選項，不一定就是假兩難。要看的是：這兩個選項是不是真的涵蓋了所有可能，以及被排除的那個是不是真的不行。

## 進階解說

這是[[disjunction]]推理的「刪去法」：P 或 Q；P 不成立，所以 Q。形式有效，結論是否可信，取決於兩個[[premise]]：只有兩個時段、上午確實已被借走。

如果幹部改說「所以讀書會只能下午辦」，就可能變成假兩難，因為換日期、換場地也是選項。能看出結論說到哪裡為止，就不會因為看到「只剩」兩個字就急著貼上謬誤標籤。
