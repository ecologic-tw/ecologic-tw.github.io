// 建置產物檢查（docs/sdd/07）：CSP meta、無行內腳本／樣式／事件屬性、外連白名單。純函式。
import { CSP } from './csp.ts';
import { isAllowedExternal } from './external-links.ts';
import { SITE_URL } from './site.ts';

const CSP_META = /<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"/i;

export function checkHtml(
  file: string,
  html: string,
  extraAllowed: Iterable<string> = [],
): string[] {
  const errors: string[] = [];
  const csp = CSP_META.exec(html)?.[1];
  if (csp === undefined) errors.push(`${file}: 缺少 CSP meta`);
  else if (csp.replaceAll('&#39;', "'") !== CSP)
    errors.push(`${file}: CSP 與 src/lib/csp.ts 不一致`);

  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    if (!/\bsrc=/i.test(m[1] ?? ''))
      errors.push(`${file}: 行內 <script>（違反 script-src 'self'）`);
  }
  if (/<style\b/i.test(html)) errors.push(`${file}: 行內 <style>（違反 style-src 'self'）`);
  if (/<[^>]+\sstyle=/i.test(html)) errors.push(`${file}: style 屬性（違反 style-src 'self'）`);
  if (/<[^>]+\son[a-z]+=/i.test(html)) errors.push(`${file}: 行內事件屬性（on*=）`);

  for (const m of html.matchAll(/\s(?:href|src|action)="(https?:\/\/[^"]+)"/gi)) {
    const url = m[1] ?? '';
    if (!isAllowedExternal(url, extraAllowed)) errors.push(`${file}: 非白名單外連 ${url}`);
  }
  for (const m of html.matchAll(/<a\b[^>]*href="https?:\/\/[^>]*>/gi)) {
    const href = /href="([^"]+)"/.exec(m[0])?.[1] ?? '';
    if (!href.startsWith(`${SITE_URL}/`) && !/target="_blank"/i.test(m[0])) {
      errors.push(`${file}: 外連需 target="_blank"（另開視窗）`);
    }
    if (!/rel="[^"]*noopener[^"]*noreferrer|rel="[^"]*noreferrer[^"]*noopener/i.test(m[0])) {
      errors.push(`${file}: 外連缺少 rel="noopener noreferrer"`);
    }
  }
  return errors;
}
