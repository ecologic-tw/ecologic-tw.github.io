// 綜合挑戰（ADR-0032）：抽 5 題 → 逐題作答（不公布對錯）→ 全部送出 → 答對題數與逐題回顧。
// 進行中的狀態存 sessionStorage（分頁關閉即清除）；送出後照一般作答寫入進度（recordAnswer）。
// 所有文字以 textContent 寫入（docs/sdd/07）。
import { challenge as text, quiz } from '../i18n/zh-TW.ts';
import {
  CHALLENGE_KEY,
  CHALLENGE_SIZE,
  drawChallenge,
  parseState,
  type ChallengeItem,
  type ChallengeState,
} from '../lib/challenge.ts';
import { load, recordAnswer, update } from '../lib/progress.ts';
import { shuffle } from '../lib/quiz.ts';

// sessionStorage 可能被瀏覽器封鎖；讀寫失敗時只保留在記憶體，重新整理後從頭開始
function readSession(): string | null {
  try {
    return sessionStorage.getItem(CHALLENGE_KEY);
  } catch {
    return null;
  }
}

function writeSession(state: ChallengeState | undefined) {
  try {
    if (state) sessionStorage.setItem(CHALLENGE_KEY, JSON.stringify(state));
    else sessionStorage.removeItem(CHALLENGE_KEY);
  } catch {
    // 忽略：狀態仍在記憶體中
  }
}

/** 頁面結構固定，缺少元素代表模板與腳本不一致，直接報錯 */
function required<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`challenge: 找不到 ${selector}`);
  return el;
}

const root = document.querySelector<HTMLElement>('[data-challenge]');
if (root) setup(root);

