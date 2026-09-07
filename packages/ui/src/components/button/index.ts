/*
 * `meta` is deliberately not re-exported here.
 *
 * This entry becomes a client module, and React turns every export of a client module
 * into an opaque client reference. Metadata is plain data that documentation reads on the
 * server, so it is exported from '@wabi-sabi/ui/meta' instead.
 */

export type { ButtonProps, ButtonSize, ButtonVariant } from './button'
export { Button } from './button'
