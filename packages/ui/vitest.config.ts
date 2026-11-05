import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

/**
 * The stories run as tests in a real browser, once per theme. happy-dom cannot compute
 * colour contrast, so this is where axe checks it — against both palettes.
 */
const storybookProject = (theme: 'light' | 'dark') => ({
  extends: true,
  plugins: [storybookTest({ configDir: '.storybook' })],
  define: { __STORYBOOK_THEME__: JSON.stringify(theme) },
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' as const }],
    },
  },
})

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'happy-dom',
          setupFiles: ['./vitest.setup.ts'],
          css: true,
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      storybookProject('light'),
      storybookProject('dark'),
    ],
  },
})
