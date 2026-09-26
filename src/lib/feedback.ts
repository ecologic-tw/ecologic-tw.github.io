// 回饋連結（docs/sdd/09、ADR-0005）：網站只產生連結，不內嵌、不送出資料。純函式。
// entry 代號於 2026-09-26 取得（docs/feedback/google-form-design.md）；表單題目刪除重建後須更新。
export const FEEDBACK = {
  formShortUrl: 'https://forms.gle/ZAacF8i7hQ7QF8LC9',
  formPrefillBase:
    'https://docs.google.com/forms/d/e/1FAIpQLSfLYC6tg7ixZLtb6bVbcPQqURNFj7abswN_Y9777z1qS7adaw/viewform',
  fields: {
    type: 'entry.1967567927',
    contentId: 'entry.1393954149',
    mode: 'entry.868715057',
  },
  // 選項題的預填值必須與表單選項文字完全相同
  typeValues: {
    report: '這一題／這張卡有問題',
    feedback: '使用心得與建議',
    submit: '我想投稿一個情境',
  },
  modeValues: { basic: '基礎', advanced: '進階' },
  issueBase: 'https://github.com/ecologic-tw/ecologic-tw.github.io/issues/new',
} as const;

export type FeedbackType = keyof typeof FEEDBACK.typeValues;
export type FeedbackMode = keyof typeof FEEDBACK.modeValues;

/** Google 表單預填連結；沒有設定完整網址時退回短網址（短網址無法帶參數）。 */
export function formUrl(
  options: { type?: FeedbackType; contentId?: string; mode?: FeedbackMode } = {},
): string {
  if (!FEEDBACK.formPrefillBase) return FEEDBACK.formShortUrl;
  const params = new URLSearchParams({ usp: 'pp_url' });
  if (options.type) params.set(FEEDBACK.fields.type, FEEDBACK.typeValues[options.type]);
  if (options.contentId) params.set(FEEDBACK.fields.contentId, options.contentId);
  if (options.mode) params.set(FEEDBACK.fields.mode, FEEDBACK.modeValues[options.mode]);
  return `${FEEDBACK.formPrefillBase}?${params.toString()}`;
}

/** GitHub「內容勘誤」Issue，以欄位 id 預填題目或卡片 ID（Issue Forms 支援）。 */
export function issueUrl(contentId: string): string {
  const params = new URLSearchParams({
    template: 'content-error.yml',
    title: `[勘誤] ${contentId}`,
    'content-id': contentId,
  });
  return `${FEEDBACK.issueBase}?${params.toString()}`;
}
