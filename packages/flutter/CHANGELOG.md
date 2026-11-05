# Changelog

All notable changes to the `wabi_sabi` Flutter package. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the package uses
[semantic versioning](https://semver.org/).

## 0.1.0 — unreleased

### Added

- `WabiTheme.light()` and `WabiTheme.dark()`: Material 3 themes with the semantic colours
  registered as the `WabiColors` theme extension. Generated from the same DTCG tokens as
  the React library.
- Base tokens as constants: `WabiSpace`, `WabiRadius`, `WabiFontSize`, `WabiDuration`,
  `WabiEasing`, `WabiSpring` and the component token classes.
- `WabiButton`: solid, soft and ghost variants; sm, md and lg sizes; `loading` and
  `fullWidth`. Hit area of at least 48×48.
- `WabiTextField`: label, helper text and error text, with the error colour on the border.
- `WabiCard`: title marked as a header, content and an optional footer.
