import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { TextField } from './text-field'

/** The ids in an element's aria-describedby, resolved to their text. */
function describedBy(element: HTMLElement): string[] {
  return (element.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? `missing #${id}`)
}

describe('TextField', () => {
  it('links the label to the input', () => {
    render(<TextField label="Email" />)

    const input = screen.getByRole('textbox', { name: 'Email' })
    const label = screen.getByText('Email')
    expect(label.getAttribute('for')).toBe(input.id)
  })

  it('describes the input with the helper text', () => {
    render(<TextField label="Email" helperText="We never share it." />)

    expect(describedBy(screen.getByRole('textbox'))).toEqual(['We never share it.'])
  })

  it('is valid by default', () => {
    render(<TextField label="Email" />)

    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).not.toBe('true')
  })

  it('announces the error: aria-invalid, and the message in aria-describedby', () => {
    render(<TextField label="Email" helperText="Work address." errorText="Enter a valid email." />)

    const input = screen.getByRole('textbox')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(describedBy(input)).toContain('Enter a valid email.')
  })

  it('works controlled, through value and onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    function Controlled() {
      const [value, setValue] = useState('')
      return (
        <TextField
          label="Name"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setValue(event.target.value)
          }}
        />
      )
    }
    render(<Controlled />)

    await user.type(screen.getByRole('textbox'), 'Ana')

    expect(onChange).toHaveBeenLastCalledWith('Ana')
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Ana')
  })

  it('cannot be edited when disabled', async () => {
    const user = userEvent.setup()
    render(<TextField label="Name" disabled />)

    const input = screen.getByRole('textbox') as HTMLInputElement
    await user.type(input, 'Ana')

    expect(input.disabled).toBe(true)
    expect(input.value).toBe('')
  })

  it('is reachable with the keyboard', async () => {
    const user = userEvent.setup()
    render(<TextField label="Name" />)

    await user.tab()

    expect(screen.getByRole('textbox')).toBe(document.activeElement)
  })

  describe.each(['light', 'dark'])('accessibility in the %s theme', (theme) => {
    it.each([
      ['at rest', {}],
      ['with helper text', { helperText: 'Work address.' }],
      ['invalid', { errorText: 'Enter a valid email.' }],
      ['disabled', { disabled: true }],
    ])('has no violations %s', async (_state, props) => {
      const { container } = render(
        <div data-theme={theme}>
          <TextField label="Email" {...props} />
        </div>,
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
