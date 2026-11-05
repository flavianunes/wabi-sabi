import 'package:flutter/material.dart';
import 'package:wabi_sabi/wabi_sabi.dart';
import 'package:widgetbook/widgetbook.dart';

void main() => runApp(const WabiWidgetbook());

/// Documents the wabi_sabi components: one use case per variant and state, with knobs,
/// a light/dark theme switch, device viewports and text scaling.
///
/// The tree is written by hand rather than generated with build_runner: three
/// components do not justify a code generation step.
class WabiWidgetbook extends StatelessWidget {
  const WabiWidgetbook({super.key});

  @override
  Widget build(BuildContext context) {
    return Widgetbook.material(
      directories: [
        WidgetbookCategory(
          name: 'Components',
          children: [_button, _textField, _card],
        ),
      ],
      addons: [
        MaterialThemeAddon(
          themes: [
            WidgetbookTheme(name: 'Light', data: WabiTheme.light()),
            WidgetbookTheme(name: 'Dark', data: WabiTheme.dark()),
          ],
        ),
        ViewportAddon(Viewports.all),
        TextScaleAddon(min: 1, max: 2),
        AlignmentAddon(initialAlignment: Alignment.center),
      ],
    );
  }
}

/// Keeps every use case on the page canvas, with the gutter the web stories have.
Widget _frame(Widget child) =>
    Padding(padding: const EdgeInsets.all(WabiSpace.space6), child: child);

// Button ------------------------------------------------------------------------------------

final _button = WidgetbookComponent(
  name: 'WabiButton',
  useCases: [
    WidgetbookUseCase(
      name: 'Playground',
      builder: (context) {
        final knobs = context.knobs;
        final disabled = knobs.boolean(label: 'Disabled');
        return _frame(
          WabiButton(
            onPressed: disabled ? null : () {},
            variant: knobs.object.segmented(
              label: 'Variant',
              options: WabiButtonVariant.values,
              labelBuilder: (v) => v.name,
            ),
            size: knobs.object.segmented(
              label: 'Size',
              options: WabiButtonSize.values,
              initialOption: WabiButtonSize.md,
              labelBuilder: (v) => v.name,
            ),
            loading: knobs.boolean(label: 'Loading'),
            fullWidth: knobs.boolean(label: 'Full width'),
            child: Text(
              knobs.string(label: 'Label', initialValue: 'Save changes'),
            ),
          ),
        );
      },
    ),
    WidgetbookUseCase(
      name: 'Variants',
      builder: (context) => _frame(
        Wrap(
          spacing: WabiSpace.space3,
          runSpacing: WabiSpace.space3,
          children: [
            for (final variant in WabiButtonVariant.values)
              WabiButton(
                onPressed: () {},
                variant: variant,
                child: Text(variant.name),
              ),
          ],
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Sizes',
      builder: (context) => _frame(
        Wrap(
          spacing: WabiSpace.space3,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            for (final size in WabiButtonSize.values)
              WabiButton(onPressed: () {}, size: size, child: Text(size.name)),
          ],
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Disabled',
      builder: (context) => _frame(
        Wrap(
          spacing: WabiSpace.space3,
          children: [
            for (final variant in WabiButtonVariant.values)
              WabiButton(
                onPressed: null,
                variant: variant,
                child: Text(variant.name),
              ),
          ],
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Loading',
      builder: (context) => _frame(
        WabiButton(
          onPressed: () {},
          loading: true,
          child: const Text('Saving'),
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Full width',
      builder: (context) => _frame(
        WabiButton(
          onPressed: () {},
          fullWidth: true,
          child: const Text('Continue'),
        ),
      ),
    ),
  ],
);

// TextField ---------------------------------------------------------------------------------

final _textField = WidgetbookComponent(
  name: 'WabiTextField',
  useCases: [
    WidgetbookUseCase(
      name: 'Playground',
      builder: (context) {
        final knobs = context.knobs;
        return _frame(
          SizedBox(
            width: 360,
            child: WabiTextField(
              label: knobs.string(label: 'Label', initialValue: 'Email'),
              helperText: knobs.stringOrNull(label: 'Helper text'),
              errorText: knobs.stringOrNull(label: 'Error text'),
              hintText: knobs.stringOrNull(
                label: 'Hint',
                initialValue: 'ana@example.com',
              ),
              enabled: knobs.boolean(label: 'Enabled', initialValue: true),
            ),
          ),
        );
      },
    ),
    WidgetbookUseCase(
      name: 'With helper text',
      builder: (context) => _frame(
        const SizedBox(
          width: 360,
          child: WabiTextField(
            label: 'Email',
            helperText: 'We only use it to send receipts.',
          ),
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Invalid',
      builder: (context) => _frame(
        const SizedBox(
          width: 360,
          child: WabiTextField(
            label: 'Email',
            errorText: 'Enter a complete email address, like ana@example.com.',
          ),
        ),
      ),
    ),
    WidgetbookUseCase(
      name: 'Disabled',
      builder: (context) => _frame(
        const SizedBox(
          width: 360,
          child: WabiTextField(label: 'Email', enabled: false),
        ),
      ),
    ),
  ],
);

// Card --------------------------------------------------------------------------------------

final _card = WidgetbookComponent(
  name: 'WabiCard',
  useCases: [
    WidgetbookUseCase(
      name: 'Playground',
      builder: (context) {
        final knobs = context.knobs;
        return _frame(
          SizedBox(
            width: 360,
            child: WabiCard(
              title: knobs.string(label: 'Title', initialValue: 'Free plan'),
              footer: knobs.boolean(label: 'Footer', initialValue: true)
                  ? WabiButton(
                      onPressed: () {},
                      size: WabiButtonSize.sm,
                      child: const Text('Upgrade'),
                    )
                  : null,
              child: Text(
                knobs.string(
                  label: 'Content',
                  initialValue:
                      'Three projects, one member, and community support.',
                ),
              ),
            ),
          ),
        );
      },
    ),
    WidgetbookUseCase(
      name: 'With footer',
      builder: (context) => _frame(
        SizedBox(
          width: 360,
          child: WabiCard(
            title: 'Free plan',
            footer: Wrap(
              spacing: WabiSpace.space2,
              children: [
                WabiButton(
                  onPressed: () {},
                  size: WabiButtonSize.sm,
                  child: const Text('Upgrade'),
                ),
                WabiButton(
                  onPressed: () {},
                  size: WabiButtonSize.sm,
                  variant: WabiButtonVariant.ghost,
                  child: const Text('Compare plans'),
                ),
              ],
            ),
            child: const Text(
              'Three projects, one member, and community support.',
            ),
          ),
        ),
      ),
    ),
  ],
);
