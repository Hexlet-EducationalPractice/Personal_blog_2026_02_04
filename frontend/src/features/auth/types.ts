import type { Tables } from '@/types/database'
import type { User } from '@supabase/supabase-js'

export type Profile = Tables<'profiles'>

export interface AuthContextValue {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}
