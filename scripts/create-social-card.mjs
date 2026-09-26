// 自託管分享圖，以既有字型與 Playwright 產生；無外部請求。
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const cssPath = resolve('node_modules/@fontsource/lxgw-wenkai-tc/400.css');
const theme = readFileSync('src/styles/global.css', 'utf8');
const color = (name) => {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-f]+)`, 'i').exec(theme)?.[1];
  if (!value) throw new Error(`Missing theme color: ${name}`);
  return value;
};
const css = readFileSync(cssPath, 'utf8').replace(/url\(([^)]+)\)/g, (_match, path) => {
  const font = readFileSync(resolve(dirname(cssPath), path.replace(/["']/g, '')));
  return `url(data:font/woff2;base64,${font.toString('base64')})`;
});
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<style>${css}
    * { box-sizing: border-box; } body { margin:0; background:${color('paper')}; color:${color('ink')}; padding:72px 88px; font-family:'LXGW WenKai TC',serif; }
    main { border-left:8px solid ${color('moss')}; padding-left:44px; }
    .en { font:24px sans-serif; letter-spacing:6px; color:${color('moss')}; }
    h1 { font-size:96px; font-weight:400; margin:28px 0 18px; }
    p { font-size:32px; line-height:1.7; margin:0; }
    footer { margin-top:54px; font:20px sans-serif; letter-spacing:2px; }
    </style><main><div class="en">ECOLOGIC / FIELD NOTES</div><h1>邏生門</h1><p>學會檢查推理，<br>而不是替別人貼標籤。</p></main><footer>ecologic-tw.github.io</footer>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-card.png' });
} finally {
  await browser.close();
}
