import { useState, useEffect, useRef } from 'react'

import { supabase } from '@/lib/supabase'
import { env } from '@/lib/env'
import { getErrorMessage } from '@/lib/get-error-message'
import type { Profile } from '@/features/profile/types'

interface UseBlogOwnerReturn {
  profile: Profile | null
  isLoading: boolean
  error: string | null
}

export const useBlogOwner = (): UseBlogOwnerReturn => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    const fetchBlogOwner = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', env.blogOwnerId)
          .single()

        if (!isMountedRef.current) return

        if (supabaseError) {
          setError(getErrorMessage(supabaseError))
          return
        }

        if (!data) {
          setError('Профиль владельца блога не найден')
          return
        }

        setProfile(data)
      } catch (e) {
        if (!isMountedRef.current) return
        setError(getErrorMessage(e))
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    fetchBlogOwner()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    profile,
    isLoading,
    error,
  }
}