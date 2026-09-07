/**
 * Scaffolds a component.
 *
 * The structure of a component stops depending on anyone remembering it. This generates
 * the five files, registers the build entry and the export subpath, and creates the
 * documentation page.
 *
 *   pnpm new-component toggle
 */

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PKG = join(ROOT, 'packages/ui')

const kebab = process.argv[2]

if (!kebab || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(kebab)) {
  console.error('Usage: pnpm new-component <kebab-case-name>\n\nExample: pnpm new-component toggle')
  process.exit(1)
}

/** kebab-case to PascalCase: `split-text` becomes `SplitText`. */
const Pascal = kebab
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')

/** kebab-case to camelCase, for CSS Module class names. */
const camel = Pascal.charAt(0).toLowerCase() + Pascal.slice(1)

const dir = join(PKG, 'src/components', kebab)

if (existsSync(dir)) {
  console.error(`packages/ui/src/components/${kebab} already exists.`)
  process.exit(1)
}

const component = `import styles from './${kebab}.module.css'

export interface ${Pascal}Props {
  /** TODO: document every public prop. The documentation extracts its table from here. */
  children?: React.ReactNode
  className?: string
}

/**
 * TODO: describe what this component is for.
 *
 * Do not add a client directive to this file; the build injects it. See AGENTS.md.
 */
export function ${Pascal}({ children, className }: ${Pascal}Props) {
  const classes = [styles.${camel}, className].filter(Boolean).join(' ')

  return <div className={classes}>{children}</div>
}

${Pascal}.displayName = '${Pascal}'
`

const css = `/**
 * ${Pascal}.
 *
 * Only semantic and component tokens here. Referencing a primitive (--ws-neutral-11 and
 * friends) is a Stylelint error.
 */

.${camel} {
  color: var(--ws-text-default);
}
`

const test = `import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { ${Pascal} } from './${kebab}'

describe('${Pascal}', () => {
  it('renders its children', () => {
    render(<${Pascal}>content</${Pascal}>)

    expect(screen.getByText('content')).toBeDefined()
  })

  // TODO: cover the behaviour that matters, and the keyboard interaction.

  it('has no accessibility violations', async () => {
    const { container } = render(<${Pascal}>content</${Pascal}>)

    expect(await axe(container)).toHaveNoViolations()
  })
})
`

const meta = `import type { ComponentMeta } from '../../lib/meta'

export const meta: ComponentMeta = {
  name: '${Pascal}',
  status: 'experimental',
  since: '0.0.0',
  knownLimitations: [
    'TODO: list what does not work yet. An empty list on an experimental component is a lie.',
  ],
}
`

const index = `/*
 * \`meta\` is deliberately not re-exported here: this entry becomes a client module, and
 * React turns every export of a client module into an opaque client reference. Metadata
 * is exported from '@wabi-sabi/ui/meta' instead.
 */

export type { ${Pascal}Props } from './${kebab}'
export { ${Pascal} } from './${kebab}'
`

const page = `import { ${Pascal} } from '@wabi-sabi/ui/${kebab}'
import { ${camel}Meta } from '@wabi-sabi/ui/meta'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${Pascal}',
}

export default function ${Pascal}Page() {
  return (
    <main className="page">
      <p>
        <Link href="/">← Back</Link>
      </p>

      <h1>${Pascal}</h1>
      <p>
        <span className="status">{${camel}Meta.status}</span>
      </p>

      <h2>Example</h2>
      <div className="row">
        <${Pascal}>TODO</${Pascal}>
      </div>

      {/* TODO: props table, keyboard table, and a note on movement. */}

      <h2>Known limitations</h2>
      <ul className="limitations">
        {${camel}Meta.knownLimitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
    </main>
  )
}
`

await mkdir(dir, { recursive: true })
await Promise.all([
  writeFile(join(dir, `${kebab}.tsx`), component),
  writeFile(join(dir, `${kebab}.module.css`), css),
  writeFile(join(dir, `${kebab}.test.tsx`), test),
  writeFile(join(dir, 'meta.ts'), meta),
  writeFile(join(dir, 'index.ts'), index),
])

const docsDir = join(ROOT, 'apps/docs/src/app/components', kebab)
await mkdir(docsDir, { recursive: true })
await writeFile(join(docsDir, 'page.tsx'), page)

// Register the export subpath. npm reads this, so it has to be explicit.
const pkgPath = join(PKG, 'package.json')
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
const exports: Record<string, unknown> = {}
for (const [key, value] of Object.entries(pkg.exports)) {
  // Keep the plain-string entries (styles.css, package.json) last.
  if (key === './styles.css') {
    exports[`./${kebab}`] = {
      types: `./dist/${kebab}.d.ts`,
      import: `./dist/${kebab}.js`,
    }
  }
  exports[key] = value
}
pkg.exports = exports
await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

// Register the build entry.
const configPath = join(PKG, 'tsdown.config.ts')
const config = await readFile(configPath, 'utf8')
await writeFile(
  configPath,
  config.replace(
    /(button: 'src\/components\/button\/index\.ts',\n)/,
    `$1    ${camel}: 'src/components/${kebab}/index.ts',\n`,
  ),
)

// Register the metadata on the server-safe entry.
const metaPath = join(PKG, 'src/meta.ts')
const metaSource = await readFile(metaPath, 'utf8')
await writeFile(
  metaPath,
  `${metaSource.trimEnd()}\nexport { meta as ${camel}Meta } from './components/${kebab}/meta'\n`,
)

console.log(`
Created ${Pascal}:

  packages/ui/src/components/${kebab}/
  apps/docs/src/app/components/${kebab}/page.tsx

Registered the build entry, the "./${kebab}" export, and the metadata export.

Next: write the component, then work through the six items in packages/ui/AGENTS.md.
`)
