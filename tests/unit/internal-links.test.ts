// Issue #41：建置產物的站內連結檢查。第一版只確認頁面或檔案存在，不檢查錨點。
import { describe, expect, it } from 'vitest';
import { checkInternalLinks, type DistPage } from '../../src/lib/internal-links.ts';

const SITE = 'https://ecologic-tw.github.io';
const files = new Set([
  '/index.html',
  '/guide/index.html',
  '/guide/straw-man/index.html',
  '/scenario/cons-014/index.html',
  '/terms/index.html',
  '/social-card.png',
]);
const page = (path: string, ...hrefs: string[]): DistPage => ({
  path,
  html: `<html><body>${hrefs.map((h) => `<a class="x" href="${h}">連結</a>`).join('')}</body></html>`,
});
const check = (...pages: DistPage[]) => checkInternalLinks(pages, files, SITE);

describe('checkInternalLinks', () => {
  it('accepts links whose target page or file exists', () => {
    expect(
      check(
        page(
          '/scenario/cons-014/',
          '/guide/straw-man/',
          '/terms/?q=1#premise',
          `${SITE}/guide/`,
          '../../guide/straw-man/',
          '/social-card.png',
          '#main',
        ),
      ),
    ).toEqual([]);
  });

  it('skips external links and other schemes', () => {
    expect(
      check(
        page(
          '/',
          'https://plato.stanford.edu/entries/fallacies/',
          'mailto:someone@example.com',
          'tel:0200000000',
        ),
      ),
    ).toEqual([]);
  });

  it('fails when the source page exists but the linked page was not built (a card reverted to draft)', () => {
    const errors = check(page('/scenario/cons-014/', '/guide/argument-from-ignorance/'));
    expect(errors).toEqual([
      '/scenario/cons-014/：站內連結目標不存在\n  href="/guide/argument-from-ignorance/"（可能是被引用的內容退回草稿或下架，見 docs/review/review-guide.md「退回審核或暫緩發布」）',
    ]);
  });

  it('resolves relative links against the source page', () => {
    expect(check(page('/scenario/cons-014/', '../../guide/missing/')).join()).toMatch(
      /目標不存在[\s\S]*\.\.\/\.\.\/guide\/missing\//,
    );
  });

  it('reports a missing downloadable file', () => {
    expect(check(page('/', '/missing.pdf')).join()).toMatch(/目標不存在/);
  });

  it('reports page links without the trailing slash', () => {
    expect(check(page('/', '/guide/straw-man')).join()).toMatch(
      /缺少結尾斜線[\s\S]*\/guide\/straw-man\//,
    );
  });

  it('decodes HTML entities in the href', () => {
    expect(check(page('/', '/terms/?a=1&amp;b=2'))).toEqual([]);
  });

  it('checks only that the page exists, not the #fragment (anchors are out of scope)', () => {
    expect(check(page('/', '/guide/straw-man/#no-such-heading'))).toEqual([]);
  });

  it('reports each broken href once per page', () => {
    expect(check(page('/', '/guide/gone/', '/guide/gone/'))).toHaveLength(1);
  });

  it('only reads double-quoted <a href> attributes', () => {
    const html = `<link rel="canonical" href="/nowhere/"><img src="/nowhere.png"><a href='/single-quoted/'>x</a>`;
    expect(checkInternalLinks([{ path: '/', html }], files, SITE)).toEqual([]);
  });
});
