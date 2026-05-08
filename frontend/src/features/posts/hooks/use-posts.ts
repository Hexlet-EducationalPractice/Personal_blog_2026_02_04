import { useState, useEffect, useCallback, useRef } from 'react'
import { getPosts } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import type { PostWithAuthor } from '@/features/posts/types'

interface UsePostsParams {
  page: number
  perPage: number
  q?: string
}

interface UsePostsReturn {
  posts: PostWithAuthor[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const usePosts = ({ page, perPage, q }: UsePostsParams): UsePostsReturn => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMountedRef = useRef(false)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getPosts({ page, perPage, q })

      if (!isMountedRef.current) return

      setPosts(response.posts)
      setTotal(response.total)
    } catch (e) {
      if (!isMountedRef.current) return
      setError(getErrorMessage(e))
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [page, perPage, q])

  useEffect(() => {
    isMountedRef.current = true

    const load = async () => {
      await fetchPosts()
    }

    load()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchPosts])

  const refetch = useCallback(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts,
    total,
    isLoading,
    error,
    refetch,
  }
}
