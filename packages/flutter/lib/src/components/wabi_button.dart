import 'package:flutter/material.dart';

import '../theme/wabi_theme.dart';
import '../tokens/wabi_base_tokens.dart';
import '../tokens/wabi_colors.dart';

/// Visual weight. Mirrors `variant` on the React Button.
enum WabiButtonVariant { solid, soft, ghost }

/// Height, padding and type size. Mirrors `size` on the React Button.
enum WabiButtonSize { sm, md, lg }

/// A button.
///
/// The Flutter mirror of the React `Button`: same variants, sizes, `loading` and
/// `fullWidth`. Disabled is `onPressed: null`, the Flutter convention.
///
/// Built on Material's [TextButton], which supplies the button semantics, focus and
/// keyboard activation; every colour comes from [WabiColors]. The hit area is at least
/// 48×48 (Material's padded tap target, which Android's guideline requires), whatever the
/// visual size. A press scales the button to 0.97, except when the platform asks for
/// reduced motion.
///
/// ```dart
/// WabiButton(onPressed: save, child: const Text('Save'))
/// WabiButton(onPressed: save, loading: true, child: const Text('Saving'))
/// ```
class WabiButton extends StatefulWidget {
  const WabiButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.variant = WabiButtonVariant.solid,
    this.size = WabiButtonSize.md,
    this.loading = false,
    this.fullWidth = false,
    this.loadingLabel = 'Loading',
  });

  /// Called on activation. `null` disables the button.
  final VoidCallback? onPressed;

  /// The label, usually a [Text].
  final Widget child;

  final WabiButtonVariant variant;
  final WabiButtonSize size;

  /// Shows a spinner beside the label and blocks activation. The variant keeps its
  /// colours: the button is busy, not unavailable.
  final bool loading;

  /// Stretches the button to the width of its parent.
  final bool fullWidth;

  /// What assistive technology announces alongside the label while [loading].
  final String loadingLabel;

  @override
  State<WabiButton> createState() => _WabiButtonState();
}

