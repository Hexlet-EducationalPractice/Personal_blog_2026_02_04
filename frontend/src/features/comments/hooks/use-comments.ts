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

  const fetchComments = async () => {
    isMountedRef.current = true
    try {
      const data = await getComments(postId)
      if (isMountedRef.current) setComments(data)
    } catch (err) {
      if (isMountedRef.current) setError(getErrorMessage(err))
    }
  }

  const refetch = useCallback(async () => {
    if (!postId) return
    fetchComments().then(() => {
      if (isMountedRef.current) setIsLoading(false)
    })
  }, [postId])

  useEffect(() => {
    isMountedRef.current = true

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

  useEffect(() => {
    if (!postId) return

    let isMounted = true

    const loadInitialComments = async () => {
      try {
        const data = await getComments(postId)

        if (isMounted) setComments(data)
      } catch (err) {
        if (isMounted) setError(getErrorMessage(err))
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
