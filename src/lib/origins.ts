// 思想源流（ADR-0039）：思想家的一個想法，接到相關圖鑑卡。本文固定三段，都必填。
import { splitSections } from './scenario-sections.ts';

export const ORIGIN_SECTIONS = {
  text: '原典怎麼說',
  relation: '和這張卡的關係',
  misreading: '常見誤讀',
} as const;

/** 三段都必須存在且非空白 */
export function validateOriginBody(body: string): string[] {
  const sections = splitSections(body);
  return Object.values(ORIGIN_SECTIONS)
    .filter((name) => !sections.get(name)?.trim())
    .map((name) => `本文: 請補「## ${name}」及非空白內容`);
}
