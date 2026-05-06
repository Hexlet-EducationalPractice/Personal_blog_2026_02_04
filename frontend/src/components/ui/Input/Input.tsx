import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

import styles from './Input.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const inputClassName = [styles.input, error ? styles.inputError : '', className ?? '']
      .filter(Boolean)
      .join(' ')

    return (
      <label className={styles.field}>
        {label && <span className={styles.label}>{label}</span>}

        <input {...props} ref={ref} className={inputClassName} />

        {error && <span className={styles.error}>{error}</span>}
      </label>
    )
  }
)

Input.displayName = 'Input'
