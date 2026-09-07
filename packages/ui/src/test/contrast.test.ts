/**
 * Contrast is verified, not asserted in a table.
 *
 * The planning document claims specific contrast ranges for every scale in both colour
 * modes. Those claims are only worth anything if something checks them, so this reads the
 * actual token values out of the CSS and computes the ratios.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const STYLES = join(import.meta.dirname, '../styles')

const SCALES = ['neutral', 'sakura', 'blue', 'green', 'yellow', 'red'] as const
type Scale = (typeof SCALES)[number]

/** Parses `--ws-name: #hex;` declarations out of a stylesheet. */
function parseTokens(css: string): Map<string, string> {
  const tokens = new Map<string, string>()
  for (const match of css.matchAll(/--ws-([a-z0-9-]+)\s*:\s*(#[0-9a-f]{6})\b/gi)) {
    const [, name, hex] = match
    if (name && hex && !tokens.has(name)) tokens.set(name, hex.toLowerCase())
  }
  return tokens
}

/**
 * Dark mode values appear twice in dark.css — once for the explicit [data-theme] and once
 * inside the media query. Reading the first occurrence of each is enough, and a mismatch
 * between the two copies is caught by its own test below.
 *
 * The selector is matched with either quote style, so a formatter switching between them
 * cannot quietly turn this file into a test that parses nothing and asserts nothing.
 */
function parseDarkBlock(css: string): Map<string, string> {
  const start = css.search(/\[data-theme=["']dark["']\]/)
  if (start === -1) throw new Error('No [data-theme="dark"] block found in dark.css')
  const end = css.indexOf('@media', start)
  return parseTokens(css.slice(start, end === -1 ? undefined : end))
}

const primitivesCss = readFileSync(join(STYLES, 'primitives.css'), 'utf8')
const darkCss = readFileSync(join(STYLES, 'dark.css'), 'utf8')
const semanticCss = readFileSync(join(STYLES, 'semantic.css'), 'utf8')

const light = parseTokens(primitivesCss)
const dark = parseDarkBlock(darkCss)

// A parser that silently matches nothing turns every assertion below into a test of the
// parser rather than of the tokens. Six scales of twelve steps is the floor.
if (light.size < 72 || dark.size < 72) {
  throw new Error(
    `Token parsing failed: found ${light.size} light and ${dark.size} dark values, expected at least 72 of each.`,
  )
}

function channelLuminance(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16)
  const r = channelLuminance((value >> 16) & 0xff)
  const g = channelLuminance((value >> 8) & 0xff)
  const b = channelLuminance(value & 0xff)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.1 contrast ratio, between 1 and 21. */
function contrast(a: string, b: string): number {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

function tokenOf(mode: Map<string, string>, name: string): string {
  const value = mode.get(name)
  if (!value) throw new Error(`Token --ws-${name} not found`)
  return value
}

const MODES = [
  ['light', light],
  ['dark', dark],
] as const

const AA_TEXT = 4.5

describe('token values', () => {
  it('defines all twelve steps of all six scales in both modes', () => {
    for (const [modeName, mode] of MODES) {
      for (const scale of SCALES) {
        for (let step = 1; step <= 12; step++) {
          expect(mode.get(`${scale}-${step}`), `${modeName} --ws-${scale}-${step}`).toMatch(
            /^#[0-9a-f]{6}$/,
          )
        }
      }
    }
  })

  it('keeps step 9 identical across modes, because it is the brand colour', () => {
    for (const scale of SCALES) {
      expect(tokenOf(dark, `${scale}-9`), `--ws-${scale}-9`).toBe(tokenOf(light, `${scale}-9`))
    }
  })

  it('repeats the dark values identically in the prefers-color-scheme block', () => {
    const mediaStart = darkCss.indexOf('@media')
    const inMedia = parseTokens(darkCss.slice(mediaStart))

    expect(inMedia.size).toBeGreaterThan(0)
    for (const [name, value] of dark) {
      expect(inMedia.get(name), `--ws-${name} inside @media`).toBe(value)
    }
  })
})

describe('contrast', () => {
  // Body text on a subtle background.
  it.each(SCALES)('%s step 11 on step 2 meets AA in both modes', (scale: Scale) => {
    for (const [modeName, mode] of MODES) {
      const ratio = contrast(tokenOf(mode, `${scale}-11`), tokenOf(mode, `${scale}-2`))
      expect(ratio, `${modeName} ${scale}-11 on ${scale}-2`).toBeGreaterThanOrEqual(AA_TEXT)
    }
  })

  // Headings on the page background.
  it.each(SCALES)('%s step 12 on step 1 meets AA in both modes', (scale: Scale) => {
    for (const [modeName, mode] of MODES) {
      const ratio = contrast(tokenOf(mode, `${scale}-12`), tokenOf(mode, `${scale}-1`))
      expect(ratio, `${modeName} ${scale}-12 on ${scale}-1`).toBeGreaterThanOrEqual(AA_TEXT)
    }
  })

  // White on a solid fill — how every solid button is coloured. Yellow is excluded
  // because its scale is deliberately bright; see the --ws-on-warning case below.
  it.each(SCALES.filter((s) => s !== 'yellow'))(
    'white on %s step 9 meets AA in both modes',
    (scale: Scale) => {
      const white = tokenOf(light, 'white')
      for (const [modeName, mode] of MODES) {
        const ratio = contrast(white, tokenOf(mode, `${scale}-9`))
        expect(ratio, `${modeName} white on ${scale}-9`).toBeGreaterThanOrEqual(AA_TEXT)
      }
    },
  )

  /**
   * The yellow exception, asserted so nobody "corrects" it.
   *
   * --ws-on-warning is the only token that does not invert between modes. Yellow's scale
   * is bright at step 9 in both modes, so text on it must be dark in both modes.
   */
  it('uses a fixed dark --ws-on-warning that meets AA on yellow-9 in both modes', () => {
    const onWarning = semanticCss.match(/--ws-on-warning:\s*(#[0-9a-f]{6})/i)?.[1]?.toLowerCase()
    expect(onWarning, '--ws-on-warning must be a literal hex, not a var()').toBe('#423000')
    if (!onWarning) return

    // White would fail badly here, which is the whole reason for the exception.
    expect(contrast(tokenOf(light, 'white'), tokenOf(light, 'yellow-9'))).toBeLessThan(AA_TEXT)

    for (const [modeName, mode] of MODES) {
      const ratio = contrast(onWarning, tokenOf(mode, 'yellow-9'))
      expect(ratio, `${modeName} --ws-on-warning on yellow-9`).toBeGreaterThanOrEqual(AA_TEXT)
    }
  })
})
