// Markdown 建置期轉換（docs/sdd/04），以 Sätteri（Astro 7 預設 Markdown 處理器）的 hast 外掛實作：
// 1. 名詞標記 `[[premise]]` 或 `[[premise|前提]]` → 按鈕＋原生 popover（不需 JavaScript；Esc 關閉）。
// 2. `## 進階` 區塊 → <details>，模式切換（M2）完成前以此漸進揭露。
// 只產生 hast 元素，不插入原生 HTML 字串。
import type { HastPluginDefinition } from 'satteri';

export type TermInfo = { term: string; en: string; definition: string };

type HastText = { type: 'text'; value: string };
type HastElement = {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: HastChild[];
};
type HastChild = HastText | HastElement | { type: string; value?: string };

export const TERM_MARKER = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;
export const ADVANCED_HEADING = '進階';

const text = (value: string): HastText => ({ type: 'text', value });
const el = (
  tagName: string,
  properties: Record<string, unknown>,
  children: HastChild[],
): HastElement => ({ type: 'element', tagName, properties, children });

export function termElement(id: string, label: string, info: TermInfo, popoverId: string) {
  // 屬性名一律小寫（popovertarget），Sätteri 不做 camelCase 轉換
  return el('span', { className: ['term'] }, [
    el('button', { type: 'button', className: ['term-trigger'], popovertarget: popoverId }, [
      text(label),
    ]),
    el('span', { id: popoverId, popover: 'auto', className: ['term-popover'] }, [
      el('span', { className: ['term-popover-title'] }, [
        text(info.term),
        text(' '),
        el('span', { className: ['latin'], lang: 'en' }, [text(info.en)]),
      ]),
      el('span', { className: ['term-popover-body'] }, [text(info.definition)]),
      el('span', { className: ['term-popover-actions'] }, [
        el('a', { href: `/terms/#${id}` }, [text('看名詞表')]),
        el(
          'button',
          {
            type: 'button',
            className: ['term-popover-close'],
            popovertarget: popoverId,
            popovertargetaction: 'hide',
          },
          [text('關閉')],
        ),
      ]),
    ]),
  ]);
}

/**
 * 把一段文字中的名詞標記換成元素；沒有標記時回傳 null。
 * 找不到的名詞 id 直接拋錯，讓建置失敗。
 */
export function splitTermMarkers(
  value: string,
  terms: ReadonlyMap<string, TermInfo>,
  nextId: (id: string) => string,
  file: string,
): HastChild[] | null {
  if (!value.includes('[[')) return null;
  const out: HastChild[] = [];
  let last = 0;
  for (const match of value.matchAll(TERM_MARKER)) {
    const [whole, id = '', label] = match;
    const info = terms.get(id);
    if (!info) throw new Error(`${file}: 名詞標記 [[${id}]] 找不到對應名詞（terms.yaml）`);
    if (match.index > last) out.push(text(value.slice(last, match.index)));
    out.push(termElement(id, label ?? info.term, info, nextId(id)));
    last = match.index + whole.length;
  }
  if (out.length === 0) return null;
  if (last < value.length) out.push(text(value.slice(last)));
  return out;
}

/** 把唯讀的 hast 節點複製成一般物件，才能搬進新建立的元素（Sätteri 不允許直接搬移原節點） */
function clone(node: HastChild): HastChild {
  if (node.type === 'element') {
    const e = node as HastElement;
    return el(e.tagName, { ...e.properties }, [...e.children].map(clone));
  }
  return { type: node.type, value: 'value' in node ? (node.value ?? '') : '' };
}

const isHeading = (n: HastChild, levels: RegExp): n is HastElement =>
  n.type === 'element' && levels.test((n as HastElement).tagName);

/**
 * 名詞標記外掛；每份文件重新計數，確保 popover id 在頁內唯一。
 * 同一頁分段轉換多次時（情境題），以 idPrefix 區分各段。
 */
export function ecologicTerms(terms: ReadonlyMap<string, TermInfo>, idPrefix = '') {
  return ({ fileURL }: { fileURL: URL | undefined }): HastPluginDefinition => {
    const counts = new Map<string, number>();
    const nextId = (id: string) => {
      const n = (counts.get(id) ?? 0) + 1;
      counts.set(id, n);
      return `term-${idPrefix}${id}-${n}`;
    };
    const file = fileURL?.pathname ?? '(markdown)';
    return {
      name: 'ecologic-terms',
      text(node, ctx) {
        const parent = ctx.parent(node);
        if (parent?.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) {
          return;
        }
        const replacement = splitTermMarkers(node.value, terms, nextId, file);
        if (replacement) ctx.replaceNode(node, replacement as never);
      },
    };
  };
}

/** `## 進階` 區塊外掛：從該標題到下一個 h1／h2 之前的內容包進 <details> */
export const ecologicAdvanced: HastPluginDefinition = {
  name: 'ecologic-advanced',
  after(root, ctx) {
    const children = [...root.children] as HastChild[];
    const start = children.findIndex(
      (n) => isHeading(n, /^h2$/) && ctx.textContent(n as never).trim() === ADVANCED_HEADING,
    );
    if (start === -1) return;
    let end = children.findIndex((n, i) => i > start && isHeading(n, /^h[12]$/));
    if (end === -1) end = children.length;

    const moved = children.slice(start + 1, end);
    const copies = moved.map(clone);
    for (const node of moved) ctx.removeNode(node as never);
    ctx.replaceNode(
      children[start] as never,
      el('details', { className: ['advanced'] }, [
        el('summary', {}, [text(ADVANCED_HEADING)]),
        ...copies,
      ]) as never,
    );
  },
};
