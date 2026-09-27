---
title: 四點八顆星
theme: daily
format: choice
task: hidden-premise
prompt: 這段推理沒有說出口、但必須成立的前提是？
choices:
  - text: 評價高的店，東西就好吃。
    correct: true
    note: 要從「評價高」推到「好吃」，需要這個前提把兩者連起來。它不一定成立：評分也會受服務、價格、環境，甚至刷評影響。
  - text: 好吃的店，評價一定高。
    note: 這是把方向反過來的說法（逆）。就算它成立，也不能從「評價高」推出「好吃」。
  - text: 這家店的價格很便宜。
    note: 論證沒有用到價格；補上這句，也推不出「東西好吃」。
difficulty: advanced
terms: [ premise, conclusion, principle-of-charity ]
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "論證由前提與結論組成，以及前提如何支持結論；是否直接討論「隱藏前提」尚未逐字核對，審核時請確認。"
contributors: []
aiAssisted: true
requiresSecondReview: false
status: draft
reviewers: []
updated: 2026-09-27
nextSteps: []
promotedTo: daily-014
---

## 情境

> 同事：「這家店在網路上有四點八顆星，所以它的東西一定很好吃。」

## 解說

同事的[[premise]]只有「評價四點八顆星」，[[conclusion]]卻是「東西一定很好吃」。要讓前提撐得起結論，中間還需要一句沒說出口的話：「評價高的店，東西就好吃。」

把這句話說出來，就比較容易檢查：評分反映的可能是服務、價格、環境，也可能有刷評；而且每個人的口味不同。這不代表評價沒有參考價值，只是「一定很好吃」比證據說得更強。

「好吃的店，評價一定高」是把條件反過來。就算它是真的，也幫不了這個推論，詳見[條件句的四種變形](/guide/conditional-variants/)。

## 進階解說

日常論證常省略前提，這種論證在傳統邏輯裡叫做省略三段論。找出隱藏前提有兩個用處：一是看清楚論證真正依賴什麼；二是讓討論聚焦在那個前提上，而不是直接否定結論。補前提時要依[[principle-of-charity|善意原則]]，補上能讓論證成立、又最合理的那一句。
