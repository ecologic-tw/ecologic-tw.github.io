// @ts-check
import { defineConfig } from 'astro/config';

// CSP 以 <meta> 設定（見 src/layouts/Base.astro、ADR-0011）。
// 為讓 `script-src 'self'; style-src 'self'` 生效，禁止 Astro／Vite 把 CSS、JS、資源內嵌進 HTML。
export default defineConfig({
  site: 'https://ecologic-tw.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'never',
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
