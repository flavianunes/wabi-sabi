# AGENTS.md

Single source of truth for agents working in this repository. `CLAUDE.md` points here.

## Overview

`@wabi-sabi/ui` is a React component library built on Base UI (behaviour and accessibility)
and Motion (movement), where the transition between states is part of the component API
rather than decoration added afterwards.

It is not a full UI framework. The surface is deliberately small.

## Structure

```
packages/ui      the library
apps/docs        Next.js documentation site, and the library's first real consumer
scripts/         build and guardrail scripts, run directly by Node (type stripping)
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm build` | Builds the library (tsdown, then injects `"use client"`) |
| `pnpm test` | Vitest, including axe accessibility assertions |
| `pnpm typecheck` | `tsc --noEmit` across all workspaces |
| `pnpm lint` | Biome + Stylelint |
| `pnpm smoke` | Validates `dist/` after a build |
| `pnpm dev` | Builds the library, then runs the docs site |
| `pnpm new-component <name>` | Scaffolds a component |

## Critical rules

- **The Base UI package is `@base-ui/react`.** NEVER `@base-ui-components/react`, which is
  the old package, frozen at `1.0.0-rc.0`. It appears in nearly all pre-2026 material,
  **including Motion's own Base UI integration page**. Do not copy imports from there.
  Base UI is imported by subpath: `import { Button } from '@base-ui/react/button'`.

- **NEVER write `"use client"` in `packages/ui/src`.** The directive is injected into
  `dist` by `scripts/inject-use-client.ts` after the bundle is produced. Writing it by
  hand duplicates it and pollutes diffs.

- **NEVER add a `banner` to `tsdown.config.ts`** to inject the directive. Rolldown's dts
  plugin copies the banner into the generated `.d.ts` files, which is invalid TypeScript,
  and a banner function cannot distinguish a `.js` chunk from its `.d.ts`. See
  https://github.com/sxzz/rolldown-plugin-dts/issues/174. The post-build script exists
  precisely because this does not work.

- **Enter and exit animations use ONLY `opacity`, `transform`, `filter` and `clipPath`.**
  Base UI keeps a portalled element mounted only while it detects a running animation via
  `element.getAnimations()`, and Motion hardware-accelerates only those four properties.
  Animating anything else (notably `height`) makes Base UI unmount before the exit
  finishes, so the exit is never seen.

- **Components NEVER reference primitive tokens.** Use semantic tokens (`--ws-control`,
  `--ws-text-subtle`) or define a component token. Enforced by Stylelint.

- **Structural icons come from `src/icons/registry.ts`**, never imported directly from
  `lucide-react` inside a component. A direct import silently breaks the global icon
  override in `WabiSabiProvider`. Enforced by Biome.

- **ESM only.** No CJS, no `require`, no dual build. Publishing both formats would create
  a dual package hazard.

- **New components are created with `pnpm new-component`**, never by hand.

- **All project artifacts are written in English** — code, comments, docs, commit
  messages, changesets. The planning document `wabi-sabi-ui-plano.md` is Portuguese
  because it is internal material; it is the only exception.

- **TypeScript is 7.x.** MDX tooling cannot use the TS 7 compiler API until 7.1, which is
  why the docs site uses `.tsx` pages for now. Do not add MDX until TS 7.1 ships.

- **tsdown uses `deps.neverBundle`.** The `external` option is deprecated and setting both
  throws. CSS support requires the separate `@tsdown/css` package and is experimental — a
  tsdown minor bump can break the build here.

## Anti-patterns

| Pattern | Why it is wrong | Do instead |
| --- | --- | --- |
| `import { X } from '@base-ui-components/react/x'` | Old package, frozen at rc | `@base-ui/react/x` |
| `"use client"` at the top of a source file | Injected at build; duplicates | Nothing — it is automatic |
| `banner: '"use client"'` in tsdown config | Leaks into `.d.ts`, invalid TS | The post-build script |
| `height` in an exit animation | Base UI unmounts early | `opacity` / `transform` / `clipPath` |
| `color: var(--ws-neutral-11)` in a component | Skips the semantic layer | `var(--ws-text-subtle)` |
| `import { X } from 'lucide-react'` in a component | Breaks the icon override | Import from the icon registry |
| `:disabled` in component CSS | Absent when `nativeButton={false}` | `[data-disabled]` |
| `transpilePackages` in the docs app | Hides a real packaging bug | Fix the package |
| Reimplementing button/menu semantics | Base UI already does it | Compose the Base UI primitive |

## Division of work

Component implementation is largely **not** agent work. The project exists so its author
can learn React through components and learn animation.

- **Agents do:** build and packaging config, CI, scaffolding, lint/format config, test
  boilerplate, scripts, type generation, mechanical refactors, infrastructure docs, and
  the core non-motion components (Button, Input, Link, Code).
- **The author does:** the motion components (SplitText, Reveal, StickyScene, Marquee,
  Counter, ExpandableCard, Disclosure), public API design, motion presets and logic,
  token and visual identity decisions, and the conceptual content of doc pages.

When unsure which side a task falls on, ask whether it teaches something about React or
animation. If it does, it is the author's.

## Never run

`pnpm publish`, `changeset publish`, `npm version`, `npm publish`
