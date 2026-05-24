import { useAuth } from '@/features/auth/AuthContext'
import { env } from '@/lib/env'

export function useIsBlogOwner() {
  const { user } = useAuth()
  return user != null && user.id === env.blogOwnerId
}
