import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Card } from './card'

describe('Card', () => {
  it('is a region named by its title', () => {
    render(<Card title="Plan">You are on the free plan.</Card>)

    const region = screen.getByRole('region', { name: 'Plan' })
    expect(region.tagName).toBe('SECTION')
    expect(region.textContent).toContain('You are on the free plan.')
  })

  it('renders the title as a level 2 heading by default', () => {
    render(<Card title="Plan">Body</Card>)

    expect(screen.getByRole('heading', { level: 2, name: 'Plan' })).toBeDefined()
  })

  it('follows the given heading level', () => {
    render(
      <Card title="Plan" headingLevel={3}>
        Body
      </Card>,
    )

    expect(screen.getByRole('heading', { level: 3, name: 'Plan' })).toBeDefined()
  })

  it('renders the footer only when given one', () => {
    const { container, rerender } = render(<Card title="Plan">Body</Card>)
    expect(container.querySelector('footer')).toBeNull()

    rerender(
      <Card title="Plan" footer={<a href="/upgrade">Upgrade</a>}>
        Body
      </Card>,
    )
    expect(container.querySelector('footer')?.textContent).toBe('Upgrade')
  })

  it('gives each card its own title id', () => {
    render(
      <>
        <Card title="One">Body</Card>
        <Card title="Two">Body</Card>
      </>,
    )

    expect(screen.getByRole('region', { name: 'One' })).not.toBe(
      screen.getByRole('region', { name: 'Two' }),
    )
  })

  describe.each(['light', 'dark'])('accessibility in the %s theme', (theme) => {
    it.each([
      ['without a footer', {}],
      ['with a footer', { footer: <a href="/upgrade">Upgrade</a> }],
    ])('has no violations %s', async (_state, props) => {
      const { container } = render(
        <main data-theme={theme}>
          <Card title="Plan" {...props}>
            You are on the free plan.
          </Card>
        </main>,
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
