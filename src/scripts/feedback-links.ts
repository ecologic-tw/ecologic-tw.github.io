// 回饋表單連結帶入目前模式（docs/sdd/09）。建置時預設「基礎」；有 JavaScript 時依實際模式更新。
import { formUrl, type FeedbackType } from '../lib/feedback.ts';

function refresh() {
  const mode = document.documentElement.dataset.mode === 'advanced' ? 'advanced' : 'basic';
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-feedback-form]')) {
    const type = link.dataset.feedbackType as FeedbackType | undefined;
    const contentId = link.dataset.contentId || undefined;
    link.href = formUrl({ type, contentId, mode });
  }
}

refresh();
document.addEventListener('ecologic:mode', refresh);
