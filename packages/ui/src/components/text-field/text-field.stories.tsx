import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { usagePage } from '../../../.storybook/usage-page'
import { TextField } from './text-field'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Email', type: 'email', placeholder: 'ana@example.com' },
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
          'For a short, single-line answer: a name, an email, a search term.',
          'With helperText when the expected format is not obvious from the label.',
          'With errorText after validation fails, saying how to fix the value, not only that it is wrong.',
        ],
        whenNotToUse: [
          'For long or multi-paragraph text. It is single-line only.',
          'To choose from a fixed set of options. Use a select or radio group.',
          'With a placeholder in place of a label. The label is required for that reason.',
        ],
      }),
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithHelperText: Story = {
  args: { helperText: 'We only use it to send receipts.' },
}

export const Invalid: Story = {
  args: {
    defaultValue: 'ana@',
    errorText: 'Enter a complete email address, like ana@example.com.',
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Email' })

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription(
      'Enter a complete email address, like ana@example.com.',
    )
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'ana@example.com' },
}

export const Controlled: Story = {
  render: function ControlledField(args) {
    const [value, setValue] = useState('')
    return (
      <TextField
        {...args}
        label="Name"
        type="text"
        placeholder=""
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText={`${value.length} characters`}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Name' })

    await userEvent.type(input, 'Ana')
    await expect(input).toHaveValue('Ana')
    await expect(input).toHaveAccessibleDescription('3 characters')
  },
}
