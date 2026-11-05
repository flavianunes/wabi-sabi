/**
 * Validates the built package.
 *
 * Since nothing is published yet, this is what stands in for installing the package and
 * finding out the hard way. Each check corresponds to a specific way this library can
 * ship broken while every other step passes.
 */

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_DIR = fileURLToPath(new URL('../packages/ui', import.meta.url))
const DIST = join(PKG_DIR, 'dist')

const failures: string[] = []

function check(condition: boolean, message: string): void {
  if (!condition) failures.push(message)
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

if (!existsSync(DIST)) {
  console.error('dist/ does not exist. Run `pnpm build` first.')
  process.exit(1)
}

const pkg = JSON.parse(await readFile(join(PKG_DIR, 'package.json'), 'utf8'))

const files: string[] = []
for await (const path of walk(DIST)) files.push(path)

const jsFiles = files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))
const dtsFiles = files.filter((f) => f.endsWith('.d.ts') || f.endsWith('.d.mts'))
const rel = (path: string) => relative(PKG_DIR, path)

// 1. Every path the exports map promises actually exists. Catches a renamed entry.
const exportPaths: string[] = []
for (const entry of Object.values(pkg.exports as Record<string, unknown>)) {
  if (typeof entry === 'string') exportPaths.push(entry)
  else if (entry && typeof entry === 'object') {
    exportPaths.push(...Object.values(entry as Record<string, string>))
  }
}
for (const path of exportPaths) {
  check(existsSync(join(PKG_DIR, path)), `exports map points at a missing file: ${path}`)
}

/*
 * Entries that must stay free of the directive, because React turns every export of a
 * client module into an opaque client reference — fine for a component, broken for plain
 * data a Server Component needs to read. Kept in sync with scripts/inject-use-client.ts.
 */
const SERVER_SAFE_ENTRIES = new Set(['meta.js', 'tokens.js'])

/**
 * Everything a server-safe entry reaches, following its relative imports. A one-line
 * re-export entry is clean on its own while the chunk behind it carries the directive,
 * which would make its exports client references just the same — so the whole reachable
 * set has to be checked, not the entry filename.
 */
const SERVER_SAFE = new Set<string>()
{
  const queue = [...SERVER_SAFE_ENTRIES].map((name) => join(DIST, name))
  while (queue.length > 0) {
    const path = queue.pop()
    if (!path || SERVER_SAFE.has(path) || !existsSync(path)) continue
    SERVER_SAFE.add(path)
    const source = await readFile(path, 'utf8')
    for (const match of source.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
      const specifier = match[1]
      if (specifier) queue.push(join(dirname(path), specifier))
    }
  }
}

