/**
 * Shared loading for the token build and the contrast check.
 *
 * Style Dictionary does the parsing, DTCG validation and reference resolution. Each theme
 * is a separate dictionary: the primitives and component tokens plus that theme's
 * semantic file. Both semantic files declare the same names, so they cannot be loaded
 * into one dictionary without colliding.
 */

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import type { TransformedToken } from 'style-dictionary/types'

export const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const TOKENS_DIR = join(ROOT, 'tokens')

export const THEMES = ['light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export function sourcesFor(theme: Theme): string[] {
  return [
    join(TOKENS_DIR, 'primitives.json'),
    join(TOKENS_DIR, 'components.json'),
    join(TOKENS_DIR, `semantic.${theme}.json`),
  ]
}

export function createDictionary(theme: Theme, platforms: StyleDictionary['platforms'] = {}) {
  return new StyleDictionary({
    source: sourcesFor(theme),
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'error' },
    // An empty transform list: values are converted per platform in build.ts, explicitly,
    // rather than through transform groups whose behaviour changes between majors.
    platforms: { raw: { transforms: [] }, ...platforms },
  })
}

export interface ThemeTokens {
  all: TransformedToken[]
  /** Semantic tokens: those declared in the theme's semantic file. */
  semantic: TransformedToken[]
}

export async function loadTheme(theme: Theme): Promise<ThemeTokens> {
  const { allTokens } = await createDictionary(theme).getPlatformTokens('raw')
  return {
    all: allTokens,
    semantic: allTokens.filter((token) => token.filePath.endsWith(`semantic.${theme}.json`)),
  }
}

export function isSemantic(token: TransformedToken): boolean {
  return /semantic\.(light|dark)\.json$/.test(token.filePath)
}

/** The path a reference like `{color.neutral.light.1}` points at, or undefined. */
export function referencePath(token: TransformedToken): string[] | undefined {
  const original = token.original.$value
  if (typeof original !== 'string') return undefined
  const match = original.match(/^\{([^}]+)\}$/)
  return match?.[1]?.split('.')
}

// Contrast ---------------------------------------------------------------------------------

function channelLuminance(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Relative luminance of a #rrggbb colour. Alpha, if present, is ignored. */
export function relativeLuminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1, 7), 16)
  const r = channelLuminance((value >> 16) & 0xff)
  const g = channelLuminance((value >> 8) & 0xff)
  const b = channelLuminance(value & 0xff)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.1 contrast ratio, between 1 and 21. */
export function contrast(a: string, b: string): number {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
