import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

// DESIGN.md 與 src/styles/global.css 的色票必須一致（DESIGN.md 描述、CSS 實作）
const design = parse(readFileSync('DESIGN.md', 'utf8').split(/^---$/m)[1] ?? '') as {
  colors: Record<string, string>;
};
const css = readFileSync('src/styles/global.css', 'utf8');

function cssVars(block: string): Map<string, string> {
  return new Map(
    [...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [
      m[1] ?? '',
      (m[2] ?? '').toUpperCase(),
    ]),
  );
}

const light = cssVars(/:root \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '');
const dark = cssVars(
  /prefers-color-scheme: dark\) \{\s*:root \{([\s\S]*?)\n {2}\}/.exec(css)?.[1] ?? '',
);
const ROLES: Record<string, string> = {
  primary: 'ink',
  secondary: 'moss',
  tertiary: 'soil',
  neutral: 'paper',
};

describe('DESIGN.md colours match global.css', () => {
  it('finds both palettes in the CSS', () => {
    expect(light.size).toBeGreaterThan(5);
    expect(dark.size).toBeGreaterThan(5);
  });

  for (const [name, value] of Object.entries(design.colors)) {
    it(name, () => {
      const isDark = name.endsWith('-dark');
      const base = ROLES[name] ?? name.replace(/-dark$/, '');
      const expected = (isDark ? dark : light).get(base);
      expect(expected, `global.css 缺少 --${base}`).toBeDefined();
      expect(value.toUpperCase()).toBe(expected);
    });
  }

  it('every CSS colour is described in DESIGN.md', () => {
    for (const name of light.keys()) expect(design.colors[name]).toBeDefined();
    for (const name of dark.keys()) expect(design.colors[`${name}-dark`]).toBeDefined();
  });
});
