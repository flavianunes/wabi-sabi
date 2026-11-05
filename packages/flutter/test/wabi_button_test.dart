import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi/wabi_sabi.dart';

import 'helpers.dart';

void main() {
  group('WabiButton', () {
    testWidgets('calls onPressed when tapped', (tester) async {
      var presses = 0;
      await pumpThemed(
        tester,
        WabiButton(onPressed: () => presses++, child: const Text('Save')),
      );

      await tester.tap(find.text('Save'));

      expect(presses, 1);
    });

    testWidgets('is disabled when onPressed is null', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpThemed(
        tester,
        const WabiButton(onPressed: null, child: Text('Save')),
      );

      expect(
        tester.getSemantics(find.text('Save')),
        containsSemantics(
          label: 'Save',
          isButton: true,
          hasEnabledState: true,
          isEnabled: false,
          hasTapAction: false,
        ),
      );
      handle.dispose();
    });

    testWidgets('does not call onPressed while loading', (tester) async {
      var presses = 0;
      await pumpThemed(
        tester,
        WabiButton(
          onPressed: () => presses++,
          loading: true,
          child: const Text('Saving'),
        ),
      );

      await tester.tap(find.text('Saving'), warnIfMissed: false);

      expect(presses, 0);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('announces loading alongside the label', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpThemed(
        tester,
        WabiButton(
          onPressed: () {},
          loading: true,
          child: const Text('Saving'),
        ),
      );

      expect(find.bySemanticsLabel(RegExp('Loading')), findsOneWidget);
      handle.dispose();
    });

    testWidgets('holds the spinner still under reduced motion', (tester) async {
      await pumpThemed(
        tester,
        WabiButton(
          onPressed: () {},
          loading: true,
          child: const Text('Saving'),
        ),
        disableAnimations: true,
      );

      final spinner = tester.widget<CircularProgressIndicator>(
        find.byType(CircularProgressIndicator),
      );
      expect(spinner.value, isNotNull);
    });

    testWidgets('activates with the keyboard', (tester) async {
      var presses = 0;
      await pumpThemed(
        tester,
        WabiButton(onPressed: () => presses++, child: const Text('Save')),
      );

      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pump();

      expect(presses, 1);
    });

    testWidgets('stretches to its parent with fullWidth', (tester) async {
      await pumpThemed(
        tester,
        SizedBox(
          width: 300,
          child: WabiButton(
            onPressed: () {},
            fullWidth: true,
            child: const Text('Save'),
          ),
        ),
      );

      expect(tester.getSize(find.byType(TextButton)).width, 300);
    });

    testWidgets('keeps the visual height from the size tokens', (tester) async {
      for (final (size, height) in [
        (WabiButtonSize.sm, WabiButtonTokens.heightSm),
        (WabiButtonSize.md, WabiButtonTokens.heightMd),
        (WabiButtonSize.lg, WabiButtonTokens.heightLg),
      ]) {
        await pumpThemed(
          tester,
          WabiButton(onPressed: () {}, size: size, child: const Text('Save')),
        );
        final material = find.descendant(
          of: find.byType(TextButton),
          matching: find.byType(Material),
        );
        expect(tester.getSize(material.first).height, height, reason: '$size');
      }
    });

    for (final MapEntry(key: name, value: theme) in themes.entries) {
      group('in the $name theme', () {
        for (final variant in WabiButtonVariant.values) {
          testWidgets('$variant meets the accessibility guidelines', (
            tester,
          ) async {
            final handle = tester.ensureSemantics();
            await pumpThemed(
              tester,
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (final size in WabiButtonSize.values)
                    WabiButton(
                      onPressed: () {},
                      variant: variant,
                      size: size,
                      child: const Text('Save'),
                    ),
                  WabiButton(
                    onPressed: () {},
                    variant: variant,
                    loading: true,
                    child: const Text('Saving'),
                  ),
                ],
              ),
              theme: theme,
            );

            await expectMeetsGuidelines(tester);
            handle.dispose();
          });
        }
      });
    }
  });
}
