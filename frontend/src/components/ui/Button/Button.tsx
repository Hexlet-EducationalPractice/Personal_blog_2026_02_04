import React from 'react'
import styles from './Button.module.css'

type ButtonVariant =
  | 'blue'
  | 'red'
  | 'ghost'
  | 'primary'
  | 'secondary'

type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonShape = 'pill' | 'rounded'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  size = 'md',
  shape = 'pill',
  loading = false,
  disabled,
  type = 'button',
  children,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading

  const normalizedVariant =
    variant === 'primary'
      ? 'blue'
      : variant === 'secondary'
        ? 'red'
        : variant

  const classNames = [
    styles.button,
    styles[normalizedVariant],
    styles[size],
    styles[shape],
    isDisabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classNames}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}