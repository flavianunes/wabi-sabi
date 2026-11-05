/// <reference types="vite/client" />

/**
 * Defined by the browser test projects in vitest.config.ts to run the stories in a given
 * theme. Undefined in Storybook itself, where the toolbar chooses.
 */
declare const __STORYBOOK_THEME__: 'light' | 'dark' | undefined
