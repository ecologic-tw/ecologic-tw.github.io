---
id: modus-tollens
kind: inference
title: 否定後件
en: Modus tollens
summary: 如果 P 就 Q；Q 不成立，所以 P 不成立。
form: 'P → Q, ¬Q ∴ ¬P'
pairWith: denying-the-antecedent
quickCheck:
  question: '「假設系統規則可靠：如果申請成功送出，就會顯示申請編號。現在沒有顯示申請編號。」可以推出什麼？'
  options:
    - '申請已成功送出'
    - '申請沒有成功送出'
    - '沒辦法確定'
  answer: 1
  explanation: '在題幹假設下，沒有編號（非 Q）可推出未成功送出（非 P）。真實使用時仍須排除顯示故障，確認條件句可靠。'
related: [ modus-ponens ]
terms: [ conditional, consequent, negation, validity, soundness ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "OpenStax — Introduction to Philosophy, 5.3 Arguments"
    url: https://openstax.org/books/introduction-philosophy/pages/5-3-arguments
    supports:
      - "演繹有效性與前提真假的區分；來源不是虛構例子的事實紀錄。"
  - title: "MacKenzie et al. (2002). Estimating site occupancy rates when detection
      probabilities are less than one. Ecology 83, 2248–2255."
    url: https://pubs.usgs.gov/publication/5224176
    supports:
      - "偵測率小於一時，未偵測到不代表不存在；非本情境虛構調查的資料來源。"
updated: 2026-09-26
aiAssisted: true
---

## 說明

有一個[[conditional]]「如果 P，那麼 Q」，又知道[[consequent]] Q 不成立，就可以推出 P 也不成立。這也是[[validity|有效]]推論，常用來檢驗一個說法：若它成立，應該會看到某個結果；沒看到，就表示說法有問題。

## 生活例子

> 假設系統規則可靠：如果申請成功送出，頁面就會顯示申請編號。
>
> 頁面沒有顯示申請編號。
>
> 所以，申請沒有成功送出。

## 保育例子

> 如果這片林地有石虎活動，自動相機就一定會拍到。
>
> 相機架了三個月，一張都沒拍到。
>
> 所以，這片林地沒有石虎活動。

形式完全有效，但第一句值得懷疑：相機只涵蓋小範圍，動物可能剛好沒經過鏡頭。結論是否可信，取決於「一定會拍到」這個前提成不成立。

## 何時合理

條件句要真的可靠。沒拍到動物時，要先知道調查的偵測能力；僅憑三個月未拍到，甚至不能直接判定出現機會低。系統申請的例子也須排除顯示故障。

## 進階

形式：P → Q, ¬Q ∴ ¬P，符號 ¬ 表示[[negation]]。科學上的「可否證性」檢驗常借用這個形式：理論預測 Q，觀察到非 Q，理論就需要修正。實務上，因為前提常包含輔助假設（例如「相機運作正常」），被否定的可能是輔助假設而不是理論本身。
