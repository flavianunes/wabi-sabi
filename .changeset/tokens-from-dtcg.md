---
'@wabi-sabi/ui': minor
---

Tokens are now generated from DTCG JSON, the same source the Flutter package uses.

Semantic token names are unchanged. Colour primitives are now named by mode
(`--ws-neutral-light-1`, `--ws-neutral-dark-1`): instead of dark mode overriding primitive
values, the semantic layer points at the dark scale. Components never referenced primitives,
so only stylesheets that did need updating.

New: spacing, radius, border and focus-ring tokens; `color-scheme` follows the theme; a
`[data-theme="light"]` island inside a dark page now resolves to light values; and
`@wabi-sabi/ui/tokens` exports the semantic colour names as a typed list with `cssVar`.
