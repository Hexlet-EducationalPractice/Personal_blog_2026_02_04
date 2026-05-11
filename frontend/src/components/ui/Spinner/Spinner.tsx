import styles from './Spinner.module.css'
type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerProps = {
  size?: SpinnerSize
}
const sizeClassMap: Record<SpinnerSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}
export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${sizeClassMap[size]}`} role="status" aria-label="Loading" />
  )
}
