import { markdownToHtml } from 'satteri';
import { describe, expect, it } from 'vitest';
import {
  ecologicAdvanced,
  ecologicExternalLinks,
  ecologicTerms,
  splitTermMarkers,
  type TermInfo,
} from '../../src/lib/markdown-ecologic.ts';

const terms = new Map<string, TermInfo>([
  ['premise', { term: '前提', en: 'Premise', definition: '支持結論的陳述。' }],
]);

const render = (md: string): string => {
  const result = markdownToHtml(md, {
    hastPlugins: [ecologicTerms(terms), ecologicExternalLinks, ecologicAdvanced],
  });
  // 外掛都是同步的，結果不會是 Promise
  if (result instanceof Promise) throw new Error('unexpected async markdown result');
  return result.html;
};

describe('term markers', () => {
  it('opens external Markdown links separately while preserving internal navigation', () => {
    const html = render('[外站](https://example.org/) [本站](/about/)');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('外站（另開視窗）');
    expect(html).toContain('<a href="/about/">本站</a>');
  });
  it('turns [[id]] into a popover button with the term name, keeping surrounding text', () => {
    const html = render('先確認[[premise]]是否成立。');
    expect(html).toContain('先確認<span class="term">');
    expect(html).toContain(
      '<button type="button" class="term-trigger" popovertarget="term-premise-1">前提</button>',
    );
    expect(html).toContain('<span id="term-premise-1" popover="auto" class="term-popover">');
    expect(html).toContain('支持結論的陳述。');
    expect(html).toContain('<a href="/terms/#premise">');
    expect(html).toContain('popovertargetaction="hide"');
    expect(html).toContain('</span>是否成立。');
  });

  it('uses a custom label and gives each occurrence its own id', () => {
    const html = render('[[premise|這些理由]]與[[premise]]');
    expect(html).toContain('popovertarget="term-premise-1">這些理由</button>');
    expect(html).toContain('popovertarget="term-premise-2">前提</button>');
  });

  it('restarts numbering for every document', () => {
    render('[[premise]]');
    expect(render('[[premise]]')).toContain('term-premise-1');
  });

  it('leaves code untouched', () => {
    expect(render('`[[premise]]`')).toContain('<code>[[premise]]</code>');
  });

  it('fails on an unknown term id', () => {
    expect(() => render('[[nope]]')).toThrow(/nope/);
  });

  it('returns null when there is nothing to replace', () => {
    expect(splitTermMarkers('沒有標記', terms, () => 'x', 'f')).toBeNull();
    expect(splitTermMarkers('[[不是 id]]', terms, () => 'x', 'f')).toBeNull();
  });
});

describe('advanced section', () => {
  it('wraps ## 進階 until the next h2 in <details>, keeping inline markup', () => {
    const html = render(
      '## 說明\n\n甲\n\n## 進階\n\n**粗** 與 [連結](/x/)\n\n- 一\n- 二\n\n## 其他\n\n乙',
    );
    expect(html).toMatch(
      /<details class="advanced"><summary>進階<\/summary>\s*<p><strong>粗<\/strong> 與 <a href="\/x\/">連結<\/a><\/p>\s*<ul>[\s\S]*<\/ul>\s*<\/details><h2>其他<\/h2>/,
    );
  });

  it('keeps term popovers inside the advanced section', () => {
    const html = render('## 進階\n\n看[[premise]]');
    expect(html).toMatch(/<details class="advanced">[\s\S]*popovertarget="term-premise-1"/);
  });

  it('wraps to the end when 進階 is last, and does nothing without it', () => {
    expect(render('## 進階\n\n乙')).toMatch(
      /<details class="advanced">[\s\S]*乙[\s\S]*<\/details>\s*$/,
    );
    expect(render('## 說明\n\n甲')).not.toContain('<details');
  });
});
