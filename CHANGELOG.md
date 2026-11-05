# Changelog

Each package keeps its own changelog, versioned with [semantic versioning](https://semver.org/):

| Package | Changelog | How entries are written |
| --- | --- | --- |
| `@wabi-sabi/ui` (React) | [packages/ui/CHANGELOG.md](packages/ui/CHANGELOG.md) | Generated from changesets in [.changeset/](.changeset) at release |
| `wabi_sabi` (Flutter) | [packages/flutter/CHANGELOG.md](packages/flutter/CHANGELOG.md) | Written by hand, as pub expects |

`packages/ui/CHANGELOG.md` appears with the first release. Until then, the pending
changesets in `.changeset/` describe what it will contain.

Token changes reach both packages, so a token change gets an entry in each.
