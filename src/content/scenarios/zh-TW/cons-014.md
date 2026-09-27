---
title: 工區裡沒有鳥巢
theme: conservation
format: validity-soundness
validity: valid
premises: uncertain
notes:
  validity: 如果「只有在工區內築巢的鳥類會受影響」和「工區內沒有鳥巢」都為真，結論「不會影響鳥類」就一定為真，所以推理形式有效。
  premises: 第一個前提是很強的主張，題幹沒有提出支持它的證據；第二個前提取決於調查能不能發現鳥巢。只看題幹，無法判斷兩個前提是否可信。
difficulty: advanced
betterPhrasing:
  - 「調查期間，工區內沒有發現鳥巢。至於工程會不會影響周邊的鳥類，我們還需要評估噪音、光線和覓食範圍等影響，會再補充這部分的資料。」
checklist:
  - 說明結論依賴哪些前提
  - 對還不確定的前提，提出查證的方法
  - 結論的強度和證據相符
terms: [ validity, soundness, premise ]
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹有效性與健全性的定義，以及有效性與前提真假的區分。"
  - title: "MacKenzie et al. (2002). Estimating site occupancy rates when detection
      probabilities are less than one. Ecology 83, 2248–2255."
    url: https://pubs.usgs.gov/publication/5224176
    supports:
      - "偵測率小於一時，未偵測到不代表不存在；本題的工程與調查是虛構設定。"
contributors: []
aiAssisted: true
requiresSecondReview: false
status: draft
reviewers: []
updated: 2026-09-27
id: cons-014
isControl: false
---

## 情境

> 開發單位的顧問：「會受到工程影響的，只有在工區內築巢的鳥類。調查期間，工區內沒有發現任何鳥巢。所以，這項工程不會影響鳥類。」

## 解說

先看形式：假設兩個前提都為真，結論就一定為真，所以這個推理[[validity|有效]]。

再看前提：「只有在工區內築巢的鳥類會受影響」是很強的主張，題幹沒有說明根據；「工區內沒有發現鳥巢」則取決於調查的方法、季節和次數，沒發現不一定代表沒有。[[premise|前提]]是否可信，無法只從這段話判斷，因此也還不能說這個論證[[soundness|健全]]。

有效不等於結論為真。要評估這個結論，討論的重點應該放在這兩個前提需要哪些證據，而不是推理形式。

## 進階解說

這個論證的形式是：「只有 A 會受影響；沒有 A；所以沒有東西受影響。」形式本身沒有問題，所以反駁時如果只說「推理錯了」，反而會失焦。更有效的回應是指出哪個前提需要證據、可以怎麼查證。第二個前提也和[訴諸無知](/guide/argument-from-ignorance/)有關：調查沒發現，要看調查有多大機會發現。
