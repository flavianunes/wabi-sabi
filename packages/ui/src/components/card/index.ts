/*
 * `meta` is deliberately not re-exported here: this entry becomes a client module, and
 * React turns every export of a client module into an opaque client reference. Metadata
 * is exported from '@wabi-sabi/ui/meta' instead.
 */

export type { CardProps } from './card'
export { Card } from './card'
