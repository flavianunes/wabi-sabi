/**
 * Injects the "use client" directive into the built JavaScript.
 *
 * Why this is a script rather than a bundler banner:
 *
 * Rolldown's dts plugin copies an output banner into the generated .d.ts files too, where
 * a "use client" directive is invalid TypeScript. A banner function cannot avoid this,
 * because it runs once per output entry and cannot distinguish the .js chunk from the
 * .d.ts generated alongside it. See https://github.com/sxzz/rolldown-plugin-dts/issues/174.
 *
 * Running after the bundler also solves the problem the directive has in general: to a
 * bundler it is just a string expression with no effect, so minifiers drop it and module
 * transforms hoist imports above it. Nothing runs after this script, so nothing can.
 *
 * The script is idempotent, so running it twice is harmless.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = fileURLToPath(new URL('../packages/ui/dist', import.meta.url))

const DIRECTIVE = "'use client';"

/**
 * Matches a use client directive on its own line, in either quote style, with or without
 * a semicolon.
 *
 * Built fresh per use rather than shared: a global regex carries `lastIndex` between
 * calls, so a shared instance would make `.test()` return different answers for identical
 * input depending on call order.
 */
const directivePattern = () => /^\s*(['"])use client\1;?\s*$/gm

/**
 * Entries that must NOT be marked as client modules.
 *
 * React turns every export of a client module into an opaque client reference, so a React
 * Server Component importing one receives a proxy rather than the value. That is correct
 * for a component and wrong for plain data: `meta.status` would read off the proxy and
 * come back undefined.
 *
 * Anything listed here must therefore contain no components and no hooks.
 */
const SERVER_SAFE_ENTRIES = new Set(['meta.js', 'tokens.js'])

/**
 * Resolves the full set of server-safe files, by following what the server-safe entries
 * import.
 *
 * Matching filenames alone is not enough: Rolldown puts shared code in hashed chunks, so
 * a server-safe entry is typically a one-line re-export from a chunk. Marking that chunk
 * as a client module would turn the entry's exports into client references just the same,
 * only less visibly.
 */
async function collectServerSafe(): Promise<Set<string>> {
  const safe = new Set<string>()
  const queue = [...SERVER_SAFE_ENTRIES].map((name) => join(DIST, name))

  while (queue.length > 0) {
    const path = queue.pop()
    if (!path || safe.has(path)) continue

    let source: string
    try {
      source = await readFile(path, 'utf8')
    } catch {
      continue // An entry that was not emitted; the smoke test reports that separately.
    }
    safe.add(path)

    for (const match of source.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
      const specifier = match[1]
      if (specifier) queue.push(join(dirname(path), specifier))
    }
  }

  return safe
}

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

/**
 * Every entry that carries a component is a client module, which is all of them except
 * the ones named in SERVER_SAFE above.
 */
async function injectIntoJs(path: string): Promise<boolean> {
  const source = await readFile(path, 'utf8')
  const withoutDirective = source.replace(directivePattern(), '').replace(/^\n+/, '')
  await writeFile(path, `${DIRECTIVE}\n${withoutDirective}`)
  return true
}

/**
 * Strips the directive from declaration files.
 *
 * Nothing should be putting it there today. This exists so that if a future tsdown or
 * rolldown-plugin-dts starts emitting the banner into declarations, the build repairs
 * itself instead of shipping broken types.
 */
async function cleanDts(path: string): Promise<boolean> {
  const source = await readFile(path, 'utf8')
  const cleaned = source.replace(directivePattern(), '').replace(/^\n+/, '')
  if (cleaned === source) return false
  await writeFile(path, cleaned)
  return true
}

const serverSafe = await collectServerSafe()

let injected = 0
let cleaned = 0
let skipped = 0

for await (const path of walk(DIST)) {
  if (path.endsWith('.d.ts') || path.endsWith('.d.mts')) {
    if (await cleanDts(path)) cleaned++
  } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
    if (serverSafe.has(path)) {
      // Strip rather than skip, so a stray directive from an earlier run cannot survive.
      if (await cleanDts(path)) cleaned++
      skipped++
    } else if (await injectIntoJs(path)) {
      injected++
    }
  }
}

/*
 * A chunk reachable from both a server-safe entry and a component entry cannot be both
 * things at once, and quietly picking one would produce a bug that only appears when a
 * Server Component reads a value. Fail the build instead, and say what to do about it.
 */
const clientReachable = new Set<string>()
for await (const path of walk(DIST)) {
  if (!path.endsWith('.js') && !path.endsWith('.mjs')) continue
  if (serverSafe.has(path)) continue
  const source = await readFile(path, 'utf8')
  for (const match of source.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
    const specifier = match[1]
    if (specifier) clientReachable.add(join(dirname(path), specifier))
  }
}

const conflicts = [...serverSafe].filter((path) => clientReachable.has(path))
if (conflicts.length > 0) {
  console.error(
    '\nA chunk is shared between a server-safe entry and a client entry:\n' +
      conflicts.map((path) => `  ${basename(path)}`).join('\n') +
      '\n\nIt cannot be both. Split the shared code so the server-safe entry does not\n' +
      'depend on anything a component entry also uses.\n',
  )
  process.exit(1)
}

console.log(
  `use client: injected into ${injected} js files, ${skipped} left server-safe, cleaned ${cleaned} files`,
)

if (injected === 0) {
  console.error('No JavaScript files found in dist. Did the build run?')
  process.exit(1)
}
