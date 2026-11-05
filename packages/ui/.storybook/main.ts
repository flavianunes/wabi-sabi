import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  typescript: {
    /*
     * react-docgen (Babel), not react-docgen-typescript. The latter drives the TypeScript
     * compiler API, which TypeScript 7.0 does not expose. See AGENTS.md.
     */
    reactDocgen: 'react-docgen',
  },
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      // Match the library build, so a class name means the same thing in both.
      css: { modules: { localsConvention: 'camelCase' } },
    }),
}

export default config
