import { supabase } from '@/lib/supabase'
import { getComments } from '../api'
import type { CommentWithAuthor } from '../types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '@/lib/get-error-message'

export function useComments(postId: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(!!postId)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(false)

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(postId)
      if (isMountedRef.current) setComments(data)
    } catch (err) {
      if (isMountedRef.current) setError(getErrorMessage(err))
    }
  }, [postId])

  const refetch = useCallback(async () => {
    if (!postId) return
    if (isMountedRef.current) setIsLoading(true)
    await fetchComments()
    if (isMountedRef.current) setIsLoading(false)
  }, [postId])

  useEffect(() => {
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()

    const channel = supabase
      .channel(`comments:post:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        fetchComments,
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
        },
        fetchComments,
      )
      .subscribe()
    return () => {
      channel.unsubscribe()
      isMountedRef.current = false
    }
  }, [postId, refetch])

  return {
    comments,
    isLoading,
    error,
    refetch,
  }
}
