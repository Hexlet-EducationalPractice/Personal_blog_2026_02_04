import { supabase } from '@/lib/supabase'
import { getComments } from '../api'
import type { CommentWithAuthor } from '../types'
import { useCallback, useEffect, useState } from 'react'

export function useComments(postId: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(!!postId)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!postId) return
    try {
      setIsLoading(true)
      setError(null)

      const data = await getComments(postId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    const channel = supabase
      .channel('comment-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        refetch,
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
        },
        refetch,
      )
      .subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [postId])

  useEffect(() => {
    if (!postId) return

    let isMounted = true

    const loadInitialComments = async () => {
      try {
        const data = await getComments(postId)

        if (isMounted) setComments(data)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadInitialComments()

    return () => {
      isMounted = false
    }
  }, [postId])

  return {
    comments,
    isLoading,
    error,
    refetch,
  }
}
