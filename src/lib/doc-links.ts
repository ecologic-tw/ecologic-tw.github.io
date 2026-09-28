// 文件相對連結檢查（ADR-0028）：純文件 PR 不跑完整 CI 時，至少確認 Markdown 相對連結指向存在的檔案。純函式。
import { posix } from 'node:path';

export type DocFile = { path: string; text: string };

const LINK = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/** 去除程式碼區塊與行內程式碼，避免把範例語法當成連結 */
function stripCode(text: string): string {
  return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

/** 只檢查相對路徑；外部網址、站內絕對路徑（網站路由）與頁內錨點不檢查 */
export function relativeTargets(file: DocFile): { href: string; target: string }[] {
  const targets: { href: string; target: string }[] = [];
  for (const match of stripCode(file.text).matchAll(LINK)) {
    const href = match[1] ?? '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('/')) continue;
    const path = href.split('#')[0] ?? '';
    if (!path) continue;
    let decoded = path;
    try {
      decoded = decodeURIComponent(path);
    } catch {
      // 保留原字串，由存在檢查回報
    }
    targets.push({ href, target: posix.normalize(posix.join(posix.dirname(file.path), decoded)) });
  }
  return targets;
}

export function brokenDocLinks(
  files: readonly DocFile[],
  exists: (path: string) => boolean,
): string[] {
  return files.flatMap((file) =>
    relativeTargets(file)
      .filter(({ target }) => !exists(target))
      .map(({ href }) => `${file.path}: 連結「${href}」指向不存在的檔案`),
  );
}
