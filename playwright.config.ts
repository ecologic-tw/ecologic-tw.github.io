import { defineConfig, devices } from '@playwright/test';

// e2e 以「含草稿」的建置執行（ECOLOGIC_DRAFTS=1 → dist-drafts/），才能測到尚未審核的內容頁。
const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx astro build && npx astro preview --port ${PORT}`,
    env: { ECOLOGIC_DRAFTS: '1' },
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
