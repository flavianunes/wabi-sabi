import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi_widgetbook/main.dart';

void main() {
  testWidgets('the Widgetbook builds and lists every component', (tester) async {
    // A desktop-sized surface, so Widgetbook shows its navigation panel.
    tester.view.physicalSize = const Size(1600, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(const WabiWidgetbook());
    await tester.pumpAndSettle();

    for (final name in ['WabiButton', 'WabiTextField', 'WabiCard']) {
      expect(find.text(name), findsWidgets, reason: name);
    }
  });
}
