// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      'dist/',
      'dist-drafts/',
      '.astro/',
      'node_modules/',
      'coverage/',
      'test-results/',
      'playwright-report/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    // docs/sdd/07：使用者輸入一律 textContent，永不 innerHTML。
    rules: {
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: '請改用 textContent（docs/sdd/07）。' },
        { property: 'outerHTML', message: '請改用 DOM API（docs/sdd/07）。' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: '請改用 DOM API（docs/sdd/07）。',
        },
      ],
    },
  },
);
