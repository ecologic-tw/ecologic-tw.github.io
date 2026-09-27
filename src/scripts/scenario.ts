// 情境題作答（docs/sdd/04「作答流程」、ADR-0022）。漸進增強：
// - 沒有 JavaScript：選項隱藏，答案與解說收在「看答案與解說」<details>，改寫區直接顯示。
// - 有 JavaScript：打亂選項 → 作答 → 顯示對錯（圖示＋文字，不只靠顏色）→ 揭露解說與改寫練習。
// 單選題（judge、choice）與 validity-soundness 的兩個判斷軸都是「單選群組」，走同一條流程；
// multi 為核取方塊，逐項標記。不計分，只記錄是否完全答對。
// 使用者輸入只讀取、不渲染；所有文字以 textContent 寫入（docs/sdd/07）。
import { advancedQuiz, quiz } from '../i18n/zh-TW.ts';
import { addRewrite, recordAnswer, update } from '../lib/progress.ts';
import { gradeMulti, isCorrect, shuffle, type MultiRole } from '../lib/quiz.ts';

type Outcome = { correct: boolean; labels: string[] };

const MULTI_ROLES: readonly string[] = ['answer', 'acceptable', 'distractor'];
const labelOf = (option: Element) =>
  option.querySelector('[data-option-label]')?.textContent?.trim() ?? '';

function setTag(option: HTMLElement, text: string, icon?: string) {
  const tag = option.querySelector<HTMLElement>('[data-option-tag]');
  if (!tag) return;
  const parts: Node[] = [];
  if (icon) {
    const mark = document.createElement('span');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = `${icon} `;
    parts.push(mark);
  }
  parts.push(document.createTextNode(text));
  tag.replaceChildren(...parts);
  tag.hidden = false;
}

/** 單選群組：每個 [data-quiz-group] 各有一個 data-answer */
function submitGroups(lists: HTMLElement[], chosenTag: string): Outcome | undefined {
  const picks = lists.map((list) => ({
    list,
    input: list.querySelector<HTMLInputElement>('input:checked'),
  }));
  if (picks.some((p) => !p.input)) return undefined;
  let correct = true;
  const labels: string[] = [];
  for (const { list, input } of picks) {
    if (!input) continue;
    const answer = list.dataset.answer ?? '';
    correct = isCorrect(input.value, answer) && correct;
    for (const option of list.querySelectorAll<HTMLElement>('[data-option-id]')) {
      const id = option.dataset.optionId;
      if (id === answer) {
        option.classList.add('is-answer');
        setTag(option, '正解');
      } else if (id === input.value) {
        option.classList.add('is-chosen');
        setTag(option, chosenTag);
      }
      if (id === input.value) labels.push(labelOf(option));
    }
  }
  return { correct, labels };
}

/** 多重判讀：全部正解都選到、沒選不適用的選項才算答對；可接受的選項選不選都可以 */
function submitMulti(list: HTMLElement): Outcome | undefined {
  const items = [...list.querySelectorAll<HTMLElement>('[data-option-id]')];
  const isChecked = (li: HTMLElement) => li.querySelector('input')?.checked === true;
  const selected = new Set(items.filter(isChecked).map((li) => li.dataset.optionId ?? ''));
  if (selected.size === 0) return undefined;
  const options = items.map((li) => ({
    id: li.dataset.optionId ?? '',
    role: (MULTI_ROLES.includes(li.dataset.role ?? '')
      ? li.dataset.role
      : 'distractor') as MultiRole,
  }));
  const { correct, marks } = gradeMulti(options, selected);
  for (const li of items) {
    const mark = marks.get(li.dataset.optionId ?? '');
    if (!mark || mark === 'clear') continue;
    li.classList.add(mark === 'hit' ? 'is-answer' : `is-${mark}`);
    const { icon, text } = advancedQuiz.multiMarks[mark];
    setTag(li, text, icon);
  }
  return { correct, labels: items.filter(isChecked).map(labelOf) };
}

for (const root of document.querySelectorAll<HTMLElement>('[data-quiz]')) {
  const scenarioId = root.dataset.scenarioId ?? '';
  const format = root.dataset.format ?? 'judge';
  const form = root.querySelector<HTMLFormElement>('[data-quiz-form]');
  const lists = [...root.querySelectorAll<HTMLElement>('[data-quiz-options]')];
  const error = root.querySelector<HTMLElement>('[data-quiz-error]');
  const result = root.querySelector<HTMLElement>('[data-quiz-result]');
  const reveal = root.querySelector<HTMLDetailsElement>('[data-quiz-reveal]');
  const rewrite = root.querySelector<HTMLElement>('[data-quiz-rewrite]');
  const nextLinks = root.querySelector<HTMLElement>('[data-quiz-next]');
  const first = lists[0];
  if (!form || !first || !result || !reveal) continue;

  // 打亂選項順序（02 規則 2）；validity-soundness 的判斷軸維持固定順序
  for (const list of lists) {
    if (!('shuffle' in list.dataset)) continue;
    const options = [...list.querySelectorAll<HTMLElement>('[data-option-id]')];
    for (const option of shuffle(options)) list.append(option);
  }

  form.hidden = false;
  reveal.hidden = true;
  if (rewrite) rewrite.hidden = true;

  const chosenTag =
    format === 'choice' || format === 'multi' ? advancedQuiz.yourChoice : quiz.yourChoice;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const outcome = format === 'multi' ? submitMulti(first) : submitGroups(lists, chosenTag);
    if (!outcome) {
      if (error) error.hidden = false;
      return;
    }
    if (error) error.hidden = true;

    for (const fieldset of form.querySelectorAll('fieldset')) fieldset.setAttribute('disabled', '');
    form.querySelector<HTMLButtonElement>('button[type="submit"]')?.setAttribute('hidden', '');

    result.classList.toggle('is-correct', outcome.correct);
    const icon = result.querySelector('[data-result-icon]');
    const text = result.querySelector('[data-result-text]');
    const choice = result.querySelector('[data-result-choice]');
    if (icon) icon.textContent = outcome.correct ? '✓' : '↻';
    if (text) text.textContent = outcome.correct ? quiz.correct : quiz.tryAnotherAngle;
    if (choice) choice.textContent = `${chosenTag}：${outcome.labels.join('、')}`;
    result.hidden = false;
    if (nextLinks) nextLinks.hidden = false;

    reveal.hidden = false;
    reveal.open = true;
    if (rewrite) rewrite.hidden = false;

    update(recordAnswer(scenarioId, outcome.correct));
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
