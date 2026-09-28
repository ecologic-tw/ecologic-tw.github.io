/**
 * 執行環境時區的日期（YYYY-MM-DD），供 `updated`、`published` 使用。
 * 不用 toISOString()：那是 UTC 日期，在臺灣 08:00 前執行會記成前一天。
 */
export function localDate(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
