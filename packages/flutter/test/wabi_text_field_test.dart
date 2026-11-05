import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi/wabi_sabi.dart';

import 'helpers.dart';

void main() {
  group('WabiTextField', () {
    testWidgets('is labelled by its label', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpThemed(tester, const WabiTextField(label: 'Email'));

      expect(
        tester.getSemantics(find.byType(EditableText)),
        containsSemantics(
          label: 'Email',
          isTextField: true,
          isEnabled: true,
          isFocusable: true,
        ),
      );
      handle.dispose();
    });

    testWidgets('shows the helper text', (tester) async {
      await pumpThemed(
        tester,
        const WabiTextField(label: 'Email', helperText: 'Work address.'),
      );

      expect(find.text('Work address.'), findsOneWidget);
    });

    testWidgets('announces the error in place of the helper text', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      await pumpThemed(
        tester,
        const WabiTextField(
          label: 'Email',
          helperText: 'Work address.',
          errorText: 'Enter a valid email.',
        ),
      );

      expect(find.text('Enter a valid email.'), findsOneWidget);
      expect(find.text('Work address.'), findsNothing);
      expect(
        find.bySemanticsLabel(RegExp('Enter a valid email.')),
        findsWidgets,
      );
      handle.dispose();
    });

    testWidgets('reports typing through onChanged and the controller', (
      tester,
    ) async {
      final controller = TextEditingController();
      addTearDown(controller.dispose);
      String? last;
      await pumpThemed(
        tester,
        WabiTextField(
          label: 'Name',
          controller: controller,
          onChanged: (v) => last = v,
        ),
      );

      await tester.enterText(find.byType(TextField), 'Ana');

      expect(last, 'Ana');
      expect(controller.text, 'Ana');
    });

    testWidgets('cannot be edited when disabled', (tester) async {
      await pumpThemed(
        tester,
        const WabiTextField(label: 'Name', enabled: false),
      );

      expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
    });

    testWidgets('is at least as tall as the touch target', (tester) async {
      await pumpThemed(tester, const WabiTextField(label: 'Name'));

      expect(
        tester.getSize(find.byType(InputDecorator)).height,
        greaterThanOrEqualTo(WabiTextFieldTokens.height),
      );
    });

    for (final MapEntry(key: name, value: theme) in themes.entries) {
      testWidgets('meets the accessibility guidelines in the $name theme', (
        tester,
      ) async {
        final handle = tester.ensureSemantics();
        await pumpThemed(
          tester,
          const Column(
            mainAxisSize: MainAxisSize.min,
            spacing: WabiSpace.space4,
            children: [
              WabiTextField(label: 'Email', helperText: 'Work address.'),
              WabiTextField(label: 'Email', errorText: 'Enter a valid email.'),
              WabiTextField(label: 'Email', hintText: 'ana@example.com'),
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
