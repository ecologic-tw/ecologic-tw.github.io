---
title: 校外教學取消了
theme: daily
format: choice
task: form
prompt: 班長的推理符合下列哪一個形式？
choices:
  - text: 如果 P，就 Q；Q 成立；所以 P 成立。
    correct: true
    note: P 是「颱風要來」，Q 是「校外教學取消」。從「Q 成立」推回「P 成立」是肯定後件，這個形式無效。
  - text: 如果 P，就 Q；P 成立；所以 Q 成立。
    note: 這是肯定前件，形式有效；但班長是從「取消了」往回推，不是從「颱風來了」往下推。
  - text: 如果 P，就 Q；Q 不成立；所以 P 不成立。
    note: 這是否定後件，形式有效；但題幹裡的 Q（取消）是成立的，不是不成立。
  - text: P 或 Q；P 不成立；所以 Q 成立。
    note: 這是選言三段論；班長的話裡沒有「或」的前提。
difficulty: advanced
form: 'P → Q，Q ⊢ P（無效）'
terms: [ conditional, antecedent, consequent ]
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "論證、演繹有效性與歸納強度的區分；虛構情境的前提須另行查證。"
contributors: []
aiAssisted: true
requiresSecondReview: false
status: draft
reviewers: []
updated: 2026-09-27
nextSteps: []
promotedTo: daily-017
---

## 情境

> 班長：「如果颱風要來，校外教學就會取消。學校剛剛公告校外教學取消了，所以一定是颱風要來了。」

## 解說

把班長的話拆開：[[conditional]]是「如果颱風要來（P），校外教學就會取消（Q）」，接著觀察到「校外教學取消了（Q）」，就推出「颱風要來（P）」。這是[肯定後件](/guide/affirming-the-consequent/)的形式：從[[consequent]]成立，往回推[[antecedent]]成立。

這個形式無效，因為校外教學也可能因為其他原因取消，例如場地臨時不能用、人數不足。颱風也許真的要來，但光從「取消了」推不出來。

## 進階解說

辨識形式時，先把句子換成 P、Q，再看推論的方向：從 P 推 Q（肯定前件）、從非 Q 推非 P（否定後件）是有效的；從 Q 推 P（肯定後件）、從非 P 推非 Q（否定前件）則無效。
