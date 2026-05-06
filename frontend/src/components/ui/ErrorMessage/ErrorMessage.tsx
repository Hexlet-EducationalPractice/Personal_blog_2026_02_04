import type { ReactNode } from 'react'
import styles from './ErrorMessage.module.css'
type ErrorMessageProps = {
  children: ReactNode
}
export function ErrorMessage({ children }: ErrorMessageProps) {
  return <div className={styles.errorMessage}>{children}</div>
}