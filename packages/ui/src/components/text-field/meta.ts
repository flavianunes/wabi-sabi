import type { ComponentMeta } from '../../lib/meta'

export const meta: ComponentMeta = {
  name: 'TextField',
  status: 'preview',
  since: '0.0.0',
  knownLimitations: [
    'Single line only. There is no multiline (textarea) mode.',
    'No prefix or suffix adornments, such as an icon or a unit, inside the input.',
    'Validation is the caller’s: the field shows errorText when given one, and does not surface the browser’s own constraint validation messages.',
  ],
}
