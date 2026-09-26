// 情境題作答（docs/sdd/04「作答流程」）。漸進增強：
// - 沒有 JavaScript：選項隱藏，答案與解說收在「看答案與解說」<details>，改寫區直接顯示。
// - 有 JavaScript：打亂選項 → 作答 → 顯示對錯（圖示＋文字，不只靠顏色）→ 揭露解說與改寫練習。
// 使用者輸入只讀取、不渲染；所有文字以 textContent 寫入（docs/sdd/07）。
import { quiz } from '../i18n/zh-TW.ts';
import { addRewrite, recordAnswer, update } from '../lib/progress.ts';
import { isCorrect, shuffle } from '../lib/quiz.ts';

for (const root of document.querySelectorAll<HTMLElement>('[data-quiz]')) {
  const scenarioId = root.dataset.scenarioId ?? '';
  const answer = root.dataset.answer ?? '';
  const form = root.querySelector<HTMLFormElement>('[data-quiz-form]');
  const list = root.querySelector<HTMLElement>('[data-quiz-options]');
  const error = root.querySelector<HTMLElement>('[data-quiz-error]');
  const result = root.querySelector<HTMLElement>('[data-quiz-result]');
  const reveal = root.querySelector<HTMLDetailsElement>('[data-quiz-reveal]');
  const rewrite = root.querySelector<HTMLElement>('[data-quiz-rewrite]');
  if (!form || !list || !result || !reveal) continue;

  // 打亂選項順序（02 規則 2）
  const options = [...list.querySelectorAll<HTMLElement>('[data-option-id]')];
  for (const option of shuffle(options)) list.append(option);

  form.hidden = false;
  reveal.hidden = true;
  if (rewrite) rewrite.hidden = true;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = form.querySelector<HTMLInputElement>('input[name="choice"]:checked');
    if (!chosen) {
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;

    const correct = isCorrect(chosen.value, answer);
    const chosenLabel = chosen.closest('[data-option-id]')?.querySelector('[data-option-label]');

    for (const option of options) {
      const id = option.dataset.optionId;
      const tag = option.querySelector<HTMLElement>('[data-option-tag]');
      if (!tag) continue;
      if (id === answer) {
        option.classList.add('is-answer');
        tag.textContent = '正解';
        tag.hidden = false;
      } else if (id === chosen.value) {
        option.classList.add('is-chosen');
        tag.textContent = quiz.yourChoice;
        tag.hidden = false;
      }
    }
    form.querySelector('fieldset')?.setAttribute('disabled', '');
    form.querySelector<HTMLButtonElement>('button[type="submit"]')?.setAttribute('hidden', '');

    result.classList.toggle('is-correct', correct);
    const icon = result.querySelector('[data-result-icon]');
    const text = result.querySelector('[data-result-text]');
    const choice = result.querySelector('[data-result-choice]');
    if (icon) icon.textContent = correct ? '✓' : '↻';
    if (text) text.textContent = correct ? quiz.correct : quiz.tryAnotherAngle;
    if (choice) choice.textContent = `${quiz.yourChoice}：${chosenLabel?.textContent ?? ''}`;
    result.hidden = false;

    reveal.hidden = false;
    reveal.open = true;
    if (rewrite) rewrite.hidden = false;

    update(recordAnswer(scenarioId, correct));
    result.focus();
  });

  // 改寫練習自評：打開參考改寫前至少勾了一項檢核，算一次（只計次數，不存內容）
  const reference = rewrite?.querySelector<HTMLDetailsElement>('[data-reference]');
  let counted = false;
  reference?.addEventListener('toggle', () => {
    if (!reference.open || counted) return;
    const checked = rewrite?.querySelectorAll('input[type="checkbox"]:checked').length ?? 0;
    if (checked === 0) return;
    counted = true;
    update(addRewrite);
  });
}
