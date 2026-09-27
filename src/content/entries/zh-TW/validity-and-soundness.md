---
id: validity-and-soundness
kind: concept
title: 有效與健全
en: Validity and soundness
summary: 有效看推理形式，健全還要前提為真；推理錯不代表結論錯。
quickCheck:
  question: '「所有鳥都會飛；企鵝是鳥；所以企鵝會飛。」這個論證是？'
  options:
    - '有效且健全'
    - '有效但不健全'
    - '無效'
  answer: 1
  explanation: '如果前提都為真，結論就必然為真，所以形式有效。但「所有鳥都會飛」是假的，因此不健全，結論也剛好是假的。'
related: [ proposition-and-truth-value, modus-ponens, fallacy-fallacy ]
terms: [ validity, soundness, premise, conclusion, argument ]
status: draft
reviewers: []
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹有效性與健全性的定義，以及有效性與前提真假的區分。"
  - title: "Beall, J., Restall, G., & Sagi, G. Logical Consequence. Stanford Encyclopedia of Philosophy."
    url: https://plato.stanford.edu/entries/logical-consequence/
    supports:
      - "邏輯後承（有效性）指前提為真時結論不可能為假。"
updated: 2026-09-27
aiAssisted: true
---

## 說明

邏輯最關心的不是「結論對不對」，而是「結論有沒有被前提撐住」。

- **[[validity|有效]]**：如果前提全部為真，結論就**不可能**為假。有效只看推理形式，不管前提實際上是真是假。
- **[[soundness|健全]]**：有效，**而且**前提實際上都為真。健全的論證，結論一定為真。

所以一個論證可能：有效但前提有假（不健全）；前提都真但推理無效；或兩者都有問題。

## 生活例子

> 「如果今天是週末，圖書館就休館。今天是週末。所以圖書館休館。」

形式有效。是否健全，要看「週末一定休館」是不是真的。很多爭論其實不在推理，而在前提。

## 保育例子

> 「外來種都會危害原生生態系；這種魚是外來種；所以牠會危害原生生態系。」

形式有效，但第一個前提太絕對：許多外來種沒有造成明顯危害，也有些影響尚待研究。要討論的是前提，而不是推理。

反過來，推理無效也不代表結論錯。有人用錯誤的理由支持「應該保護這片濕地」，結論仍可能有其他好理由支持，見[謬誤謬誤](/guide/fallacy-fallacy/)。

## 常見誤解

- **「有效就是對的。」**有效只保證「前提真 → 結論真」，前提錯時，結論可能錯。
- **「結論是真的，所以推理沒問題。」**無效的推理也可能碰巧得到真的結論。

## 進階

有效性是演繹推理的標準。[[induction|歸納]]推理不追求「不可能為假」，而是看前提讓結論變得多可信，常用「強／弱」與「可靠」（cogent）來評估。
