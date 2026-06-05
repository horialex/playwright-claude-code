import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 30000, // minutes * 1000ms
  expect: {
    timeout: 10 * 1000 // minutes * 1000ms (10 seconds)
  },
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    ...(process.env.PROXY_SERVER ? { proxy: { server: process.env.PROXY_SERVER } } : {}),
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 100,
          ...(process.env.PROXY_SERVER ? { proxy: { server: 'per-context' } } : {}),
        },
      },
    },

    {
      name: 'chromium-local',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 100,
          args: ['--remote-debugging-port=9222'],
          ...(process.env.PROXY_SERVER ? { proxy: { server: 'per-context' } } : {}),
        },
      },
    },


    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome - Samsung Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'Mobile Safari - iPhone 15',
      use: { ...devices['iPhone 15'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
