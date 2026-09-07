import { Button as BaseButton } from '@base-ui/react/button'
import styles from './button.module.css'

/**
 * Visual weight. Not a status axis — a destructive action is still a `solid` button, with
 * its accent tokens overridden.
 */
export type ButtonVariant = 'solid' | 'soft' | 'ghost'

export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  solid: styles.solid ?? '',
  soft: styles.soft ?? '',
  ghost: styles.ghost ?? '',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
}

/**
 * Everything Base UI's Button accepts, plus this component's own two props.
 *
 * `className` is narrowed to a plain string. Base UI also allows a function of the
 * button's state, but that is an escape hatch that invites consumers to reason about
 * internals. Widening it later would not be a breaking change.
 */
export interface ButtonProps extends Omit<BaseButton.Props, 'className'> {
  /**
   * Visual weight of the button.
   *
   * @default 'solid'
   */
  variant?: ButtonVariant
  /**
   * Height, padding, and type size.
   *
   * @default 'md'
   */
  size?: ButtonSize
  className?: string
}

/**
 * A button.
 *
 * Wraps Base UI's Button, which supplies the semantics: the `button` role, keyboard
 * activation, and correct disabled behaviour even when rendered as another element via
 * `render`.
 *
 * Press feedback and hover are CSS transitions built from the motion tokens. There is no
 * enter or exit animation, because a button does not mount and unmount — the transitions
 * that matter here are between its states.
 *
 * @example
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * <Button variant="ghost" size="sm">Cancel</Button>
 * ```
 */
export function Button({ variant = 'solid', size = 'md', className, ...props }: ButtonProps) {
  const classes = [styles.button, VARIANT_CLASS[variant], SIZE_CLASS[size], className]
    .filter(Boolean)
    .join(' ')

  return <BaseButton className={classes} {...props} />
}

Button.displayName = 'Button'
