/**
 * Type declarations for stylesheet imports.
 *
 * Without these, `tsc --noEmit` fails on every `import styles from './x.module.css'` and
 * on the side-effect import of the token stylesheet.
 */

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css' {
  const content: string
  export default content
}
