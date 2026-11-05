# Contributing

## Proposing a component

Open an issue before writing code. Include:

- the use case, and why an existing component or composition does not cover it;
- the API on both platforms, following each one's conventions (see the Button, TextField
  and Card tables in their usage pages);
- the states it has (disabled, loading, invalid…) and how each is announced to assistive
  technology.

## Building it

1. **React.** Run `pnpm new-component <kebab-name>`. It creates the component, CSS module,
   test, story and metadata, and registers the build entry and export. Implement against
   semantic or component tokens only.
2. **Tokens.** If the component needs a new size or colour, add it to `tokens/*.json`
   (component tokens go in `tokens/components.json`), run `pnpm tokens`, and commit the
   generated files with it. A new colour pair goes into `PAIRS` in `build-tokens/contrast.ts`.
3. **Flutter.** Add `packages/flutter/lib/src/components/wabi_<name>.dart`, export it from
   `lib/wabi_sabi.dart`, and add `test/wabi_<name>_test.dart`. Read colours from
   `context.wabiColors` and sizes from the generated token classes.
4. **Widgetbook.** Add a `WidgetbookComponent` to `packages/flutter_widgetbook/lib/main.dart`,
   with a use case per variant and state.

## Pull request checklist

- [ ] React: story per variant and state, with a usage page (when to use, when not to).
- [ ] React: behaviour tests and axe in both themes; `pnpm test:storybook` passes.
- [ ] Flutter: widget tests mirroring the React behaviours, and `meetsGuideline` for text
      contrast and tap targets in both themes.
- [ ] Widgetbook use cases, with knobs.
- [ ] No literal colour or size in a component on either platform.
- [ ] `pnpm tokens` leaves no diff.
- [ ] A changeset (`pnpm changeset`) for `@wabi-sabi/ui`, and an entry in
      `packages/flutter/CHANGELOG.md` for the Flutter package.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`,
`test:`, `chore:`, `ci:`), one logical step per commit. A hook checks the format.
