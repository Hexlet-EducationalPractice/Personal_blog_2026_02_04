import { useMemo, useState } from 'react'
import styles from './Avatar.module.css'
type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarProps = {
  src?: string
  name: string
  size?: AvatarSize
}
const sizeClassMap: Record<AvatarSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}
function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
function getBackgroundColor(name: string): string {
  let hash = 0

  for (const char of name.trim()) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 65% 42%)`
}
export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const initials = useMemo(() => getInitials(name), [name])
  const backgroundColor = useMemo(() => getBackgroundColor(name), [name])
  const avatarSizeClass = sizeClassMap[size]
  const showImage = Boolean(src) && !hasImageError
  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        className={`${styles.avatar} ${avatarSizeClass}`}
        onError={() => setHasImageError(true)}
      />
    )
  }
  return (
    <div
      className={`${styles.avatar} ${styles.fallback} ${avatarSizeClass}`}
      style={{ backgroundColor }}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  )
}