/**
 * Motion tokens exist in two places — motion.css for CSS, tokens.ts for Motion — so this
 * asserts the two do not drift apart.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { distance, duration } from './tokens'

const css = readFileSync(join(import.meta.dirname, '../styles/motion.css'), 'utf8')

function cssTokenNames(prefix: string): string[] {
  return [...css.matchAll(new RegExp(String.raw`--ws-${prefix}-([a-z]+)\s*:`, 'g'))]
    .map((match) => match[1] as string)
    .sort()
}

describe('motion tokens', () => {
  it('declares the same durations in CSS and TypeScript', () => {
    expect(cssTokenNames('duration')).toEqual(Object.keys(duration).sort())
  })

  it('declares the same distances in CSS and TypeScript', () => {
    expect(cssTokenNames('distance')).toEqual(Object.keys(distance).sort())
  })

  it('matches each duration value, allowing for ms in CSS and seconds in TypeScript', () => {
    for (const [name, seconds] of Object.entries(duration)) {
      const ms = css.match(new RegExp(String.raw`--ws-duration-${name}\s*:\s*(\d+)ms`))?.[1]
      expect(ms, `--ws-duration-${name}`).toBeDefined()
      expect(Number(ms) / 1000, `--ws-duration-${name}`).toBe(seconds)
    }
  })

  it('matches each distance value', () => {
    for (const [name, px] of Object.entries(distance)) {
      const value = css.match(new RegExp(String.raw`--ws-distance-${name}\s*:\s*(\d+)px`))?.[1]
      expect(Number(value), `--ws-distance-${name}`).toBe(px)
    }
  })
})
