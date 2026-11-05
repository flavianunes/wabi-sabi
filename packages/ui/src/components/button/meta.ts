import type { ComponentMeta } from '../../lib/meta'

export const meta: ComponentMeta = {
  name: 'Button',
  status: 'preview',
  since: '0.0.0',
  knownLimitations: [
    'There is no destructive variant. Visual weight and status are separate axes, and conflating them is how a variant list reaches nine entries. For a destructive action, override the accent tokens on a wrapper.',
    'No icon-only mode, so an icon-only button needs its own accessible name via aria-label and will not be square.',
    'State transitions are CSS, not Motion. This is deliberate — a press is frequent enough that motion must stay near-imperceptible, and it keeps the Motion runtime out of the bundle for consumers who only use Button.',
  ],
}
