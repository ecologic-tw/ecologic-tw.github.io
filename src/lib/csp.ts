// 內容安全政策（docs/sdd/07）。GitHub Pages 不能設 HTTP header，改以 <meta> 輸出。
// scripts/check-dist.ts 會確認每頁都帶有這段且沒有行內腳本／樣式。
export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');
