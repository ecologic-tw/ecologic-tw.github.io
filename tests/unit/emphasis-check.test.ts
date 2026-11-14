import { describe, expect, it } from 'vitest';
import { findLiteralBold } from '../../src/lib/emphasis-check.ts';

describe('findLiteralBold', () => {
  it('passes bold that ends with punctuation inside quotes', () => {
    // 2026-09 交接紀錄曾懷疑這種寫法不會變粗體；Sätteri 0.10／0.11 都會正確轉成 <strong>
    expect(findLiteralBold('他說「**理解就是同意。**」然後')).toEqual([]);
    expect(findLiteralBold('「**要有勇氣運用你自己的理智！**」這是')).toEqual([]);
    expect(findLiteralBold('「**理解就是同意**。」')).toEqual([]);
  });

  it('reports bold markers that stay literal next to CJK punctuation', () => {
    expect(findLiteralBold('他**「理解。」**他')).toEqual(['他**「理解。」**他']);
    expect(findLiteralBold('他說**你好。**然後')).toEqual(['他說**你好。**然後']);
  });

  it('ignores ** inside inline code', () => {
    expect(findLiteralBold('用 `**粗體**` 標記')).toEqual([]);
  });
});
