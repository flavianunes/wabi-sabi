import 'package:flutter/material.dart';

import '../theme/wabi_theme.dart';
import '../tokens/wabi_base_tokens.dart';

/// A labelled single-line text input.
///
/// The Flutter mirror of the React `TextField`: [label] is required, [helperText] and
/// [errorText] sit under the input, and [errorText] marks the field invalid. Value is
/// [controller] plus [onChanged], and disabled is `enabled: false`, the Flutter
/// conventions.
///
/// Built on Material's [TextField] with an [InputDecoration], which gives the label,
/// helper and error to assistive technology with the input. Every colour comes from
/// `WabiColors`: the border meets 3:1 against the page, and turns to the danger colour
/// when invalid.
///
/// ```dart
/// WabiTextField(label: 'Email', helperText: 'We never share it.')
/// WabiTextField(label: 'Email', errorText: 'Enter a valid email address.')
/// ```
class WabiTextField extends StatelessWidget {
  const WabiTextField({
    super.key,
    required this.label,
    this.helperText,
    this.errorText,
    this.controller,
    this.onChanged,
    this.enabled = true,
    this.keyboardType,
    this.hintText,
  });

  /// The visible label. Required: a hint is not a label.
  final String label;

  /// Guidance shown under the input.
  final String? helperText;

  /// An error message. When present the field is invalid.
  final String? errorText;

  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool enabled;
  final TextInputType? keyboardType;

  /// Example content shown while the input is empty. Never a substitute for [label].
  final String? hintText;

  @override
  Widget build(BuildContext context) {
    final colors = context.wabiColors;

    OutlineInputBorder border(Color color, [double width = WabiBorder.width]) =>
        OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(WabiRadius.md)),
          borderSide: BorderSide(color: color, width: width),
        );

    final small = TextStyle(
      fontSize: WabiFontSize.sm,
      height: WabiLineHeight.base,
    );

    return TextField(
      controller: controller,
      onChanged: onChanged,
      enabled: enabled,
      keyboardType: keyboardType,
      style: TextStyle(
        color: enabled ? colors.textDefault : colors.textInactive,
        fontSize: WabiFontSize.base,
      ),
      cursorColor: colors.accent,
      decoration: InputDecoration(
        labelText: label,
        helperText: helperText,
        errorText: errorText,
        hintText: hintText,
        filled: true,
        fillColor: enabled ? colors.canvas : colors.control,
        constraints: const BoxConstraints(
          minHeight: WabiTextFieldTokens.height,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: WabiTextFieldTokens.paddingX,
          vertical: WabiSpace.space3,
        ),
        labelStyle: TextStyle(
          color: enabled ? colors.textSubtle : colors.textInactive,
        ),
        floatingLabelStyle: WidgetStateTextStyle.resolveWith(
          (states) => TextStyle(
            color: states.contains(WidgetState.error)
                ? colors.dangerText
                : states.contains(WidgetState.disabled)
                ? colors.textInactive
                : colors.textDefault,
          ),
        ),
        hintStyle: TextStyle(color: colors.textPlaceholder),
        helperStyle: small.copyWith(color: colors.textSubtle),
        errorStyle: small.copyWith(color: colors.dangerText),
        enabledBorder: border(colors.lineStrong),
        focusedBorder: border(colors.focus, WabiFocusRing.width),
        errorBorder: border(colors.danger),
        focusedErrorBorder: border(colors.danger, WabiFocusRing.width),
        disabledBorder: border(colors.hairline),
      ),
    );
  }
}
