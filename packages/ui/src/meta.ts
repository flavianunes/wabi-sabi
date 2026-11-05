/**
 * Component metadata, as a server-safe entry.
 *
 * This is deliberately separate from the component entries. Every component module is
 * marked "use client", and React turns every export of a client module into an opaque
 * client reference — so a React Server Component importing `meta` from '@wabi-sabi/ui/button'
 * would receive a proxy rather than the object, and reading `.status` off it would fail.
 *
 * Metadata is plain data that documentation reads on the server, so it gets its own entry
 * that the build leaves free of the directive. See scripts/inject-use-client.ts.
 */

export { meta as buttonMeta } from './components/button/meta'
export { meta as textFieldMeta } from './components/text-field/meta'
export type { ComponentMeta, ComponentStatus } from './lib/meta'
