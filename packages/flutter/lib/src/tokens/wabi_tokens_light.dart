
//
// wabi_tokens_light.dart
//


import 'dart:ui';

class WabiTokensLight {
    WabiTokensLight._();

    static const accent = Color(0xFF9E507A); /** The customisable set is the six accent tokens. Override those, not the sakura scale. */
    static const accentBorder = Color(0xFFECB5D0);
    static const accentHover = Color(0xFF93436F);
    static const accentText = Color(0xFF834165);
    static const accentTint = Color(0xFFFFE8F4);
    static const base = Color(0xFFF9F8F7);
    static const canvas = Color(0xFFFDFDFC);
    static const contrast = Color(0xFF302D2B);
    static const control = Color(0xFFF2F0EE);
    static const controlActive = Color(0xFFE3E0DD);
    static const controlHover = Color(0xFFEBE8E6);
    static const danger = Color(0xFFC03631);
    static const dangerBorder = Color(0xFFFFABA0);
    static const dangerText = Color(0xFFA02925);
    static const dangerTint = Color(0xFFFFE6E1);
    static const elevated = Color(0xFFF2F0EE);
    static const focus = Color(0xFF9E507A); /** Focus ring. Step 9, not 8: a focus indicator needs 3:1 against the surface it sits on (WCAG 1.4.11). */
    static const hairline = Color(0xFFD8D5D2);
    static const info = Color(0xFF466DB5);
    static const infoBorder = Color(0xFFACC8FA);
    static const infoText = Color(0xFF385997);
    static const infoTint = Color(0xFFE4F1FF);
    static const line = Color(0xFFCAC7C3);
    static const lineStrong = Color(0xFF736E68); /** Borders that identify an interactive control, such as a text field. Needs 3:1 against its surface; --line is for decorative borders. */
    static const link = Color(0xFF385997);
    static const onAccent = Color(0xFFFFFFFF);
    static const onDanger = Color(0xFFFFFFFF);
    static const onInfo = Color(0xFFFFFFFF);
    static const onSuccess = Color(0xFFFFFFFF);
    static const onWarning = Color(0xFF423000); /** NOT A BUG. The only colour fixed across modes: yellow-9 is bright in both, so text on it is dark in both. 8.2:1 on yellow-9. */
    static const recessed = Color(0xFFEBE8E6);
    static const shadowDrop = Color(0x14000000);
    static const shadowEdge = Color(0x1F000000);
    static const success = Color(0xFF338144);
    static const successBorder = Color(0xFFA6D6AC);
    static const successText = Color(0xFF276B36);
    static const successTint = Color(0xFFE1F8E3);
    static const textDefault = Color(0xFF302D2B);
    static const textInactive = Color(0xFFB5B0AC);
    static const textInverse = Color(0xFFFDFDFC);
    static const textPlaceholder = Color(0xFF67625D);
    static const textStrong = Color(0xFF302D2B);
    static const textSubtle = Color(0xFF5E5A55);
    static const tint = Color(0xFFF2F0EE);
    static const warning = Color(0xFFFFC807);
    static const warningBorder = Color(0xFFE6C36B);
    static const warningText = Color(0xFF876300);
    static const warningTint = Color(0xFFFFEFCB);
}