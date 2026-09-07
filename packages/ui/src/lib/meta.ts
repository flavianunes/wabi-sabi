/**
 * Component metadata.
 *
 * Every component declares its status in public, and preview and experimental components
 * list what is known to be missing or wrong. Nothing pretends to be finished before it is.
 * The documentation reads these to render each component's status badge.
 */

export type ComponentStatus =
  /** The API is settled. Breaking changes require a major version. */
  | 'stable'
  /** Usable, but the API may still move. Limitations are listed. */
  | 'preview'
  /** Under active exploration. Expect it to change or disappear. */
  | 'experimental'

export interface ComponentMeta {
  /** The component's exported name, e.g. `Button`. */
  name: string
  status: ComponentStatus
  /** The version in which the component first appeared. */
  since: string
  /**
   * What is known not to work, or not to exist yet. Written for someone deciding whether
   * they can use this today — not a changelog.
   */
  knownLimitations: string[]
}
