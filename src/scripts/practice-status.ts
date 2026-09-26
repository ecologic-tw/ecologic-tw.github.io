// 題目列表的完成狀態（docs/sdd/04）。狀態只來自本機的 localStorage。
import { quiz } from '../i18n/zh-TW.ts';
import { load } from '../lib/progress.ts';

const { answered } = load();

for (const item of document.querySelectorAll<HTMLElement>('[data-scenario-id]')) {
  const record = answered[item.dataset.scenarioId ?? ''];
  const slot = item.querySelector<HTMLElement>('[data-status]');
  if (!record || !slot) continue;
  slot.textContent = record.correct ? `✓ ${quiz.answeredCorrect}` : `・${quiz.answered}`;
  slot.hidden = false;
}
