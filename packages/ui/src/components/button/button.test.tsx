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

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Save</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Save</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })
})
