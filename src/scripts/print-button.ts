// 討論引導卡的「列印這張卡」按鈕（ADR-0033）。CSP 不允許行內事件，改在這裡綁定；
// 按鈕預設隱藏，沒有 JavaScript 時只顯示文字說明。
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-print]')) {
  button.hidden = false;
  button.addEventListener('click', () => window.print());
}
