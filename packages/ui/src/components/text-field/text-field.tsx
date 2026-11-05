import { Field } from '@base-ui/react/field'
import type { ReactNode } from 'react'
import styles from './text-field.module.css'

/**
 * Everything an `<input>` accepts through Base UI's Field.Control, plus the field's own
 * parts as props.
 *
 * `className` is narrowed to a plain string and lands on the root, so a caller positions
 * the whole field rather than reaching into the input.
 */
export interface TextFieldProps extends Omit<Field.Control.Props, 'className' | 'children'> {
  /** The visible label. Required: a placeholder is not a label. */
  label: ReactNode
  /** Guidance shown under the input, linked to it through `aria-describedby`. */
  helperText?: ReactNode
  /**
   * An error message. When present the field is invalid: the input gets `aria-invalid`, the
   * message is linked through `aria-describedby`, and the border turns to the danger colour.
   */
  errorText?: ReactNode
  className?: string
}

/**
 * A labelled single-line text input.
 *
 * Composes Base UI's Field, which wires the label to the input (`htmlFor` and `id`) and
 * collects the helper and error messages into the input's `aria-describedby`. Validation is
 * the caller's decision: pass `errorText` and the field becomes invalid.
 *
 * @example
 * ```tsx
 * <TextField label="Email" type="email" helperText="We never share it." />
 * <TextField label="Email" value={email} onChange={onChange} errorText="Enter a valid email." />
 * ```
 */
export function TextField({
  label,
  helperText,
  errorText,
  disabled,
  className,
  ...props
}: TextFieldProps) {
  const invalid = errorText != null && errorText !== false && errorText !== ''
  const classes = [styles.textField, className].filter(Boolean).join(' ')

  return (
    <Field.Root className={classes} disabled={disabled} invalid={invalid}>
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Field.Control className={styles.control} {...props} />
      {helperText && <Field.Description className={styles.helper}>{helperText}</Field.Description>}
      {/* `match` shows the message whenever it is rendered; invalidity is set above. */}
      {invalid && (
        <Field.Error className={styles.error} match>
          {errorText}
        </Field.Error>
      )}
    </Field.Root>
  )
}

TextField.displayName = 'TextField'
