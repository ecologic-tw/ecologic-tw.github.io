import { expect, it } from 'vitest';
import { isToolKind, ownedTools } from '../../src/lib/toolbox.ts';

it('only fallacy and bias cards carry a response tool (ADR-0037)', () => {
  expect(isToolKind('informal-fallacy')).toBe(true);
  expect(isToolKind('formal-fallacy')).toBe(true);
  expect(isToolKind('bias')).toBe(true);
  expect(isToolKind('concept')).toBe(false);
  expect(isToolKind('inference')).toBe(false);
});

it('keeps only lit cards, in the tool list order', () => {
  const tools = ['straw-man', 'ad-hominem', 'false-dilemma'];
  expect(ownedTools(tools, new Set(['false-dilemma', 'straw-man', 'modus-ponens']))).toEqual([
    'straw-man',
    'false-dilemma',
  ]);
  expect(ownedTools(tools, new Set())).toEqual([]);
});
