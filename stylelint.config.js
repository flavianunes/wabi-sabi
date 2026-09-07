/**
 * Stylelint configuration.
 *
 * The rule that matters here is the one in `overrides`: components may not reference
 * primitive tokens. That keeps the three-tier token architecture (primitive → semantic →
 * component) a verified rule rather than a written suggestion.
 */

/** Primitive scales, which components must never reference directly. */
const PRIMITIVE_SCALES = 'neutral|sakura|blue|green|yellow|red'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Every custom property this project defines is prefixed --ws-.
    'custom-property-pattern': [
      '^ws-[a-z0-9]+(-[a-z0-9]+)*$',
      {
        message: 'Custom properties must be kebab-case and prefixed --ws- (e.g. --ws-text-subtle).',
      },
    ],
    // CSS Modules scopes class names, so they are camelCase and unprefixed.
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Class names in CSS Modules are camelCase and unprefixed (e.g. .buttonSolid).' },
    ],
    // The token layer legitimately declares long lists of near-identical values.
    'declaration-block-no-redundant-longhand-properties': null,
    // Comments in the token files explain non-obvious decisions; do not demand a blank line.
    'comment-empty-line-before': null,
    // Token files are grouped into labelled blocks separated by blank lines.
    'custom-property-empty-line-before': null,
    /*
     * The colour scales are generated in OKLCH and committed as six-digit hex. Letting
     * Stylelint shorten #ffddee to #fde would make the generated output differ from the
     * file, so the scales would no longer be regenerable without a diff.
     */
    'color-hex-length': null,
    // oklch(0% 0 0 / 0.12) is the readable form for a neutral shadow; 0deg is noise.
    'hue-degree-notation': null,
    'alpha-value-notation': null,
  },
  overrides: [
    {
      files: ['packages/ui/src/components/**/*.css'],
      rules: {
        'declaration-property-value-disallowed-list': [
          {
            '/.*/': [
              String.raw`/var\(\s*--ws-(${PRIMITIVE_SCALES})-\d{1,2}\b/`,
              String.raw`/var\(\s*--ws-(white|black)\b/`,
            ],
          },
          {
            message:
              'Components must not reference primitive tokens. Use a semantic token (--ws-control, --ws-text-default) or define a component token in this file.',
          },
        ],
      },
    },
  ],
}
