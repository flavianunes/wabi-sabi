import { toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

/**
 * jest-axe ships Jest-shaped matcher types, so the matcher has to be declared for
 * Vitest's `expect`. The type parameters must match Vitest's own `Assertion<R, T>`
 * declaration exactly, or TypeScript rejects the merge.
 */
declare module 'vitest' {
  interface Assertion<R, T> {
    toHaveNoViolations(): void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
