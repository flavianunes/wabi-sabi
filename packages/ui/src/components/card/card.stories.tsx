import type { Meta, StoryObj } from '@storybook/react-vite'
import { usagePage } from '../../../.storybook/usage-page'
import { Button } from '../button/button'
import { Card } from './card'

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: 'Free plan',
    children: 'Three projects, one member, and community support.',
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    footer: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '24rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: usagePage({
        whenToUse: [
          'To group content that belongs together under one title, such as a plan, a summary or a setting.',
          'With a footer for the actions that apply to that content.',
          'With headingLevel set to fit the page outline, so headings do not skip levels.',
        ],
        whenNotToUse: [
          'As a generic box for spacing or decoration. A card is a named region for assistive technology.',
          'For content that is the main subject of the page. A card is for a part of it.',
          'As one large click target. Put a link or button inside it instead.',
        ],
      }),
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button size="sm">Upgrade</Button>
        <Button size="sm" variant="ghost">
          Compare plans
        </Button>
      </>
    ),
  },
}

export const NestedHeading: Story = {
  args: { headingLevel: 3, title: 'Billing' },
}
