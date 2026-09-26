import { describe, expect, it } from 'vitest';
import {
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
