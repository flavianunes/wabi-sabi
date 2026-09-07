/**
 * Motion tokens, as values usable inside Motion.
 *
 * This file mirrors styles/motion.css. The CSS is the source of truth for anything a
 * consumer might override; this is the source of truth for anything passed to Motion,
 * which needs numbers rather than CSS strings.
 *
 * Two sources of truth is a real risk, so `motion/tokens.test.ts` asserts the keys here
 * match the custom properties declared there.
 */

/** Durations in seconds, which is the unit Motion expects. */
export const duration = {
  instant: 0.08,
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
} as const

/**
 * Cubic bezier control points, in Motion's array form.
 *
 * There is no ease-in curve on purpose. Ease-in starts slow, delaying the moment the user
 * is actually watching, so it is never right for UI.
 */
export const ease = {
  /** Entering decelerates into place. */
  enter: [0.23, 1, 0.32, 1],
  /** Leaving also decelerates; see the note above. */
  exit: [0.23, 1, 0.32, 1],
  /** For something moving or morphing on screen, rather than arriving or leaving. */
  move: [0.77, 0, 0.175, 1],
} as const

/** Spring configuration, for movement that should feel physical rather than timed. */
export const spring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.6,
} as const

/** Offsets, in pixels, for movement that accompanies a fade. */
export const distance = {
  sm: 4,
  md: 8,
} as const

export type Duration = keyof typeof duration
export type Ease = keyof typeof ease
export type Distance = keyof typeof distance
