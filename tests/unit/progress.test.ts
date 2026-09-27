import { describe, expect, it } from 'vitest';
import {
  IMPORT_MAX_BYTES,
  answeredBeforeFix,
  clear,
  collect,
  exportJson,
  grantBadges,
  isStorageAvailable,
  markRead,
  parseImport,
  KEY,
  addRewrite,
  defaults,
  load,
  recordAnswer,
  save,
  setMode,
  update,
} from '../../src/lib/progress.ts';

function memory(initial?: string) {
  const data = new Map<string, string>(initial === undefined ? [] : [[KEY, initial]]);
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
}

describe('load', () => {
  it('returns defaults when nothing is stored', () => {
    expect(load(memory())).toEqual(defaults());
  });

  it('returns defaults for broken JSON or the wrong version', () => {
    expect(load(memory('{oops'))).toEqual(defaults());
    expect(load(memory(JSON.stringify({ version: 2 })))).toEqual(defaults());
  });

  it('resets only a damaged field', () => {
    const stored = { ...defaults(), mode: 'advanced', rewrites: 'many' };
    expect(load(memory(JSON.stringify(stored)))).toMatchObject({ mode: 'advanced', rewrites: 0 });
  });

  it('works when storage is unavailable or throws', () => {
    expect(load(undefined)).toEqual(defaults());
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => undefined,
    };
    expect(load(throwing)).toEqual(defaults());
    expect(save(defaults(), throwing)).toBe(false);
  });
});

describe('update', () => {
  it('persists mode, answers and rewrite count', () => {
    const store = memory();
    update(setMode('advanced'), store);
    update(recordAnswer('daily-001', true, '2026-09-26T00:00:00.000Z'), store);
    update(addRewrite, store);
    expect(load(store)).toEqual({
      ...defaults(),
      mode: 'advanced',
      answered: { 'daily-001': { correct: true, at: '2026-09-26T00:00:00.000Z' } },
      rewrites: 1,
    });
  });

  it('overwrites an earlier answer to the same question', () => {
    const store = memory();
    update(recordAnswer('daily-001', false, 'a'), store);
    update(recordAnswer('daily-001', true, 'b'), store);
    expect(load(store).answered['daily-001']).toEqual({ correct: true, at: 'b' });
  });
});

const known = {
  scenarios: new Set(['daily-001', 'cons-001']),
  entries: new Set(['straw-man', 'modus-ponens']),
  badges: new Set(['first-step', 'gentle']),
};

const valid = {
  version: 1,
  mode: 'advanced',
  answered: { 'daily-001': { correct: true, at: '2026-09-26T00:00:00.000Z' } },
  rewrites: 2,
  collected: ['modus-ponens'],
  read: ['straw-man'],
  badges: ['first-step'],
};

describe('collect / markRead / grantBadges', () => {
  it('add ids once and never remove earned badges', () => {
    let p = defaults();
    p = collect('modus-ponens')(collect('modus-ponens')(p));
    p = markRead('straw-man')(p);
    p = grantBadges(['first-step'])(grantBadges(['first-step', 'gentle'])(p));
    expect(p.collected).toEqual(['modus-ponens']);
    expect(p.read).toEqual(['straw-man']);
    expect(p.badges).toEqual(['first-step', 'gentle']);
  });
});

describe('clear', () => {
  it('removes the stored progress', () => {
    const store = memory(JSON.stringify({ ...defaults(), rewrites: 3 }));
    expect(clear(store)).toBe(true);
    expect(load(store)).toEqual(defaults());
  });
});

describe('isStorageAvailable', () => {
  it('detects missing or blocked storage', () => {
    expect(isStorageAvailable(memory())).toBe(true);
    expect(isStorageAvailable(undefined)).toBe(false);
    const blocked = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
    };
    expect(isStorageAvailable(blocked)).toBe(false);
  });
});

