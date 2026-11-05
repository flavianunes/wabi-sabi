import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi/wabi_sabi.dart';

import 'helpers.dart';

void main() {
  group('WabiCard', () {
    testWidgets('marks its title as a header', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpThemed(
        tester,
        const WabiCard(title: 'Free plan', child: Text('Body')),
      );

      expect(
        tester.getSemantics(find.text('Free plan')),
        matchesSemantics(label: 'Free plan', isHeader: true),
      );
      handle.dispose();
    });

    testWidgets('renders its content', (tester) async {
      await pumpThemed(
        tester,
        const WabiCard(title: 'Free plan', child: Text('Three projects.')),
      );

      expect(find.text('Three projects.'), findsOneWidget);
    });

    testWidgets('renders the footer only when given one', (tester) async {
      await pumpThemed(
        tester,
        const WabiCard(title: 'Plan', child: Text('Body')),
      );
      expect(find.text('Upgrade'), findsNothing);

      await pumpThemed(
        tester,
        WabiCard(
          title: 'Plan',
          footer: WabiButton(onPressed: () {}, child: const Text('Upgrade')),
          child: const Text('Body'),
        ),
      );
      expect(find.text('Upgrade'), findsOneWidget);
    });

    for (final MapEntry(key: name, value: theme) in themes.entries) {
      testWidgets('meets the accessibility guidelines in the $name theme', (
        tester,
      ) async {
        final handle = tester.ensureSemantics();
        await pumpThemed(
          tester,
          WabiCard(
            title: 'Free plan',
            footer: WabiButton(
              onPressed: () {},
              size: WabiButtonSize.sm,
              child: const Text('Upgrade'),
            ),
            child: const Text('Three projects, one member.'),
          ),
          theme: theme,
        );

        await expectMeetsGuidelines(tester);
        handle.dispose();
      });
    }
  });
}
