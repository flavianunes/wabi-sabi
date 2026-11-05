import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'
import './preview.css'

/**
 * The theme the stories start in. The browser tests run once per theme by setting it, so
 * axe checks both palettes in a real browser, where it can compute colour contrast.
 */
const initialTheme =
  typeof __STORYBOOK_THEME__ !== 'undefined' && __STORYBOOK_THEME__ === 'dark' ? 'dark' : 'light'

const preview: Preview = {
  decorators: [
    // The same attribute a consuming app sets: <html data-theme="dark">.
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: initialTheme,
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
  initialGlobals: { theme: initialTheme },
  parameters: {
    // An accessibility violation fails the story's test, not just the panel.
    a11y: { test: 'error' },
    controls: { expanded: true, sort: 'requiredFirst' },
    layout: 'padded',
    // Chromatic captures every story in both themes.
    chromatic: {
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
