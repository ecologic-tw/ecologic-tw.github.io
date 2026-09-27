// 「我的圖鑑」（docs/sdd/04、05、07）：一切都在這個瀏覽器內完成，不上傳。
// 所有文字以 textContent 寫入；匯入檔的字串永遠不顯示，只用來比對已知 id。
import { BADGES, collectedEntries, earnedBadges, type ContentIndex } from '../lib/badges.ts';
import {
  IMPORT_MAX_BYTES,
  clear,
  exportJson,
  grantBadges,
  isStorageAvailable,
  load,
  parseImport,
  save,
  update,
  type KnownIds,
  type Progress,
} from '../lib/progress.ts';

const root = document.querySelector<HTMLElement>('[data-me]');

if (root) {
  const index = JSON.parse(root.dataset.index ?? '{}') as ContentIndex;
  // 暫時撤下的內容也算認得，匯入時保留紀錄（ADR-0025）；畫面與徽章仍只依已發布內容
  const withdrawn = JSON.parse(root.dataset.withdrawn ?? '{}') as {
    entries?: string[];
    scenarios?: string[];
  };
  const known: KnownIds = {
    scenarios: new Set([...index.scenarios.map((s) => s.id), ...(withdrawn.scenarios ?? [])]),
    entries: new Set([...index.entries, ...(withdrawn.entries ?? [])]),
    badges: new Set(BADGES.map((b) => b.id)),
  };

  const $ = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const $$ = <T extends HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
  const message = $('[data-me-message]');

  const say = (text: string) => {
    if (!message) return;
    message.textContent = text;
    message.hidden = false;
  };

  const storageOk = isStorageAvailable();
  const unavailable = $('[data-me-unavailable]');
  if (unavailable) unavailable.hidden = storageOk;
  for (const el of $$<HTMLButtonElement | HTMLInputElement>('[data-needs-storage]')) {
    el.disabled = !storageOk;
  }

  function render(progress: Progress) {
    const lit = collectedEntries(progress, index);
    for (const cell of $$('[data-entry-id]')) {
      const on = lit.has(cell.dataset.entryId ?? '');
      cell.classList.toggle('is-lit', on);
      const state = cell.querySelector('[data-cell-state]');
      if (state) state.textContent = on ? '已點亮' : '尚未點亮';
    }
    const litCount = $('[data-lit-count]');
    if (litCount) litCount.textContent = `${lit.size}／${index.entries.length}`;

    for (const row of $$('[data-theme-progress]')) {
      const theme = row.dataset.themeProgress;
      const inTheme = index.scenarios.filter((s) => s.theme === theme);
      const answered = inTheme.filter((s) => s.id in progress.answered);
      const correct = answered.filter((s) => progress.answered[s.id]?.correct);
      const text = row.querySelector('[data-progress-text]');
      if (text) {
        text.textContent = `已作答 ${answered.length}／${inTheme.length} 題，其中答對 ${correct.length} 題`;
      }
      const bar = row.querySelector<HTMLProgressElement>('progress');
      if (bar) {
        bar.max = Math.max(inTheme.length, 1);
        bar.value = answered.length;
      }
    }

    const owned = new Set(progress.badges.filter((id) => known.badges.has(id)));
    for (const item of $$('[data-badge-id]')) {
      const on = owned.has(item.dataset.badgeId ?? '');
      item.classList.toggle('is-earned', on);
      const state = item.querySelector('[data-badge-state]');
      if (state) state.textContent = on ? '已獲得' : '尚未獲得';
    }
    const rewrites = $('[data-rewrites]');
    if (rewrites) rewrites.textContent = String(progress.rewrites);
  }

  /** 依目前進度補發徽章（只增不減），再重新顯示 */
  function refresh() {
    let progress = load();
    const earned = earnedBadges(progress, index);
    if (earned.some((id) => !progress.badges.includes(id))) {
      progress = update(grantBadges(earned));
    }
    render(progress);
  }

  refresh();

  $('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([exportJson(load())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecologic-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say('已匯出。檔案只存在你的裝置上。');
  });

  const input = $<HTMLInputElement>('[data-import]');
  input?.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    // 超過上限的檔案不讀取內容
    if (file.size > IMPORT_MAX_BYTES) {
      say('檔案超過 100 KB，無法匯入。');
      return;
    }
    const result = parseImport(await file.text(), known);
    if (!result.ok) {
      say(
        result.reason === 'too-large'
          ? '檔案超過 100 KB，無法匯入。'
          : result.reason === 'not-json'
            ? '這不是有效的進度檔（JSON 格式），沒有匯入任何資料。'
            : '檔案內容不符合本站的進度格式，沒有匯入任何資料。',
      );
      return;
    }
    if (!confirm('匯入會取代這個瀏覽器目前的紀錄。確定要匯入嗎？')) return;
    if (!save(result.progress)) {
      say('無法儲存：你的瀏覽器目前不允許網站儲存資料。');
      return;
    }
    refresh();
    say(
      result.dropped > 0 ? `已匯入。有 ${result.dropped} 筆本站不認得的項目，已略過。` : '已匯入。',
    );
  });

  $('[data-clear]')?.addEventListener('click', () => {
    if (!confirm('確定要清除這個瀏覽器裡本站的所有紀錄嗎？清除後無法復原。')) return;
    clear();
    refresh();
    say('已清除。');
  });
}
