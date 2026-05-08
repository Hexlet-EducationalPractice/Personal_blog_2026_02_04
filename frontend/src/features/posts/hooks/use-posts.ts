import { useState, useEffect, useCallback } from 'react'
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

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getPosts({ page, perPage, q })
      setPosts(response.posts)
      setTotal(response.total)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setIsLoading(false)
    }
  }, [page, perPage, q])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getPosts({ page, perPage, q })
        if (isMounted) {
          setPosts(response.posts)
          setTotal(response.total)
        }
      } catch (e) {
        if (isMounted) {
          setError(getErrorMessage(e))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [page, perPage, q])

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
