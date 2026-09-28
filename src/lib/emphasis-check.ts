// 粗體標記檢查：`**` 緊鄰中文標點時，CommonMark 可能不把它當成粗體，畫面上會留下星號。
// 以網站實際使用的 Markdown 處理器（Sätteri）轉換後檢查，不自行模擬強調規則。
import { markdownToHtml } from 'satteri';

/** 回傳轉換後仍殘留 `**` 的文字行（略過行內程式碼）。 */
export function findLiteralBold(body: string): string[] {
  const result = markdownToHtml(body);
  // 未使用外掛，結果不會是 Promise
  if (result instanceof Promise) throw new Error('unexpected async markdown result');
  const text = result.html.replace(/<code>[\s\S]*?<\/code>/g, '').replace(/<[^>]+>/g, '');
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('**'));
}

export const LITERAL_BOLD_HINT =
  '把緊鄰結尾 ** 的標點移到外面，例如 **如果你是居民**：、「**理解就是同意**。」';
