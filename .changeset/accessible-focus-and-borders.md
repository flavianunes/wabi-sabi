---
'@wabi-sabi/ui': patch
---

The focus ring now meets 3:1 against the page in both themes (WCAG 1.4.11). `--ws-focus`
moves from sakura step 8 (2.2:1 in light mode) to step 9. A new semantic token,
`--ws-line-strong`, gives interactive controls such as text fields a border that also
meets 3:1; `--ws-line` stays for decorative borders.

In dark mode, `--ws-accent-hover` moves from sakura step 10 to step 8, so the white label
on a hovered solid button stays at 4.5:1 or above (it was 4.38:1).