describe('export / import round trip', () => {
  it('imports what it exported', () => {
    const p = { ...defaults(), ...valid } as ReturnType<typeof defaults>;
    const result = parseImport(exportJson(p), known);
    expect(result).toEqual({ ok: true, dropped: 0, progress: p });
  });
});

describe('parseImport rejects malicious or broken files (M3 驗收)', () => {
  it('rejects files larger than 100 KB', () => {
    const big = JSON.stringify({ ...valid, padding: 'x'.repeat(IMPORT_MAX_BYTES) });
    expect(parseImport(big, known)).toEqual({ ok: false, reason: 'too-large' });
  });

  it('counts bytes, not characters (multi-byte text)', () => {
    const chinese = JSON.stringify({ ...valid, note: '字'.repeat(40_000) });
    expect(chinese.length).toBeLessThan(IMPORT_MAX_BYTES);
    expect(parseImport(chinese, known)).toEqual({ ok: false, reason: 'too-large' });
  });

  it('rejects non-JSON', () => {
    expect(parseImport('<script>alert(1)</script>', known)).toEqual({
      ok: false,
      reason: 'not-json',
    });
  });

  it.each([
    ['wrong version', { ...valid, version: 2 }],
    ['wrong mode', { ...valid, mode: 'god' }],
    ['answer not boolean', { ...valid, answered: { 'daily-001': { correct: 'yes', at: 't' } } }],
    ['negative rewrites', { ...valid, rewrites: -1 }],
    ['huge rewrites', { ...valid, rewrites: 1e9 }],
    ['collected not an array', { ...valid, collected: 'straw-man' }],
    ['overlong id', { ...valid, collected: ['a'.repeat(65)] }],
    ['array instead of object', [valid]],
    ['null', null],
  ])('rejects %s', (_label, data) => {
    expect(parseImport(JSON.stringify(data), known)).toEqual({ ok: false, reason: 'invalid' });
  });

  it('drops unknown ids and unknown fields instead of keeping them', () => {
    const data = {
      ...valid,
      answered: {
        ...valid.answered,
        'daily-999': { correct: true, at: 't' },
        '<img src=x onerror=alert(1)>': { correct: true, at: 't' },
      },
      collected: ['modus-ponens', 'javascript:alert(1)'],
      badges: ['first-step', 'fake-badge'],
      extra: '<script>alert(1)</script>',
    };
    const result = parseImport(JSON.stringify(data), known);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.dropped).toBe(4);
    expect(Object.keys(result.progress.answered)).toEqual(['daily-001']);
    expect(result.progress.collected).toEqual(['modus-ponens']);
    expect(result.progress.badges).toEqual(['first-step']);
    expect(JSON.stringify(result.progress)).not.toMatch(/script|onerror|javascript:/);
  });

  it('does not pollute prototypes through __proto__ keys', () => {
    const text = `{"version":1,"mode":"basic","answered":{"__proto__":{"correct":true,"at":"t"}},"rewrites":0,"collected":[],"badges":[],"__proto__":{"polluted":true}}`;
    const result = parseImport(text, known);
    expect(result.ok).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    if (result.ok) expect(Object.getPrototypeOf(result.progress.answered)).toBe(Object.prototype);
  });

  it('accepts files exported before the read field existed', () => {
    const old: Partial<typeof valid> = { ...valid };
    delete old.read;
    const result = parseImport(JSON.stringify(old), known);
    expect(result.ok && result.progress.read).toEqual([]);
  });
});

describe('answeredBeforeFix (ADR-0025)', () => {
  it('treats answers up to and including the fix date as before the fix', () => {
    expect(answeredBeforeFix({ at: '2026-09-26T23:00:00.000Z' }, '2026-09-27')).toBe(true);
    expect(answeredBeforeFix({ at: '2026-09-27T10:00:00.000Z' }, '2026-09-27')).toBe(true);
    expect(answeredBeforeFix({ at: '2026-09-28T00:00:00.000Z' }, '2026-09-27')).toBe(false);
  });
});
