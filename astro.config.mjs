// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { ecologicAdvanced, ecologicTerms } from './src/lib/markdown-ecologic.ts';
import { loadTermInfo } from './src/lib/terms-source.ts';

// CSP 以 <meta> 設定（見 src/layouts/Base.astro、ADR-0011）。
// 為讓 `script-src 'self'; style-src 'self'` 生效，禁止 Astro／Vite 把 CSS、JS、資源內嵌進 HTML。
export default defineConfig({
  site: 'https://ecologic-tw.github.io',
  output: 'static',
  trailingSlash: 'always',
  // e2e 測試以含草稿的內容另行建置，避免覆蓋正式產物
  outDir: process.env.ECOLOGIC_DRAFTS === '1' ? './dist-drafts' : './dist',
  build: {
    inlineStylesheets: 'never',
  },
  markdown: {
    processor: satteri({ hastPlugins: [ecologicTerms(loadTermInfo()), ecologicAdvanced] }),
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
