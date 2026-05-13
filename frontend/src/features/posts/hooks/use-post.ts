import { useState, useEffect, useRef } from 'react'
import { getPostById } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import type { PostWithAuthor } from '@/features/posts/types'

interface UsePostReturn {
  post: PostWithAuthor | null
  isLoading: boolean
  error: string | null
}

export function usePost(id: string): UsePostReturn {
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    async function fetchPost() {
      try {
        const post = await getPostById(id)
        setPost(post)
      } catch (e) {
        if (!isMountedRef.current) return
        setError(getErrorMessage(e))
      } finally {
        if (isMountedRef.current) setIsLoading(false)
      }
    }
    fetchPost()
    return () => {
      isMountedRef.current = false
    }
  }, [id])

  return {
    post,
    isLoading,
    error,
  }
}
