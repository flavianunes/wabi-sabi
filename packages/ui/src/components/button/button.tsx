import { Button as BaseButton } from '@base-ui/react/button'
import { useIcon } from '../../icons/provider'
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
  /**
   * Shows a spinner beside the label and blocks activation, while keeping the button
   * focusable so keyboard and screen reader users do not lose their place. Announced
   * through `aria-busy`.
   *
   * @default false
   */
  loading?: boolean
  /**
   * Stretches the button to the width of its container.
   *
   * @default false
   */
  fullWidth?: boolean
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
 * While `loading`, the label stays and a spinner joins it, so the button keeps its width.
 * The hit area is at least 44px tall at every size, without changing the visual height.
 *
 * @example
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * <Button variant="ghost" size="sm">Cancel</Button>
 * <Button loading>Saving</Button>
 * ```
 */
export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  focusableWhenDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const Spinner = useIcon('spinner')
  const classes = [
    styles.button,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <BaseButton
      {...props}
      className={classes}
      disabled={disabled || loading}
      // A loading button must not drop focus: the user pressed it and is waiting on it.
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
    >
      {loading && <Spinner aria-hidden="true" className={styles.spinner} />}
      {children}
    </BaseButton>
  )
}

Button.displayName = 'Button'
