import { describe, expect, it } from 'vitest';
import { brokenDocLinks, relativeTargets } from '../../src/lib/doc-links.ts';

describe('relativeTargets', () => {
  it('resolves relative links and ignores external, site-absolute and anchor links', () => {
    const targets = relativeTargets({
      path: 'docs/sdd/03.md',
      text: [
        '[ADR](../adr/0001.md#背景)',
        '[外部](https://example.org/a.md)',
        '[站內](/guide/)',
        '[錨點](#段落)',
        '![圖](image.png)',
        '[中文](../%E6%8C%87%E5%BC%95.md)',
      ].join('\n'),
    });
    expect(targets.map((t) => t.target)).toEqual(['docs/adr/0001.md', 'docs/指引.md']);
  });

  it('skips links inside code', () => {
    const text = '`[a](missing.md)`\n```md\n[b](missing.md)\n```';
    expect(relativeTargets({ path: 'README.md', text })).toEqual([]);
  });
});

describe('brokenDocLinks', () => {
  it('reports only targets that do not exist', () => {
    const exists = (path: string) => path === 'docs/adr/0001.md';
    const errors = brokenDocLinks(
      [{ path: 'docs/sdd/03.md', text: '[ok](../adr/0001.md) [bad](../adr/9999.md)' }],
      exists,
    );
    expect(errors).toEqual(['docs/sdd/03.md: 連結「../adr/9999.md」指向不存在的檔案']);
  });
});
