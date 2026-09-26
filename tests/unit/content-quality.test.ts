import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/load-content.ts';
import { makeQualityReport, readingText, textLength } from '../../src/lib/content-quality.ts';
import { canonicalUrl, sitemapXml } from '../../src/lib/site.ts';

describe('content quality reporting', () => {
  it('handles an empty collection without misleading percentages', () => {
    const report = makeQualityReport({ entries: [], scenarios: [], terms: [] });
    expect(report.scopes.all?.withSources.percent).toBeNull();
  });
  it('counts distinct reviewers case-insensitively and separates published coverage', () => {
    const input = loadContent('tests/fixtures/content-valid');
    input.terms = [
      {
        file: 'terms',
        body: '',
        data: {
          id: 'sample',
          term: '樣本',
          en: 'sample',
          definition: '說明',
          status: 'draft',
          updated: '2026-09-27',
          reviewers: ['Alice', 'alice'],
          aiAssisted: true,
        },
      },
    ];
    const report = makeQualityReport({ ...input, entries: [], scenarios: [] });
    expect(report.scopes.all?.twoReviewers.count).toBe(0);
    expect(report.scopes.reviewed?.total).toBe(0);
    expect(report.scopes.all?.aiAssisted.percent).toBe(100);
  });
  it('counts visible Chinese labels and excludes link destinations and headings', () => {
    const text = readingText(
      '## 標題\n[[premise]] [資料](https://example.org/long-url) **你好**',
      new Map([['premise', '前提']]),
    );
    expect(textLength(text)).toBe(6);
    expect(textLength('𠮷 字')).toBe(2);
  });
  it('reports excessive advanced content without changing review status', () => {
    const input = loadContent();
    const entry = input.entries[0];
    if (!entry) throw new Error('Missing entry fixture');
    entry.body = `## 基礎\n短句。\n## 進階\n${'文'.repeat(1000)}。`;
    const report = makeQualityReport(input);
    expect(
      report.reading.find((r) => r.id === (entry.data as { id: string }).id)?.warnings,
    ).toContain('進階 1001 字元超過 900');
  });
});

describe('search metadata', () => {
  it('uses the official origin and discards query strings and fragments', () => {
    expect(canonicalUrl('/guide/test?mode=advanced#term')).toBe(
      'https://ecologic-tw.github.io/guide/test/',
    );
    expect(canonicalUrl('https://example.com/about/')).toBe('https://ecologic-tw.github.io/about/');
  });
  it('deduplicates and escapes sitemap URLs', () => {
    const xml = sitemapXml(['/a&b/', '/a&b/']);
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain('/a&amp;b/');
  });
});
