---
id: argument-from-ignorance
kind: informal-fallacy
title: 訴諸無知
en: Argument from ignorance
summary: 因為沒被證明是真的，就說它是假的；或沒被證明是假的，就說它是真的。
notFallacyWhen: 如果已經做過足以發現它的調查，「應該找得到卻沒找到」就能合理地支持「可能不存在」；在事先約定舉證責任的場合（如無罪推定），以「未被證明」作為決定依據也是合理的。
charitableResponse: 「目前還沒找到，是因為真的沒有，還是因為我們還沒用對方法找？我們的調查有多大機會發現它？」
quickCheck:
  question: '「這份報告沒提到任何副作用，所以這個產品沒有副作用。」這個推論的問題是？'
  options:
    - '報告沒提到，不等於沒有；要看報告有沒有調查副作用'
    - '推論沒問題，沒提到就是沒有'
    - '產品一定有副作用'
  answer: 0
  explanation: '「沒提到」可能是真的沒有，也可能是沒調查或沒記錄。第三個選項則走向另一個極端，同樣缺乏證據。'
related: [ modus-tollens, hasty-generalization, conditional-variants ]
terms: [ burden-of-proof, sample, fallacy ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "Walton, D. (1996). Arguments from Ignorance. Pennsylvania State
      University Press."
    supports:
      - "訴諸無知在何種條件下是謬誤、何種條件下是合理的推定推理（知識完備條件、舉證責任）。"
  - title: "MacKenzie et al. (2002). Estimating site occupancy rates when detection
      probabilities are less than one. Ecology 83, 2248–2255."
    url: https://pubs.usgs.gov/publication/5224176
    supports:
      - "偵測率小於一時，未偵測到不代表不存在；非本情境虛構調查的資料來源。"
updated: 2026-09-27
aiAssisted: true
---

## 說明

「沒有證據證明 X」和「有證據證明不是 X」是兩件不同的事。訴諸無知把「還不知道」當成「已經知道答案」，有兩個方向：

- 沒被證明為真 → 所以是假的。
- 沒被證明為假 → 所以是真的。

## 生活例子

> 「沒有人證明這個保健食品無效，所以它一定有效。」

沒證明無效，可能只是還沒人好好研究過。要主張有效，提出主張的一方有[[burden-of-proof]]。

## 保育例子

> 「架了幾週的相機都沒拍到，這裡已經沒有這種動物了。」

野生動物調查中，沒偵測到（偵測率低、調查時間短、相機位置不對）不等於不存在。

支持保育的一方也可能犯同樣的錯：

> 「沒有人能證明這個開發案不會傷害生態，所以它一定會造成嚴重傷害。」

「無法排除風險」可以是要求更多調查、或採取預防措施的理由；但要主張「一定會造成嚴重傷害」，仍需要證據。

## 何時合理

當調查設計足以發現目標，「應該找得到卻沒找到」就是有分量的證據。例如偵測率已知、調查努力量充足、方法適合目標物種。這時說「很可能不存在」是合理推論，只是仍要說明不確定性。

## 善意回應法

「我同意目前沒有紀錄。我們一起看看：如果牠在這裡，這樣的調查有多大機會拍到？」

## 進階

Walton 把合理的無知論證寫成「如果 A 為真，我們應該會知道；我們不知道 A；所以 A 可能為假」。它看起來像[否定後件](/guide/modus-tollens/)，但並不相同：否定後件需要「只要 A 為真，我們就**一定**會知道」這個前提，才能推出必然的「A 為假」；無知論證的前提只是「應該會知道」，結論也只能是「可能為假」，屬於可以被新證據推翻的推定推理。

關鍵在第一個前提：我們的調查或知識有多完備。生態學的佔據模型（occupancy model）用重複調查估計偵測率，評估「沒偵測到」能提供多少證據；這仍是機率性的判斷，不是演繹的必然。
