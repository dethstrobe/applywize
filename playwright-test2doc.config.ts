import { defineConfig, devices } from "@playwright/test"

/**
 * Test2Doc Playwright Configuration
 * This config is optimized for generating documentation from your tests.
 */
export default defineConfig({
  // Test directory - adjust to match your project structure
  testDir: "./tests",

  // Test2Doc Reporter Configuration
  reporter: [
    [
      "@test2doc/playwright",
      {
        outputDir: "./doc/docs", // Change this to your Docusaurus docs directory
      },
    ],
  ],

  // Optimized settings for doc generation
  fullyParallel: false,
  workers: 1, // Single worker for consistent output
  retries: 0, // No retries needed for doc generation

  // Use only one browser for faster doc generation
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  use: {
    baseURL: "http://localhost:5173", // change to whatever port your app starts on
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev", // change with command to start your server
    url: "http://localhost:5173", // change to whatever port your app starts on
    reuseExistingServer: !process.env.CI,
  },

  // Optional: Import settings from your main config
  // Uncomment and adjust the path if you want to inherit from your main config
  // ...require('./playwright.config').default,
})
