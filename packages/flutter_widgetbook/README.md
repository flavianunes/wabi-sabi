# wabi_sabi_widgetbook

The [Widgetbook](https://www.widgetbook.io/) for the `wabi_sabi` Flutter package: one use
case per variant and state, with knobs, a light/dark theme switch, device viewports and
text scaling. Published as Flutter web next to the React Storybook.

```bash
flutter run -d chrome                                   # local
flutter build web --base-href /<repository>/widgetbook/ # what CI publishes
```

The tree is written by hand in `lib/main.dart` rather than generated with build_runner;
three components do not justify a code generation step.
