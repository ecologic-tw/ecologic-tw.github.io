// 多方觀點案例的作答狀態（ADR-0036）：只讀本機 localStorage 的 answered，不新增進度欄位。
// 案例頁全部小題都作答過、或從最後一題連回 #closing 時，展開收尾的「換個位置想」。
import { cases } from '../i18n/zh-TW.ts';
import { load } from '../lib/progress.ts';

const { answered } = load();

for (const root of document.querySelectorAll<HTMLElement>('[data-case-questions]')) {
  const ids = (root.dataset.caseQuestions ?? '').split(' ').filter(Boolean);
  if (ids.length === 0) continue;
  const done = ids.filter((id) => id in answered).length;
  const progress = root.querySelector<HTMLElement>('[data-case-progress]');
  if (progress) {
    progress.textContent = cases.progress(done, ids.length);
    progress.hidden = false;
  }
  const closing = root.querySelector<HTMLDetailsElement>('[data-case-closing]');
  if (closing && (done === ids.length || location.hash === `#${closing.id}`)) closing.open = true;
}
