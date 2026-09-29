// 多方觀點案例（ADR-0036）：本文固定「背景」與「換個位置想」兩段；小題是以 case 欄位指向案例的情境題。
import { splitSections } from './scenario-sections.ts';

export const CASE_SECTIONS = {
  background: '背景',
  perspective: '換個位置想',
} as const;

/** 兩段都必須存在且非空白；「換個位置想」是全部小題答完後的收尾 */
export function validateCaseBody(body: string): string[] {
  const sections = splitSections(body);
  return Object.values(CASE_SECTIONS)
    .filter((name) => !sections.get(name)?.trim())
    .map((name) => `本文: 請補「## ${name}」及非空白內容`);
}

/** 案例的小題，依題號排序（即作答順序） */
export function caseQuestions<T extends { id: string; data: { case?: string } }>(
  caseId: string,
  scenarios: readonly T[],
): T[] {
  return scenarios.filter((s) => s.data.case === caseId).sort((a, b) => a.id.localeCompare(b.id));
}
