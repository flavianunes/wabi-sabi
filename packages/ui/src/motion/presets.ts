/**
 * Movement presets.
 *
 * Every preset animates only `opacity`, `transform`, `filter` or `clipPath`. This is not
 * a stylistic preference: Base UI keeps a portalled element mounted only while it detects
 * a running animation through `element.getAnimations()`, and Motion hardware-accelerates
 * only those four properties. A preset animating anything else (`height`, most obviously)
 * would cause Base UI to unmount the element before the exit finished, so the exit would
 * never be seen.
 *
 * `prefers-reduced-motion` is handled here, in one layer, rather than in each component.
 */

import { duration, ease } from './tokens'

/** A variant set for a component that mounts, unmounts, and can be interrupted. */
export interface TransitionPreset {
  initial: Record<string, unknown>
  animate: Record<string, unknown>
  exit: Record<string, unknown>
  transition: Record<string, unknown>
}

/** Fades in place. The most neutral entrance available. */
export const fade: TransitionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.fast, ease: ease.enter },
}

/** Fades while scaling up slightly. For things anchored to a trigger, like a popover. */
export const scaleFade: TransitionPreset = {
  initial: { opacity: 0, transform: 'scale(0.96)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.96)' },
  transition: { duration: duration.base, ease: ease.enter },
}

/**
 * The reduced-motion counterpart to any preset: the same start and end states, with the
 * movement removed rather than the transition removed. Opacity is kept because a fade is
 * not vestibular motion; only the transform is dropped.
 */
export const reduced: TransitionPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: duration.instant, ease: ease.exit },
}

/**
 * Picks between a preset and its reduced-motion counterpart.
 *
 * @param preset - The preset to use when motion is welcome.
 * @param prefersReduced - Result of Motion's `useReducedMotion()`.
 */
export function resolvePreset(
  preset: TransitionPreset,
  prefersReduced: boolean | null,
): TransitionPreset {
  return prefersReduced ? reduced : preset
}

/**
 * Press feedback.
 *
 * Deliberately not a spring, and deliberately not driven by Motion. A press is something
 * the user does tens of times a day, which puts it in the tier where motion must be
 * near-imperceptible or absent — and a `:active` CSS transition is both cheaper and more
 * responsive than a JS-driven spring for a state the browser already tracks.
 *
 * Springs earn their cost for drag, momentum, and gestures the user can interrupt or
 * reverse. A press is none of those.
 *
 * These values exist here so the number is shared and documented; the implementation
 * lives in each component's CSS.
 */
export const press = {
  /** Scales children too, which is what makes it read as a physical press. */
  scale: 0.97,
  /** Milliseconds. Button press feedback belongs in the 100–160ms range. */
  durationMs: 160,
} as const
