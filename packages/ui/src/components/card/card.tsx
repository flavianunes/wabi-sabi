import { type ComponentProps, type ReactNode, useId } from 'react'
import styles from './card.module.css'

export type CardHeadingLevel = 2 | 3 | 4 | 5 | 6

export interface CardProps extends Omit<ComponentProps<'section'>, 'title' | 'className'> {
  /** The card's title, rendered as a heading that also names the section. */
  title: ReactNode
  /** Optional content below the body, such as actions. */
  footer?: ReactNode
  /**
   * The heading level of the title, so the card fits the document outline it sits in.
   *
   * @default 2
   */
  headingLevel?: CardHeadingLevel
  children?: ReactNode
  className?: string
}

/**
 * A titled group of related content.
 *
 * Renders a `<section>` named by its heading through `aria-labelledby`, so assistive
 * technology lists it as a region with that title. There is no motion: a card does not
 * change state.
 *
 * @example
 * ```tsx
 * <Card title="Plan" footer={<Button>Upgrade</Button>}>
 *   You are on the free plan.
 * </Card>
 * ```
 */
export function Card({
  title,
  footer,
  headingLevel = 2,
  className,
  children,
  ...props
}: CardProps) {
  const titleId = useId()
  const Heading = `h${headingLevel}` as const
  const classes = [styles.card, className].filter(Boolean).join(' ')

  return (
    <section {...props} className={classes} aria-labelledby={titleId}>
      <Heading id={titleId} className={styles.title}>
        {title}
      </Heading>
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  )
}

Card.displayName = 'Card'
