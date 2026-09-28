import { describe, expect, it } from 'vitest';
import { localDate } from '../../src/lib/dates.ts';

describe('localDate', () => {
  it('uses the local calendar day, not the UTC day', () => {
    // 本地時間剛過午夜：UTC+8 的 toISOString() 會是前一天
    expect(localDate(new Date(2026, 8, 29, 0, 30))).toBe('2026-09-29');
    expect(localDate(new Date(2026, 8, 28, 23, 59))).toBe('2026-09-28');
  });

  it('pads month and day', () => {
    expect(localDate(new Date(2027, 0, 5, 12))).toBe('2027-01-05');
  });
});
