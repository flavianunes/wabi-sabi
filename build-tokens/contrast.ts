/**
 * Fails the build when a semantic colour pair misses WCAG AA in either theme.
 *
 *   node build-tokens/contrast.ts
 *
 * Contrast is verified, not asserted in a table: this resolves the semantic tokens from the
 * same JSON the build reads and computes the ratios. Each pair is one a component actually
 * puts together — text on a surface, a label on a fill, a focus ring on the page.
 */

import { contrast, isSemantic, loadTheme, THEMES, type Theme, type ThemeTokens } from './lib.ts'

/** Text: 4.5:1 (WCAG 1.4.3). Interface components and focus indicators: 3:1 (1.4.11). */
const AA_TEXT = 4.5
const AA_UI = 3

type Pair = [foreground: string, background: string, minimum: number]

const SURFACES = ['canvas', 'base', 'elevated', 'control']
const STATUSES = ['info', 'success', 'warning', 'danger']

const PAIRS: Pair[] = [
  // Body text on every surface a component sits on.
  ...['text-strong', 'text-default', 'text-subtle'].flatMap((text) =>
    SURFACES.map((surface): Pair => [text, surface, AA_TEXT]),
  ),
  ['text-placeholder', 'canvas', AA_TEXT],
  ['text-inverse', 'contrast', AA_TEXT],
  ['link', 'canvas', AA_TEXT],

  // A label on a solid fill, at rest and on hover.
  ['on-accent', 'accent', AA_TEXT],
  ['on-accent', 'accent-hover', AA_TEXT],
  ['accent-text', 'accent-tint', AA_TEXT],
  ['accent-text', 'canvas', AA_TEXT],
  ...STATUSES.flatMap((status): Pair[] => [
    [`on-${status}`, status, AA_TEXT],
    [`${status}-text`, `${status}-tint`, AA_TEXT],
    [`${status}-text`, 'canvas', AA_TEXT],
  ]),

  // Indicators that identify a control or its state.
  ['focus', 'canvas', AA_UI],
  ['focus', 'base', AA_UI],
  ['line-strong', 'canvas', AA_UI],
  ['line-strong', 'base', AA_UI],
]

const themes = {
  light: await loadTheme('light'),
  dark: await loadTheme('dark'),
} satisfies Record<Theme, ThemeTokens>

const failures: string[] = []
const fail = (message: string) => failures.push(message)

function colourOf(theme: Theme, name: string): string {
  const token = themes[theme].semantic.find((t) => t.path.join('-') === name)
  if (!token) throw new Error(`Semantic token "${name}" does not exist in ${theme}`)
  return String(token.$value)
}

for (const theme of THEMES) {
  for (const [foreground, background, minimum] of PAIRS) {
    const ratio = contrast(colourOf(theme, foreground), colourOf(theme, background))
    if (ratio < minimum) {
      fail(`${theme}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1, needs ${minimum}:1`)
    }
  }
}

// Invariants carried over from the identity decisions in the scales --------------------

/** Step 9 is the brand colour of each scale; it does not change between themes. */
const primitive = (theme: Theme, path: string) =>
  themes[theme].all.find((t) => !isSemantic(t) && t.path.join('.') === path)?.$value

for (const scale of ['neutral', 'sakura', 'blue', 'green', 'yellow', 'red']) {
  const light = primitive('light', `color.${scale}.light.9`)
  const dark = primitive('light', `color.${scale}.dark.9`)
  if (!light || light !== dark) fail(`color.${scale} step 9 differs between modes`)
}

/**
 * on-warning is the one colour fixed across themes: yellow-9 is bright in both, so text on
 * it is dark in both. White would fail, which is the reason for the exception.
 */
if (colourOf('light', 'on-warning') !== colourOf('dark', 'on-warning')) {
  fail('on-warning must be the same literal colour in both themes')
}
if (contrast('#ffffff', colourOf('light', 'warning')) >= AA_TEXT) {
  fail('white now passes on warning; the on-warning exception may no longer be needed')
}

if (failures.length > 0) {
  console.error(`\nContrast check failed:\n\n  ${failures.join('\n  ')}\n`)
  process.exit(1)
}

console.log(`Contrast: ${PAIRS.length} pairs pass WCAG AA in ${THEMES.join(' and ')}.`)
