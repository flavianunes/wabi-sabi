import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi/wabi_sabi.dart';

/// Both themes, so every behaviour and guideline is checked against both palettes.
final themes = {'light': WabiTheme.light(), 'dark': WabiTheme.dark()};

/// Pumps [child] centred on a themed page.
Future<void> pumpThemed(
  WidgetTester tester,
  Widget child, {
  ThemeData? theme,
  bool disableAnimations = false,
}) {
  return tester.pumpWidget(
    MaterialApp(
      theme: theme ?? WabiTheme.light(),
      home: MediaQuery(
        data: MediaQueryData(disableAnimations: disableAnimations),
        child: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(WabiSpace.space4),
              child: child,
            ),
          ),
        ),
      ),
    ),
  );
}

/// The accessibility guidelines every component must meet, in every theme.
Future<void> expectMeetsGuidelines(WidgetTester tester) async {
  await expectLater(tester, meetsGuideline(textContrastGuideline));
  await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
  await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
}
