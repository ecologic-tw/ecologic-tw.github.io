// 模式切換（docs/sdd/04）：基礎｜進階，存於 localStorage。
// 在 <html data-mode> 標記目前模式；CSS 以 .mode-advanced 隱藏進階內容。
// 沒有 JavaScript 時不設 data-mode，所有內容都顯示（進階內容收在 <details> 裡）。
import { load, setMode, update, type Mode } from '../lib/progress.ts';

function apply(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  document.dispatchEvent(new CustomEvent('ecologic:mode', { detail: mode }));
}

apply(load().mode);

for (const form of document.querySelectorAll<HTMLElement>('[data-mode-switch]')) {
  form.hidden = false;
  const current = document.documentElement.dataset.mode;
  for (const input of form.querySelectorAll<HTMLInputElement>('input[name="mode"]')) {
    input.checked = input.value === current;
    input.addEventListener('change', () => {
      if (!input.checked) return;
      const mode: Mode = input.value === 'advanced' ? 'advanced' : 'basic';
      update(setMode(mode));
      apply(mode);
    });
  }
}
