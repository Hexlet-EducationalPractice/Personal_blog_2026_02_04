import { useState, useEffect, useRef } from 'react'
import { getPostById } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import type { PostWithAuthor } from '@/features/posts/types'

function isNotFoundRowError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  if (!('code' in error)) return false
  const code = (error as { code: unknown }).code
  return code === 'PGRST116'
}

export interface UsePostReturn {
  post: PostWithAuthor | null
  isLoading: boolean
  error: string | null
  notFound: boolean
}

export function usePost(id: string): UsePostReturn {
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    if (!id.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- пустой id: сброс без запроса
      setPost(null)
      setError(null)
      setNotFound(true)
      setIsLoading(false)
      return () => {
        isMountedRef.current = false
      }
    }

    setIsLoading(true)
    setError(null)
    setNotFound(false)
    setPost(null)

    async function fetchPost() {
      try {
        const fetched = await getPostById(id)
        if (!isMountedRef.current) return
        setPost(fetched)
      } catch (e) {
        if (!isMountedRef.current) return
        if (isNotFoundRowError(e)) {
          setPost(null)
          setNotFound(true)
        } else {
          setError(getErrorMessage(e))
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false)
      }
    }
    void fetchPost()

    return () => {
      isMountedRef.current = false
    }
  }, [id])

  return {
    post,
    isLoading,
    error,
    notFound,
  }
}
