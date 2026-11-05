---
'@wabi-sabi/ui': minor
---

Button gains `loading` and `fullWidth`.

`loading` keeps the label, adds a spinner from the icon registry (static under
`prefers-reduced-motion`), sets `aria-busy`, and blocks activation while staying focusable,
so a keyboard user does not lose their place. The variant keeps its colours: busy, not
unavailable. Every size now has a hit area at least 44px tall without changing its visual
height.
