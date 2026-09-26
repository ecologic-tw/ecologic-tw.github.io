// 列表篩選（漸進增強）：沒有 JavaScript 時輸入框保持隱藏，列表完整可讀。
// 標記：[data-filter] 容器內含 input、[data-filter-item]（data-filter-text 為可搜尋文字）、
// [data-filter-group]（全部項目被篩掉時一併隱藏）、[data-filter-empty]。
for (const root of document.querySelectorAll<HTMLElement>('[data-filter]')) {
  const field = root.querySelector<HTMLElement>('[data-filter-field]');
  const input = root.querySelector<HTMLInputElement>('input');
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
  if (!field || !input) continue;
  field.hidden = false;

  const items = [...root.querySelectorAll<HTMLElement>('[data-filter-item]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-filter-group]')];

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    for (const item of items) {
      const match = !query || (item.dataset.filterText ?? '').toLowerCase().includes(query);
      item.hidden = !match;
      if (match) shown++;
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('[data-filter-item]:not([hidden])');
    }
    if (empty) empty.hidden = shown > 0;
  });
}
