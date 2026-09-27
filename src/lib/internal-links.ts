// 建置產物的站內連結檢查（Issue #41）。純函式：輸入產物中的頁面與檔案清單，回傳錯誤。
// - 只檢查 <a href>：canonical、og:url 由 search-checks 負責；src 載入的資源由 Astro 產生。
// - 假設屬性值以雙引號包住（Astro 的輸出都是如此），單引號或未加引號的 href 不在檢查範圍。
// - 第一版只確認目標頁面或檔案存在，不檢查 #錨點是否存在。
import { SITE_URL } from './site.ts';

export type DistPage = {
  /** 頁面網址，例如 '/'、'/guide/straw-man/' */
  path: string;
  html: string;
};

const ANCHOR_HREF = /<a\b[^>]*?\shref="([^"]*)"/gi;
const OTHER_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function decodeAttribute(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#38;', '&')
    .replaceAll('&amp;', '&');
}

/**
 * 站內連結的目標必須存在於產物中：
 * 以 / 結尾的網址對應該目錄的 index.html；有副檔名的網址對應該檔案。
 * 網站設定尾斜線一律要加（astro.config trailingSlash: 'always'），缺尾斜線的頁面連結視為錯誤。
 *
 * @param files 產物中所有檔案的網址路徑，例如 '/guide/straw-man/index.html'、'/social-card.png'
 */
export function checkInternalLinks(
  pages: readonly DistPage[],
  files: ReadonlySet<string>,
  siteUrl: string = SITE_URL,
): string[] {
  const origin = new URL(siteUrl).origin;
  const errors: string[] = [];
  for (const page of pages) {
    const seen = new Set<string>();
    for (const match of page.html.matchAll(ANCHOR_HREF)) {
      const raw = match[1] ?? '';
      const href = decodeAttribute(raw);
      if (!href || href.startsWith('#') || seen.has(href)) continue;
      if (OTHER_SCHEME.test(href) && !/^https?:/i.test(href)) continue; // mailto:、tel: 等
      const url = new URL(href, `${origin}${page.path}`);
      if (url.origin !== origin) continue; // 外站
      seen.add(href);

      let pathname = url.pathname;
      try {
        pathname = decodeURIComponent(pathname);
      } catch {
        // 編碼不正確時直接以原樣比對，不存在就會回報
      }
      const lastSegment = pathname.split('/').pop() ?? '';
      if (pathname.endsWith('/')) {
        if (files.has(`${pathname}index.html`)) continue;
      } else if (lastSegment.includes('.')) {
        if (files.has(pathname)) continue;
      } else {
        errors.push(
          `${page.path}：站內連結缺少結尾斜線\n  href="${raw}"（網站網址一律以 / 結尾，請改為 ${pathname}/）`,
        );
        continue;
      }
      errors.push(
        `${page.path}：站內連結目標不存在\n  href="${raw}"（可能是被引用的內容退回草稿或下架，見 docs/review/review-guide.md「退回審核或暫緩發布」）`,
      );
    }
  }
  return errors;
}