function setup(root: HTMLElement) {
  const startButton = required<HTMLButtonElement>(root, '[data-challenge-start]');
  const unavailable = required<HTMLElement>(root, '[data-challenge-unavailable]');
  const form = required<HTMLFormElement>(root, '[data-challenge-form]');
  const progress = required<HTMLElement>(root, '[data-challenge-progress]');
  const error = required<HTMLElement>(root, '[data-challenge-error]');
  const previous = required<HTMLButtonElement>(root, '[data-challenge-previous]');
  const next = required<HTMLButtonElement>(root, '[data-challenge-next]');
  const submit = required<HTMLButtonElement>(root, '[data-challenge-submit]');
  const result = required<HTMLElement>(root, '[data-challenge-result]');
  const review = required<HTMLOListElement>(root, '[data-challenge-review]');

  let items: ChallengeItem[] = [];
  try {
    items = JSON.parse(root.dataset.items ?? '[]') as ChallengeItem[];
  } catch {
    items = [];
  }
  const answers = new Map(items.map((i) => [i.id, i.answer]));
  const questionOf = (id: string) =>
    form.querySelector<HTMLElement>(`[data-question="${CSS.escape(id)}"]`);
  const reviewOf = (id: string) =>
    review.querySelector<HTMLElement>(`[data-review="${CSS.escape(id)}"]`);
  const radiosOf = (id: string) => [
    ...(questionOf(id)?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
  ];
  const known = new Map(
    items.map((i) => [i.id, new Set(radiosOf(i.id).map((input) => input.value))]),
  );

  let state: ChallengeState | undefined;

  const save = () => writeSession(state);

  function show(focus: boolean) {
    if (!state) return;
    const current = state.ids[state.index] ?? '';
    for (const section of form.querySelectorAll<HTMLElement>('[data-question]')) {
      section.hidden = section.dataset.question !== current;
    }
    const choice = state.choices[state.index];
    for (const input of radiosOf(current)) input.checked = input.value === choice;
    progress.textContent = text.progress(state.index + 1, CHALLENGE_SIZE);
    previous.disabled = state.index === 0;
    const last = state.index === CHALLENGE_SIZE - 1;
    next.hidden = last;
    submit.hidden = !last;
    error.hidden = true;
    if (focus) questionOf(current)?.querySelector<HTMLElement>('h2')?.focus();
  }

  function begin(initial: ChallengeState, focus: boolean) {
    state = initial;
    // 每題的選項順序打亂（02 規則 2）；「沒有問題」也一起打亂
    for (const id of state.ids) {
      const list = questionOf(id)?.querySelector<HTMLElement>('[data-question-options]');
      if (!list) continue;
      for (const option of shuffle([...list.querySelectorAll<HTMLElement>('[data-option-id]')]))
        list.append(option);
    }
    save();
    startButton.hidden = true;
    result.hidden = true;
    form.hidden = false;
    show(focus);
  }

  const advancedMode = () => document.documentElement.dataset.mode === 'advanced';

  function start() {
    const draw = drawChallenge(items, {
      advanced: advancedMode(),
      answered: new Set(Object.keys(load().answered)),
    });
    if (!draw.ok) {
      unavailable.hidden = false;
      startButton.hidden = true;
      return;
    }
    begin(
      {
        ids: draw.ids,
        choices: draw.ids.map(() => null),
        index: 0,
        includesAnswered: draw.includesAnswered,
      },
      true,
    );
  }

  function finish() {
    if (!state) return;
    const { ids, choices, includesAnswered } = state;
    const graded = ids.map((id, i) => {
      const choice = choices[i] ?? '';
      return { id, choice, correct: choice === answers.get(id) };
    });
    // 與一般作答相同：逐題記錄，覆蓋先前的紀錄（ADR-0032）
    update((p) => graded.reduce((acc, g) => recordAnswer(g.id, g.correct)(acc), p));
    state = undefined;
    save();

    for (const li of review.querySelectorAll<HTMLElement>('[data-review]')) li.hidden = true;
    for (const g of graded) {
      const li = reviewOf(g.id);
      if (!li) continue;
      const label = questionOf(g.id)
        ?.querySelector(`[data-option-id="${CSS.escape(g.choice)}"] [data-option-label]`)
        ?.textContent?.trim();
      li.classList.toggle('is-correct', g.correct);
      const icon = li.querySelector('[data-review-icon]');
      const verdict = li.querySelector('[data-review-verdict]');
      const choice = li.querySelector('[data-review-choice]');
      if (icon) icon.textContent = g.correct ? '✓' : '↻';
      if (verdict) verdict.textContent = g.correct ? quiz.correct : quiz.tryAnotherAngle;
      if (choice) choice.textContent = label ?? '';
      review.append(li);
      li.hidden = false;
    }
    const count = result.querySelector('[data-challenge-count]');
    if (count)
      count.textContent = text.result(graded.filter((g) => g.correct).length, CHALLENGE_SIZE);
    const note = result.querySelector<HTMLElement>('[data-challenge-includes-answered]');
    if (note) note.hidden = !includesAnswered;

    form.hidden = true;
    result.hidden = false;
    startButton.hidden = true;
    result.querySelector<HTMLElement>('h2')?.focus();
  }

  form.addEventListener('change', (event) => {
    const input = event.target;
    if (!state || !(input instanceof HTMLInputElement) || input.type !== 'radio') return;
    state.choices[state.index] = input.value;
    error.hidden = true;
    save();
  });

  const requireChoice = () => {
    if (state && state.choices[state.index] !== null) return true;
    error.hidden = false;
    return false;
  };

  const goNext = () => {
    if (!state || !requireChoice()) return;
    state.index += 1;
    save();
    show(true);
  };
  next.addEventListener('click', goNext);

  previous.addEventListener('click', () => {
    if (!state || state.index === 0) return;
    state.index -= 1;
    save();
    show(true);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!state) return;
    // 在前幾題按 Enter 也會觸發送出：視為「下一題」，最後一題才全部送出
    if (state.index < CHALLENGE_SIZE - 1) return goNext();
    if (requireChoice()) finish();
  });

  startButton.addEventListener('click', start);
  root.querySelector('[data-challenge-again]')?.addEventListener('click', start);

  // 重新整理後接續進行中的挑戰；沒有或無效時顯示「開始」
  const saved = parseState(readSession(), known);
  if (saved) {
    begin(saved, false);
  } else {
    writeSession(undefined);
    const probe = drawChallenge(items, { advanced: advancedMode(), answered: new Set() });
    if (probe.ok) startButton.hidden = false;
    else unavailable.hidden = false;
  }
}
