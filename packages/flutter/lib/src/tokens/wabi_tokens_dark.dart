
//
// wabi_tokens_dark.dart
//


import 'dart:ui';

class WabiTokensDark {
    WabiTokensDark._();

    static const accent = Color(0xFF9E507A); /** The customisable set is the six accent tokens. Override those, not the sakura scale. */
    static const accentBorder = Color(0xFF6D3F57);
    static const accentHover = Color(0xFFAE5F89);
    static const accentText = Color(0xFFDC9ABB);
    static const accentTint = Color(0xFF331D28);
    static const base = Color(0xFF1A1919);
    static const canvas = Color(0xFF121111);
    static const contrast = Color(0xFFE9E7E5);
    static const control = Color(0xFF262523);
    static const controlActive = Color(0xFF383634);
    static const controlHover = Color(0xFF2F2D2B);
    static const danger = Color(0xFFC03631);
    static const dangerBorder = Color(0xFF82332D);
    static const dangerText = Color(0xFFFC8D81);
    static const dangerTint = Color(0xFF3D1815);
    static const elevated = Color(0xFF262523);
    static const focus = Color(0xFF9E507A); /** Focus ring. Step 9, not 8: a focus indicator needs 3:1 against the surface it sits on (WCAG 1.4.11). */
    static const hairline = Color(0xFF43413E);
    static const info = Color(0xFF466DB5);
    static const infoBorder = Color(0xFF384F7A);
    static const infoText = Color(0xFF90B1EE);
    static const infoTint = Color(0xFF1A2539);
    static const line = Color(0xFF524F4C);
    static const lineStrong = Color(0xFF736E68); /** Borders that identify an interactive control, such as a text field. Needs 3:1 against its surface; --line is for decorative borders. */
    static const link = Color(0xFF90B1EE);
    static const onAccent = Color(0xFFFFFFFF);
    static const onDanger = Color(0xFFFFFFFF);
    static const onInfo = Color(0xFFFFFFFF);
    static const onSuccess = Color(0xFFFFFFFF);
    static const onWarning = Color(0xFF423000); /** NOT A BUG. The only colour fixed across modes: yellow-9 is bright in both, so text on it is dark in both. 8.2:1 on yellow-9. */
    static const recessed = Color(0xFF2F2D2B);
    static const shadowDrop = Color(0x4D000000);
    static const shadowEdge = Color(0x1AFFFFFF);
    static const success = Color(0xFF338144);
    static const successBorder = Color(0xFF305B37);
    static const successText = Color(0xFF87C28F);
    static const successTint = Color(0xFF172B1A);
    static const textDefault = Color(0xFFE9E7E5);
    static const textInactive = Color(0xFF696561);
    static const textInverse = Color(0xFF121111);
    static const textPlaceholder = Color(0xFF817C77);
    static const textStrong = Color(0xFFE9E7E5);
    static const textSubtle = Color(0xFFB4B0AC);
    static const tint = Color(0xFF262523);
    static const warning = Color(0xFFFFC807);
    static const warningBorder = Color(0xFF684B00);
    static const warningText = Color(0xFFE1B850);
    static const warningTint = Color(0xFF2F2303);
}