# wabi-sabi

Monorepo for **`@wabi-sabi/ui`** — a React component library built on
[Base UI](https://base-ui.com) and [Motion](https://motion.dev), where the transition
between states is part of the component API rather than decoration added afterwards.

> Status: early. Nothing is published to npm yet.

## Why

Headless libraries solve behaviour and accessibility but leave styling and movement to
you, so animation tends to be the last thing done — implemented component by component,
without coherence, and breaking in the hard cases: when the user closes something before
it finishes opening, when an element must stay mounted in order to leave, when someone
has `prefers-reduced-motion` on.

Complete libraries solve that, but bring a large API surface and a visual identity you
spend more time overriding than using.

`@wabi-sabi/ui` sits in between: behaviour and movement solved and coherent, appearance
driven by CSS custom properties, with no styling runtime imposed on you.

## Principles

**Transience.** Nothing appears or disappears abruptly. Every component that mounts and
unmounts knows how to enter, leave, and be interrupted halfway. Durations and curves come
from shared tokens. `prefers-reduced-motion` is respected by default.

**Simplicity.** Few props, few tokens, literal names. When a use case needs fine control,
the answer is composition through the component's parts, not another prop.

**Declared imperfection.** Every component carries a visible status — stable, preview, or
experimental — and preview and experimental list their known limitations in writing.

## Layout

```
packages/ui      the library
apps/docs        documentation site (Next.js), and the library's first real consumer
scripts/         build and guardrail scripts
```

## Development

Requires Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev          # builds the library, then runs the docs site
```

The docs site consumes the library's built `dist`, not its source — that is deliberate,
since it is what validates the packaging in a real React Server Components environment.

| Command | What it does |
| --- | --- |
| `pnpm build` | Builds the library |
| `pnpm test` | Vitest, including axe accessibility assertions |
| `pnpm typecheck` | `tsc --noEmit` across all workspaces |
| `pnpm lint` | Biome + Stylelint |
| `pnpm smoke` | Validates `dist/` after a build |
| `pnpm new-component <name>` | Scaffolds a component |

## License

MIT
