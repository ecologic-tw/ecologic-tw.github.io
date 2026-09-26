import { describe, expect, it } from 'vitest';
import { FEEDBACK, formUrl, issueUrl } from '../../src/lib/feedback.ts';

const params = (url: string) => new URL(url).searchParams;

describe('formUrl', () => {
  it('prefills type, content id and mode for the report button', () => {
    const url = formUrl({ type: 'report', contentId: 'cons-003', mode: 'basic' });
    expect(url.startsWith(`${FEEDBACK.formPrefillBase}?`)).toBe(true);
    const p = params(url);
    expect(p.get('usp')).toBe('pp_url');
    expect(p.get(FEEDBACK.fields.type)).toBe('這一題／這張卡有問題');
    expect(p.get(FEEDBACK.fields.contentId)).toBe('cons-003');
    expect(p.get(FEEDBACK.fields.mode)).toBe('基礎');
  });

  it('matches the documented example in docs/sdd/09', () => {
    expect(formUrl({ type: 'report', contentId: 'cons-003', mode: 'basic' })).toBe(
      `${FEEDBACK.formPrefillBase}?usp=pp_url&entry.1967567927=%E9%80%99%E4%B8%80%E9%A1%8C%EF%BC%8F%E9%80%99%E5%BC%B5%E5%8D%A1%E6%9C%89%E5%95%8F%E9%A1%8C&entry.1393954149=cons-003&entry.868715057=%E5%9F%BA%E7%A4%8E`,
    );
  });

  it('only prefills mode for the footer link', () => {
    const p = params(formUrl({ mode: 'advanced' }));
    expect(p.has(FEEDBACK.fields.type)).toBe(false);
    expect(p.has(FEEDBACK.fields.contentId)).toBe(false);
    expect(p.get(FEEDBACK.fields.mode)).toBe('進階');
  });

  it('stays on the allowed Google Forms host', () => {
    expect(new URL(formUrl()).origin).toBe('https://docs.google.com');
  });
});

describe('issueUrl', () => {
  it('opens the content-error template with the id prefilled', () => {
    const p = params(issueUrl('straw-man'));
    expect(p.get('template')).toBe('content-error.yml');
    expect(p.get('title')).toBe('[勘誤] straw-man');
    expect(p.get('content-id')).toBe('straw-man');
    expect(issueUrl('straw-man').startsWith(FEEDBACK.issueBase)).toBe(true);
  });
});
