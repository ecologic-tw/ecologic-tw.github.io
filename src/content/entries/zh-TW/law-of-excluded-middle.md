---
id: law-of-excluded-middle
kind: law
title: 排中律
en: Law of excluded middle
summary: 一個命題和它的否定，至少有一個成立，不會有第三種可能。
form: 'P ∨ ¬P'
quickCheck:
  question: '下列哪一組，才是「兩者必有一個成立」的排中律？'
  options:
    - '「這台相機今天有拍到動物」或「這台相機今天沒拍到動物」'
    - '「你支持這個計畫」或「你反對這個計畫」'
    - '「這隻鳥是白鷺」或「這隻鳥是黑面琵鷺」'
  answer: 0
  explanation: '排中律談的是一個命題和它的否定。「支持」的否定是「不支持」，還包括沒意見；鳥也可能是其他種類。把後兩組當成排中律，就會變成假兩難。'
related: [ false-dilemma, law-of-non-contradiction, disjunctive-syllogism ]
terms: [ proposition, negation, disjunction ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: Stanford Encyclopedia of Philosophy — Intuitionistic Logic
    url: https://plato.stanford.edu/entries/logic-intuitionistic/
updated: 2026-09-26
aiAssisted: true
---

## 說明

對任何一個清楚的[[proposition]] P，「P」和「非 P」一定有一個成立。例如「這台相機今天有拍到動物」和「這台相機今天沒拍到動物」，一定有一個是真的。

要特別注意：排中律說的是 P 與**它的[[negation]]**，不是任意兩個選項。

## 生活例子

「這份報告交了」或「這份報告沒交」，一定有一個成立，這是排中律。

但「你不是支持，就是反對」**不是**排中律。「支持」的否定是「不支持」，而「不支持」還包括沒意見、部分支持、還在考慮。把兩個對立的選項當成唯一可能，就變成了假兩難。

## 保育例子

> 「這區到底有沒有記錄到石虎？」

「有記錄」與「沒有記錄」一定有一個成立，這是可以直接回答的問題。

> 「你要嘛站在石虎這邊，要嘛站在農民這邊。」

這就不是排中律了。同時關心石虎與農民生計的立場，完全可能存在。

## 何時合理

當兩個選項確實是「P」與「非 P」，而且 P 的意思清楚時，用排中律推理是可靠的。如果詞彙模糊（例如「這片地算不算森林」），要先把標準講清楚。

## 進階

形式寫成 P ∨ ¬P，屬於[[disjunction]]的一種。古典邏輯接受它為恆真式。

直覺主義邏輯（intuitionistic logic）不把排中律當作普遍成立：它要求能構造出 P 或 ¬P 的證明，才承認 P ∨ ¬P。另外，對「高」「老」這類模糊謂詞，排中律如何適用也有哲學上的討論。
