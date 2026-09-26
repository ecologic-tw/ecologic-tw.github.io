---
id: cons-008
theme: conservation
title: 動物通道有沒有用
isControl: true
answer: none
distractors: [ correlation-causation, hasty-generalization, confirmation-bias ]
difficulty: basic
betterPhrasing:
  - 「前後比較並加入對照路段後，結果提供這組通道與圍籬措施可能有效的證據，但仍要檢查其他差異，持續監測。」
checklist:
  - 有對照組可以比較
  - 交代已比較的條件，以及尚未控制的因素
  - 結論保持暫定，不把觀察性比較當成因果證明
terms: [ correlation, causation, confounder ]
status: reviewed
reviewers:
  - Wang-Yi-Zhang
sources:
  - title: "Howards et al. (2012). Toward a Clearer Definition of Confounding
      Revisited With Directed Acyclic Graphs."
    url: https://pmc.ncbi.nlm.nih.gov/articles/PMC3530354/
    supports:
      - "混淆不能只用表面相關判定，需依因果結構評估調整；不能宣稱配對排除所有混淆。"
  - title: "Rytwinski et al. (2016). How Effective Is Road Mitigation at Reducing
      Road-Kill? A Meta-Analysis. PLOS ONE 11, e0166941."
    url: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0166941
    supports:
      - "評估道路減輕措施需考慮圍籬、物種與前後對照設計；不能把措施組合效果歸給單一通道。"
updated: 2026-09-26
aiAssisted: true
---

## 情境

> 研究報告摘要：「我們在設施施工前先記錄兩組路段的路殺與車流，再讓其中一組增設動物通道及引導圍籬。依已量測的車流與周邊環境選擇相近的對照路段，兩組使用相同巡查方式。後續三年的記錄中，設施組路殺減少，對照組沒有相同變化。這提供這組措施可能有幫助的證據；但未量測的差異、其他道路工程與動物數量變化仍需確認，目前不能確定因果或分開估計通道和圍籬的效果。」

## 解說

這段推理**沒有問題**，因為結論只是附有限制的證據判斷。路段與數字是虛構教學設定。

加入施工前資料與條件相近的對照路段，比只看單一路段前後變化更有助於評估因果解釋；但配對只處理已量測的部分條件，不能宣稱排除了所有[[confounder]]。

題幹主動保留其他解釋，也沒有把[[correlation]]直接等同於已確定的[[causation]]。還要核對巡查努力、動物通道使用情況、周邊工程等，才能評估結論多可靠。真實研究的成效不可直接套用到所有物種或路段。
