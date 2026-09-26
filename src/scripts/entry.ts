// 圖鑑卡頁（docs/sdd/02 規則 4、05）：
// - 卡內小檢核：答對即在個人圖鑑點亮這張卡；答錯可以再試，不扣分、不記錄。
// - 讀到卡片結尾時記錄「已讀」（「謬誤的謬誤」徽章用）。
import { collect, markRead, update } from '../lib/progress.ts';

for (const root of document.querySelectorAll<HTMLElement>('[data-quick-check]')) {
  const entryId = root.dataset.entryId ?? '';
  const answer = root.dataset.answer ?? '';
  const form = root.querySelector<HTMLFormElement>('[data-qc-form]');
  const result = root.querySelector<HTMLElement>('[data-qc-result]');
  const reveal = root.querySelector<HTMLDetailsElement>('[data-qc-reveal]');
  if (!form || !result || !reveal) continue;

  form.hidden = false;
  reveal.hidden = true;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = form.querySelector<HTMLInputElement>('input[name="qc"]:checked');
    if (!chosen) {
      result.textContent = '先選一個答案，再送出。';
      result.hidden = false;
      return;
    }
    const correct = chosen.value === answer;
    result.classList.toggle('is-correct', correct);
    result.textContent = correct
      ? '✓ 答對了！這張卡已在「我的圖鑑」點亮。'
      : '↻ 再想想看，可以換一個答案試試。';
    result.hidden = false;
    if (correct) {
      update(collect(entryId));
      form.querySelector('fieldset')?.setAttribute('disabled', '');
      form.querySelector('button')?.setAttribute('hidden', '');
      reveal.hidden = false;
      reveal.open = true;
    }
  });
}

for (const marker of document.querySelectorAll<HTMLElement>('[data-read-marker]')) {
  const entryId = marker.dataset.entryId ?? '';
  if (!('IntersectionObserver' in window)) continue;
  const observer = new IntersectionObserver((records) => {
    if (records.some((r) => r.isIntersecting)) {
      update(markRead(entryId));
      observer.disconnect();
    }
  });
  observer.observe(marker);
}
