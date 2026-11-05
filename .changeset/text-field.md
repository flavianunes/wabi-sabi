---
'@wabi-sabi/ui': minor
---

New component: TextField, a labelled single-line input built on Base UI's Field.

`label` is required. `helperText` and `errorText` are linked to the input through
`aria-describedby`; `errorText` also sets `aria-invalid` and turns the border to the danger
colour, which meets 3:1 on the page. The input is 44px tall. Import it from
`@wabi-sabi/ui/text-field`.
