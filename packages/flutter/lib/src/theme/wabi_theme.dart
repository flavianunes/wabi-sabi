import 'package:flutter/material.dart';

import '../tokens/wabi_colors.dart';

/// Builds the Material 3 [ThemeData] for each wabi-sabi theme.
///
/// The [ColorScheme] is mapped from the semantic tokens so stock Material widgets look at
/// home next to the wabi-sabi ones, and [WabiColors] is registered as a theme extension:
/// wabi-sabi components read every colour from there, never from a constant.
///
/// ```dart
/// MaterialApp(
///   theme: WabiTheme.light(),
///   darkTheme: WabiTheme.dark(),
/// )
/// ```
abstract final class WabiTheme {
  static ThemeData light() => _build(WabiColors.light, Brightness.light);

  static ThemeData dark() => _build(WabiColors.dark, Brightness.dark);

  static ThemeData _build(WabiColors colors, Brightness brightness) {
    final scheme = ColorScheme(
      brightness: brightness,
      primary: colors.accent,
      onPrimary: colors.onAccent,
      primaryContainer: colors.accentTint,
      onPrimaryContainer: colors.accentText,
      secondary: colors.info,
      onSecondary: colors.onInfo,
      secondaryContainer: colors.infoTint,
      onSecondaryContainer: colors.infoText,
      error: colors.danger,
      onError: colors.onDanger,
      errorContainer: colors.dangerTint,
      onErrorContainer: colors.dangerText,
      surface: colors.canvas,
      onSurface: colors.textDefault,
      onSurfaceVariant: colors.textSubtle,
      surfaceContainerLowest: colors.canvas,
      surfaceContainerLow: colors.base,
      surfaceContainer: colors.elevated,
      surfaceContainerHigh: colors.recessed,
      surfaceContainerHighest: colors.recessed,
      outline: colors.lineStrong,
      outlineVariant: colors.line,
      inverseSurface: colors.contrast,
      onInverseSurface: colors.textInverse,
      shadow: colors.shadowDrop,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: colors.canvas,
      dividerColor: colors.hairline,
      focusColor: colors.focus,
      extensions: [colors],
    );
  }
}

/// Shorthand for the active [WabiColors].
extension WabiThemeContext on BuildContext {
  /// The semantic colours of the nearest theme. Throws if the theme was not built with
  /// [WabiTheme], because every wabi-sabi component depends on it.
  WabiColors get wabiColors {
    final colors = Theme.of(this).extension<WabiColors>();
    assert(
      colors != null,
      'WabiColors is missing from the theme. Use WabiTheme.light() or WabiTheme.dark().',
    );
    return colors!;
  }
}
