// 討論引導卡（ADR-0033）：本文固定正反兩面，列印時反面從新的一頁開始。
// 引導卡只放摘要，定義以圖鑑卡為準，因此檢查 /guide/<id>/ 連結都指向存在的卡。
import { splitSections } from './scenario-sections.ts';

export const TOOLKIT_SECTIONS = {
  front: '正面：回應之前',
  back: '反面：分歧在哪裡',
} as const;

/** 兩面都必須存在且非空白 */
export function validateToolkitBody(body: string): string[] {
  const sections = splitSections(body);
  return Object.values(TOOLKIT_SECTIONS)
    .filter((name) => !sections.get(name)?.trim())
    .map((name) => `本文: 請補「## ${name}」及非空白內容`);
}

const GUIDE_LINK = /\]\(\/guide\/([a-z0-9-]+)\/\)/g;

/** 本文中連到圖鑑卡的 id（Markdown 連結 `](/guide/<id>/)`） */
export function guideLinkIds(body: string): string[] {
  return [...body.matchAll(GUIDE_LINK)].map((m) => m[1] ?? '');
}
