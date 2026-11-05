import 'package:flutter/material.dart';

import '../theme/wabi_theme.dart';
import '../tokens/wabi_base_tokens.dart';

/// A titled group of related content.
///
/// The Flutter mirror of the React `Card`: a [title], the content as [child], and an
/// optional [footer]. The title is marked as a header for assistive technology, and the
/// card is its own semantic container, the counterpart of the web's named `<section>`.
///
/// ```dart
/// WabiCard(
///   title: 'Free plan',
///   footer: WabiButton(onPressed: upgrade, child: const Text('Upgrade')),
///   child: const Text('Three projects and one member.'),
/// )
/// ```
class WabiCard extends StatelessWidget {
  const WabiCard({
    super.key,
    required this.title,
    required this.child,
    this.footer,
  });

  final String title;
  final Widget child;

  /// Optional content below the body, such as actions.
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    final colors = context.wabiColors;
    final footer = this.footer;

    return Semantics(
      container: true,
      explicitChildNodes: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.base,
          border: Border.all(color: colors.line, width: WabiBorder.width),
          borderRadius: const BorderRadius.all(
            Radius.circular(WabiCardTokens.radius),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(WabiCardTokens.padding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            spacing: WabiCardTokens.gap,
            children: [
              Semantics(
                header: true,
                child: Text(
                  title,
                  style: TextStyle(
                    color: colors.textStrong,
                    fontSize: WabiFontSize.lg,
                    fontWeight: WabiFontWeight.medium,
                    height: WabiLineHeight.tight,
                  ),
                ),
              ),
              DefaultTextStyle.merge(
                style: TextStyle(
                  color: colors.textDefault,
                  height: WabiLineHeight.base,
                ),
                child: child,
              ),
              if (footer != null)
                DecoratedBox(
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(
                        color: colors.hairline,
                        width: WabiBorder.width,
                      ),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.only(top: WabiCardTokens.gap),
                    child: Align(
                      alignment: AlignmentDirectional.centerStart,
                      child: footer,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
