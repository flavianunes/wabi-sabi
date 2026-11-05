import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wabi_sabi/wabi_sabi.dart';

void main() {
  test('each theme carries its own WabiColors', () {
    expect(WabiTheme.light().extension<WabiColors>(), WabiColors.light);
    expect(WabiTheme.dark().extension<WabiColors>(), WabiColors.dark);
  });

  test('the Material colour scheme follows the tokens', () {
    final light = WabiTheme.light().colorScheme;
    expect(light.brightness, Brightness.light);
    expect(light.primary, WabiColors.light.accent);
    expect(light.surface, WabiColors.light.canvas);

    final dark = WabiTheme.dark().colorScheme;
    expect(dark.brightness, Brightness.dark);
    expect(dark.surface, WabiColors.dark.canvas);
  });

  test('lerp interpolates every colour between the themes', () {
    final halfway = WabiColors.light.lerp(WabiColors.dark, 0.5);

    expect(
      halfway.canvas,
      Color.lerp(WabiColors.light.canvas, WabiColors.dark.canvas, 0.5),
    );
    expect(
      WabiColors.light.lerp(WabiColors.dark, 1).canvas,
      WabiColors.dark.canvas,
    );
  });
}
