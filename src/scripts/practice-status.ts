// 題目列表的完成狀態（docs/sdd/04）。狀態只來自本機的 localStorage。
// 正解修正前的作答不顯示「答對」，紀錄本身不改（ADR-0025）。
import { quiz } from '../i18n/zh-TW.ts';
import { answeredBeforeFix, load } from '../lib/progress.ts';

const { answered } = load();

for (const item of document.querySelectorAll<HTMLElement>('[data-scenario-id]')) {
  const record = answered[item.dataset.scenarioId ?? ''];
  const slot = item.querySelector<HTMLElement>('[data-status]');
  if (!record || !slot) continue;
  const fixedOn = item.dataset.answerChanged;
  slot.textContent =
    fixedOn && answeredBeforeFix(record, fixedOn)
      ? `・${quiz.answeredBeforeFix}`
      : record.correct
        ? `✓ ${quiz.answeredCorrect}`
        : `・${quiz.answered}`;
  slot.hidden = false;
}
