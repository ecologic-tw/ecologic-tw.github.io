import { describe, expect, it } from 'vitest';
import { SECTIONS, splitSections, validateScenarioBody } from '../../src/lib/scenario-sections.ts';

const body = [
  '## 情境',
  '情境文字',
  '',
  '## 解說',
  '解說文字',
  '',
  '## 換個位置想',
  '提問與參考想法',
].join('\n');

describe('scenario sections', () => {
  it('splits the optional perspective section (ADR-0029)', () => {
    const sections = splitSections(body);
    expect(sections.get(SECTIONS.perspective)).toBe('提問與參考想法');
    expect(sections.get(SECTIONS.explanation)).toBe('解說文字');
  });

  it('keeps the perspective section optional', () => {
    expect(validateScenarioBody('## 情境\n情境文字\n\n## 解說\n解說文字\n')).toEqual([]);
  });

  it('still requires the situation and explanation', () => {
    expect(validateScenarioBody('## 情境\n情境文字\n\n## 換個位置想\n想法\n')).toEqual([
      '本文: 請補「## 解說」及非空白內容',
    ]);
  });
});
