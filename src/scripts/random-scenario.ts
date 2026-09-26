// 「隨機一題」（docs/sdd/05：輕度好奇心，無獎勵）。依目前模式挑題，基礎模式不出進階題。
// 按鈕預設隱藏；沒有 JavaScript 時不顯示。
type Item = { id: string; advanced: boolean };

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-random-scenario]')) {
  let items: Item[] = [];
  try {
    items = JSON.parse(button.dataset.items ?? '[]') as Item[];
  } catch {
    continue;
  }
  const exclude = button.dataset.exclude;
  if (items.length === 0) continue;
  button.hidden = false;

  button.addEventListener('click', () => {
    const advanced = document.documentElement.dataset.mode === 'advanced';
    const pool = items.filter((i) => (advanced || !i.advanced) && i.id !== exclude);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) location.assign(`/scenario/${pick.id}/`);
  });
}
