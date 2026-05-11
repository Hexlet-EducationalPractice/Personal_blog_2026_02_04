import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import styles from './Textarea.module.css'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    const textareaClassName = [styles.textarea, error ? styles.textareaError : '', className ?? '']
      .filter(Boolean)
      .join(' ')

    return (
      <label className={styles.field}>
        {label && <span className={styles.label}>{label}</span>}

        <textarea {...props} ref={ref} className={textareaClassName} />

        {error && <span className={styles.error}>{error}</span>}
      </label>
    )
  },
)

Textarea.displayName = 'Textarea'
