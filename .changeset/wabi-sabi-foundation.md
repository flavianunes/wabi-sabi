---
'@wabi-sabi/ui': minor
---

Initial foundation: three-tier token architecture, motion tokens, icon registry, and the
Button component.

Button composes Base UI's Button, so it inherits the button role, keyboard activation, and
correct disabled behaviour when rendered as another element. It has two of its own props —
`variant` (solid, soft, ghost) and `size` (sm, md, lg). State transitions are CSS built
from the motion tokens, with hover gated behind a fine pointer and the press transform
dropped under `prefers-reduced-motion`.

The package is ESM only, with per-component subpath exports and the `"use client"`
directive injected after the bundle is produced. Component metadata is exported separately
from `@wabi-sabi/ui/meta`, which stays free of the directive so React Server Components
can read it as real values rather than client references.
