import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders its children inside a button element', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined()
  })

  it('calls onClick when activated', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )

    await user.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('marks the disabled state with a data attribute, which is what the CSS keys off', () => {
    render(<Button disabled>Save</Button>)

    expect(screen.getByRole('button').hasAttribute('data-disabled')).toBe(true)
  })

  // Keyboard activation comes from Base UI. Asserting it here guards against a future
  // change — a `render` prop, say — quietly removing button semantics.
  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('activates with %s', async (_name, key) => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await user.tab()
    expect(screen.getByRole('button')).toBe(document.activeElement)

    await user.keyboard(key)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('keeps button semantics when rendered as another element', () => {
    render(
      <Button nativeButton={false} render={<span />}>
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.tagName).toBe('SPAN')
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="ghost" size="lg">
        Save
      </Button>,
    )

    // CSS Modules hashes class names, so assert on the readable part of the scoped name.
    expect(screen.getByRole('button').className).toMatch(/ghost/)
    expect(screen.getByRole('button').className).toMatch(/lg/)
  })

  it('keeps a caller-supplied className alongside its own', () => {
    render(<Button className="custom">Save</Button>)

    expect(screen.getByRole('button').className).toMatch(/custom/)
  })

  // Disabled is a state, not a variant: a filled disabled ghost button reads as a solid
  // one. Regression guard for a blanket background on the disabled rule.
  it('keeps each variant distinguishable while disabled', () => {
    const { container } = render(
      <>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="solid" disabled>
          Solid
        </Button>
      </>,
    )

    const [ghost, solid] = [...container.querySelectorAll('button')]
    expect(ghost?.className).toMatch(/ghost/)
    expect(solid?.className).toMatch(/solid/)
    expect(ghost?.className).not.toBe(solid?.className)
  })

  describe('loading', () => {
    it('announces itself as busy and shows a decorative spinner', () => {
      render(<Button loading>Save</Button>)

      const button = screen.getByRole('button', { name: 'Save' })
      expect(button.getAttribute('aria-busy')).toBe('true')
      expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    })

    it('does not call onClick', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      )

      await user.click(screen.getByRole('button'))

      expect(onClick).not.toHaveBeenCalled()
    })

    // The user pressed it and is waiting on it; losing focus would drop them to the page.
    it('stays focusable', async () => {
      const user = userEvent.setup()
      render(<Button loading>Save</Button>)

      await user.tab()

      expect(screen.getByRole('button')).toBe(document.activeElement)
    })

    it('is not busy by default', () => {
      render(<Button>Save</Button>)

      expect(screen.getByRole('button').hasAttribute('aria-busy')).toBe(false)
      expect(screen.getByRole('button').querySelector('svg')).toBeNull()
    })
  })

  it('stretches to its container with fullWidth', () => {
    render(<Button fullWidth>Save</Button>)

    expect(screen.getByRole('button').className).toMatch(/fullWidth/)
  })

  describe.each(['light', 'dark'])('accessibility in the %s theme', (theme) => {
    it.each([
      ['at rest', {}],
      ['disabled', { disabled: true }],
      ['loading', { loading: true }],
    ])('has no violations %s', async (_state, props) => {
      const { container } = render(
        <div data-theme={theme}>
          <Button {...props}>Save</Button>
        </div>,
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
