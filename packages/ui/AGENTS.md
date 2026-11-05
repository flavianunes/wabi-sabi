# AGENTS.md — packages/ui

Component conventions. The root [AGENTS.md](../../AGENTS.md) has the critical rules; this
file covers what is specific to writing a component.

## Definition of done

A component is finished when all seven are true. Not six.

1. The implementation handles entering, leaving, and being interrupted halfway — for
   components that mount and unmount. A component that is always mounted (Button, Input)
   instead handles its state transitions.
2. `*.module.css` uses only semantic or component tokens.
3. A behaviour test and an accessibility test with axe.
4. `meta.ts` with `status`, `since`, and `knownLimitations`.
5. A Storybook story per variant and state, with a usage page (`usagePage` in
   `.storybook/usage-page.tsx`: when to use, when not to). Stories run as browser tests
   with axe in both themes, so a story is also an accessibility test.
6. Keyboard navigation checked by hand and written down in the usage page.
7. The Flutter mirror in `packages/flutter`, with the same conceptual API (see the root
   AGENTS.md).

## Files

Created by `pnpm new-component <name>`, never by hand:

```
src/components/<kebab-name>/
├── index.ts            public exports — no meta, see below
├── <kebab-name>.tsx    implementation
├── <kebab-name>.module.css
├── <kebab-name>.test.tsx
├── <kebab-name>.stories.tsx
└── meta.ts             status and known limitations
```

## Conventions

- Files and folders in kebab-case; components in PascalCase.
- Compound components follow Base UI's naming: `Dialog.Root`, `Dialog.Trigger`,
  `Dialog.Portal`, `Dialog.Content`.
- `displayName` on every component.
- CSS Module class names are camelCase and unprefixed — CSS Modules already scopes them.
- Types are exported alongside the component, named `ButtonProps`, `DialogRootProps`.
- Every public prop carries TSDoc with `@default` where relevant. The documentation
  extracts its props table from it.
- Extend the Base UI props type rather than redeclaring props it already owns, so
  `disabled`, `render`, and the rest stay in sync automatically.

## Metadata does not belong on a component entry

A component entry becomes a client module, and React turns **every** export of a client
module into an opaque client reference. A React Server Component importing `meta` from
`@wabi-sabi/ui/button` would get a proxy, and reading `meta.status` off it returns
undefined — at render time, not at build time.

So `meta` is exported from `src/meta.ts`, which the build keeps free of the directive, and
`scripts/inject-use-client.ts` fails the build if a chunk is shared between that entry and
a component entry.

## Component tokens

Declare them at the top of the component's own rule, defaulting to a semantic token:

```css
.button {
  --ws-button-bg: var(--ws-control);
  background: var(--ws-button-bg);
}
```

This is the fine customisation surface: someone can restyle one component without touching
the semantic layer every other component shares.

## Movement

- Only `opacity`, `transform`, `filter`, `clipPath` in enter and exit animations.
- Take durations and easings from the tokens; never write a bare `200ms` or a hand-rolled
  cubic-bezier.
- There is no ease-in curve, deliberately. It starts slow, delaying the moment the user is
  watching.
- Gate `:hover` motion behind `@media (hover: hover) and (pointer: fine)` — touch devices
  fire a synthetic hover on tap that otherwise sticks.
- Reduced motion means gentler, not none: keep opacity and colour, drop movement.
- Reach for CSS before Motion. A state change the browser already tracks (`:hover`,
  `:active`, `:focus-visible`) does not need a JavaScript runtime.

## Commands

```bash
pnpm --filter @wabi-sabi/ui test        # vitest unit tests, including axe (happy-dom)
pnpm --filter @wabi-sabi/ui test:storybook  # every story in Chromium, axe, both themes
pnpm --filter @wabi-sabi/ui storybook   # Storybook on :6006
pnpm --filter @wabi-sabi/ui build       # tsdown, then the directive injection
pnpm --filter @wabi-sabi/ui typecheck
```