// 2. The directive is the first thing in every client JS file, and nothing was hoisted
//    above it. This is the check the whole injection strategy exists to satisfy.
check(jsFiles.length > 0, 'no JavaScript emitted')
for (const file of jsFiles) {
  const source = await readFile(file, 'utf8')
  // Anchored, so the phrase inside a comment is not read as a directive.
  const hasDirective = /^\s*(['"])use client\1\s*;?\s*$/m.test(source)

  if (SERVER_SAFE.has(file)) {
    // A server-safe entry with the directive would silently turn its exports into client
    // references, which fails only at render time in a consuming app.
    check(
      !hasDirective,
      `${rel(file)} is a server-safe entry but carries a "use client" directive, which would turn its exports into client references`,
    )
    continue
  }

  const firstLine = source
    .split('\n')
    .find((line) => line.trim() !== '')
    ?.trim()

  check(
    firstLine === "'use client';" || firstLine === '"use client";',
    `${rel(file)} does not start with a "use client" directive (found: ${firstLine?.slice(0, 60)})`,
  )

  const directiveAt = source.search(/^\s*(['"])use client\1\s*;?\s*$/m)
  const importAt = source.search(/^\s*import[\s{*'"]/m)
  check(
    directiveAt !== -1 && (importAt === -1 || directiveAt < importAt),
    `${rel(file)} has an import hoisted above its "use client" directive`,
  )
}

// 3. No directive in the declarations, where it would be invalid TypeScript.
//    Guards against rolldown-plugin-dts#174 regressing.
for (const file of dtsFiles) {
  const source = await readFile(file, 'utf8')
  // Anchored to the line start, so the phrase appearing inside a doc comment is not
  // mistaken for an actual directive.
  check(
    !/^\s*(['"])use client\1\s*;?\s*$/m.test(source),
    `${rel(file)} contains a "use client" directive, which is invalid in a declaration file`,
  )
}

// 4. Declarations exist and are not empty stubs.
for (const [subpath, entry] of Object.entries(pkg.exports as Record<string, unknown>)) {
  if (!entry || typeof entry !== 'object') continue
  const types = (entry as Record<string, string>).types
  if (!types) continue
  const full = join(PKG_DIR, types)
  check(
    existsSync(full) && (await readFile(full, 'utf8')).trim().length > 0,
    `${subpath}: ${types} is missing or empty`,
  )
}

// 5. The stylesheet was generated, kept the semantic layer, and ran through CSS Modules.
const cssPath = join(DIST, 'styles.css')
if (existsSync(cssPath)) {
  const css = await readFile(cssPath, 'utf8')
  check(css.trim().length > 0, 'dist/styles.css is empty')
  check(css.includes('--ws-accent'), 'dist/styles.css is missing the semantic token layer')
  check(
    css.includes('--ws-neutral-light-1') && css.includes('--ws-neutral-dark-1'),
    'dist/styles.css is missing the primitive token layer',
  )
  check(
    /ws_[a-z0-9]+_button/i.test(css),
    'dist/styles.css has no scoped Button class, so CSS Modules did not run',
  )
} else {
  failures.push('dist/styles.css was not generated')
}

// 6. The CSS import survived in the JS. Without it, and without "sideEffects", a
//    consumer's bundler drops the stylesheet and the site ships unstyled.
const someJsImportsCss = await Promise.all(
  jsFiles.map(async (f) => /import\s+['"]\.\/styles\.css['"]/.test(await readFile(f, 'utf8'))),
)
check(
  someJsImportsCss.some(Boolean),
  'no JavaScript file imports ./styles.css, so css.inject did not take effect',
)
check(
  Array.isArray(pkg.sideEffects) && pkg.sideEffects.includes('*.css'),
  'package.json is missing "sideEffects": ["*.css"], so bundlers will drop the stylesheet',
)

// 7. Dependencies stayed external rather than being inlined into the bundle.
//    Checked across every chunk, not just the entry: Rolldown may put the component in a
//    shared chunk and leave the entry as a re-export, which is fine.
const allJs = await Promise.all(jsFiles.map((f) => readFile(f, 'utf8')))
check(
  allJs.some((source) => /from\s*['"]@base-ui\/react/.test(source)),
  'nothing in dist imports @base-ui/react, so it may have been bundled in',
)
check(
  !allJs.some((source) => source.includes('@base-ui-components/react')),
  'dist references @base-ui-components/react, which is the obsolete package',
)
// A dependency that stayed external is imported, never inlined. This string appears in
// Base UI's own source, so finding it in our output means it was bundled in.
check(
  !allJs.some((source) => source.includes('focusableWhenDisabled')),
  'dist appears to contain inlined Base UI source, so it was not externalised',
)

// 8. ESM only.
check(pkg.type === 'module', 'package.json is missing "type": "module"')
check(!('main' in pkg), 'package.json has a "main" field, which reintroduces CJS resolution')
for (const file of files) {
  check(!file.endsWith('.cjs'), `${rel(file)} is a CommonJS file; this package is ESM only`)
}

if (failures.length > 0) {
  console.error(`\nsmoke test failed (${failures.length}):\n`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(
  `smoke test passed: ${jsFiles.length} js, ${dtsFiles.length} dts, ${exportPaths.length} export paths`,
)
