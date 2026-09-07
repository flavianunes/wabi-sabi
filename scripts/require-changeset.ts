/**
 * Pre-push gate: a publishable change needs a changelog entry.
 *
 * Nothing that changes packages/ui should reach main without a changeset, because the
 * changeset is what produces the version bump and the changelog entry at release time.
 */

import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

function git(...args: string[]): string {
  // stderr is piped rather than inherited: several calls below are probes whose failure is
  // expected and handled, and git's complaints would otherwise clutter the hook output.
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

// A repository with no commits yet has nothing to compare against.
let branch: string
try {
  branch = git('rev-parse', '--abbrev-ref', 'HEAD')
  git('rev-parse', '--verify', 'HEAD')
} catch {
  process.exit(0)
}

// Releases are cut from main, where the changeset action does the versioning.
if (branch === 'main') process.exit(0)

/**
 * Compares against main where it exists. On a repository that has no main yet — the very
 * first push — there is nothing to diff against, so let it through.
 */
let base: string
try {
  base = git('merge-base', 'HEAD', 'origin/main')
} catch {
  try {
    base = git('merge-base', 'HEAD', 'main')
  } catch {
    process.exit(0)
  }
}

const changed = git('diff', '--name-only', base, 'HEAD').split('\n').filter(Boolean)
const touchesLibrary = changed.some((file) => file.startsWith('packages/ui/'))

if (!touchesLibrary) process.exit(0)

const hasChangeset = readdirSync(new URL('../.changeset', import.meta.url))
  .filter((file) => file.endsWith('.md'))
  .some((file) => file.toLowerCase() !== 'readme.md')

if (!hasChangeset) {
  console.error(
    '\nThis push changes packages/ui but adds no changeset.\n\n' +
      '  Run `pnpm changeset` to describe the change, then commit the generated file.\n\n' +
      'If the change genuinely does not affect the published package (a comment, a test),\n' +
      'run `pnpm changeset --empty`.\n',
  )
  process.exit(1)
}
