// 外部連結白名單（docs/sdd/07）。網站所有外連集中於此；內容 sources 中經審核的網址另計。
import { SITE_URL } from './site.ts';
export const ALLOWED_EXTERNAL_PREFIXES = [
  'https://forms.gle/',
  'https://docs.google.com/forms/',
  'https://github.com/ecologic-tw',
  'https://creativecommons.org/',
  'https://opensource.org/',
] as const;

export function isAllowedExternal(url: string, extra: Iterable<string> = []): boolean {
  if (url.startsWith(`${SITE_URL}/`)) return true;
  if (ALLOWED_EXTERNAL_PREFIXES.some((p) => url.startsWith(p))) return true;
  for (const allowed of extra) if (url === allowed) return true;
  return false;
}
