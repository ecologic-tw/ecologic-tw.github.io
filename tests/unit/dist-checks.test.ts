import { describe, expect, it } from 'vitest';
import { CSP } from '../../src/lib/csp.ts';
import { checkHtml } from '../../src/lib/dist-checks.ts';

const head = `<meta http-equiv="Content-Security-Policy" content="${CSP}">`;
const page = (body: string, h = head) => `<html><head>${h}</head><body>${body}</body></html>`;

describe('checkHtml', () => {
  it('passes a clean page', () => {
    expect(checkHtml('a.html', page('<script type="module" src="/_astro/a.js"></script>'))).toEqual(
      [],
    );
  });

  it('accepts HTML-escaped quotes in CSP', () => {
    expect(checkHtml('a.html', page('', head.replaceAll("'", '&#39;')))).toEqual([]);
  });

  it('requires the CSP meta', () => {
    expect(checkHtml('a.html', page('', ''))).toEqual(['a.html: 缺少 CSP meta']);
  });

  it('rejects a CSP that drifted from src/lib/csp.ts', () => {
    const loose = `<meta http-equiv="Content-Security-Policy" content="default-src *">`;
    expect(checkHtml('a.html', page('', loose)).join()).toMatch(/不一致/);
  });

  it.each([
    ['<script>alert(1)</script>', /script/],
    ['<style>p{}</style>', /style/],
    ['<p style="color:red">x</p>', /style 屬性/],
    ['<button onclick="x()">x</button>', /事件屬性/],
  ])('rejects inline code: %s', (body, pattern) => {
    expect(checkHtml('a.html', page(body)).join()).toMatch(pattern);
  });

  it('rejects external links outside the whitelist', () => {
    const body = '<a href="https://evil.example/" rel="noopener noreferrer">x</a>';
    expect(checkHtml('a.html', page(body)).join()).toMatch(/非白名單/);
  });

  it('allows whitelisted and extra (sources) links with rel', () => {
    const body =
      '<a href="https://forms.gle/abc" rel="noopener noreferrer">x</a>' +
      '<a href="https://example.org/paper" rel="noopener noreferrer">y</a>';
    expect(checkHtml('a.html', page(body), ['https://example.org/paper'])).toEqual([]);
  });

  it('requires rel="noopener noreferrer" on external links', () => {
    const body = '<a href="https://forms.gle/abc">x</a>';
    expect(checkHtml('a.html', page(body)).join()).toMatch(/noopener/);
  });
});