class _WabiButtonState extends State<WabiButton> {
  final _states = WidgetStatesController();
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    // Rebuild on press so the scale follows the pressed state.
    _states.addListener(_onStatesChanged);
  }

  /// Rebuilds only when the pressed state flips. The controller also notifies during
  /// build (TextButton marks itself disabled there), where setState is not allowed.
  void _onStatesChanged() {
    final pressed = _states.value.contains(WidgetState.pressed);
    if (pressed == _pressed) return;
    setState(() => _pressed = pressed);
  }

  @override
  void dispose() {
    _states.removeListener(_onStatesChanged);
    _states.dispose();
    super.dispose();
  }

  bool get _enabled => widget.onPressed != null && !widget.loading;

  @override
  Widget build(BuildContext context) {
    final colors = context.wabiColors;
    final metrics = _ButtonMetrics.of(widget.size);
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    final pressed = _enabled && _pressed;

    final button = TextButton(
      onPressed: _enabled ? widget.onPressed : null,
      statesController: _states,
      style: _style(colors, metrics),
      child: Row(
        mainAxisSize: widget.fullWidth ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        spacing: metrics.gap,
        children: [
          if (widget.loading)
            Semantics(
              label: widget.loadingLabel,
              child: _Spinner(
                color: _foreground(colors, const {}),
                still: reduceMotion,
              ),
            ),
          Flexible(child: widget.child),
        ],
      ),
    );

    return AnimatedScale(
      scale: pressed && !reduceMotion ? 0.97 : 1,
      duration: WabiDuration.fast,
      curve: WabiEasing.enter,
      child: widget.fullWidth
          ? SizedBox(width: double.infinity, child: button)
          : button,
    );
  }

  ButtonStyle _style(WabiColors colors, _ButtonMetrics metrics) {
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.resolveWith(
        (s) => _background(colors, s),
      ),
      foregroundColor: WidgetStateProperty.resolveWith(
        (s) => _foreground(colors, s),
      ),
      // No ink ripple: press feedback is the scale, as on the web.
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
      splashFactory: NoSplash.splashFactory,
      side: WidgetStateProperty.resolveWith(
        (s) => s.contains(WidgetState.focused)
            ? BorderSide(color: colors.focus, width: WabiFocusRing.width)
            : BorderSide.none,
      ),
      shape: const WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.all(
            Radius.circular(WabiButtonTokens.radius),
          ),
        ),
      ),
      minimumSize: WidgetStatePropertyAll(Size(0, metrics.height)),
      fixedSize: WidgetStatePropertyAll(Size.fromHeight(metrics.height)),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(horizontal: metrics.paddingX),
      ),
      tapTargetSize: MaterialTapTargetSize.padded,
      textStyle: WidgetStatePropertyAll(
        TextStyle(
          fontSize: metrics.fontSize,
          fontWeight: WabiFontWeight.medium,
          height: WabiLineHeight.tight,
        ),
      ),
      mouseCursor: WidgetStateProperty.resolveWith(
        (s) => widget.loading
            ? SystemMouseCursors.progress
            : s.contains(WidgetState.disabled)
            ? SystemMouseCursors.forbidden
            : SystemMouseCursors.click,
      ),
    );
  }

  /// Disabled styling applies only when truly disabled, not while loading.
  bool _isDisabled(Set<WidgetState> states) =>
      states.contains(WidgetState.disabled) && !widget.loading;

  Color _background(WabiColors colors, Set<WidgetState> states) {
    final active =
        states.contains(WidgetState.hovered) ||
        states.contains(WidgetState.pressed);
    return switch (widget.variant) {
      _ when _isDisabled(states) =>
        widget.variant == WabiButtonVariant.ghost
            ? Colors.transparent
            : colors.control,
      WabiButtonVariant.solid => active ? colors.accentHover : colors.accent,
      WabiButtonVariant.soft =>
        active ? colors.accentBorder : colors.accentTint,
      WabiButtonVariant.ghost =>
        active ? colors.controlHover : Colors.transparent,
    };
  }

  Color _foreground(WabiColors colors, Set<WidgetState> states) {
    if (_isDisabled(states)) return colors.textInactive;
    return switch (widget.variant) {
      WabiButtonVariant.solid => colors.onAccent,
      WabiButtonVariant.soft => colors.accentText,
      WabiButtonVariant.ghost => colors.textDefault,
    };
  }
}

class _ButtonMetrics {
  const _ButtonMetrics({
    required this.height,
    required this.paddingX,
    required this.gap,
    required this.fontSize,
  });

  factory _ButtonMetrics.of(WabiButtonSize size) => switch (size) {
    WabiButtonSize.sm => const _ButtonMetrics(
      height: WabiButtonTokens.heightSm,
      paddingX: WabiButtonTokens.paddingXSm,
      gap: WabiButtonTokens.gapSm,
      fontSize: WabiFontSize.sm,
    ),
    WabiButtonSize.md => const _ButtonMetrics(
      height: WabiButtonTokens.heightMd,
      paddingX: WabiButtonTokens.paddingXMd,
      gap: WabiButtonTokens.gapMd,
      fontSize: WabiFontSize.base,
    ),
    WabiButtonSize.lg => const _ButtonMetrics(
      height: WabiButtonTokens.heightLg,
      paddingX: WabiButtonTokens.paddingXLg,
      gap: WabiButtonTokens.gapLg,
      fontSize: WabiFontSize.lg,
    ),
  };

  final double height;
  final double paddingX;
  final double gap;
  final double fontSize;
}

/// The loading indicator. Under reduced motion it is a still arc rather than a spinner.
class _Spinner extends StatelessWidget {
  const _Spinner({required this.color, required this.still});

  final Color color;
  final bool still;

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: WabiIcon.size,
      child: CircularProgressIndicator(
        value: still ? 0.75 : null,
        strokeWidth: WabiFocusRing.width,
        color: color,
      ),
    );
  }
}
