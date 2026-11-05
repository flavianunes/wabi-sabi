import type { ComponentMeta } from '../../lib/meta'

export const meta: ComponentMeta = {
  name: 'Card',
  status: 'preview',
  since: '0.0.0',
  knownLimitations: [
    'No media slot: an image above the title has to go in the body.',
    'The whole card is not clickable. A card that links somewhere needs a link inside it.',
  ],
}
