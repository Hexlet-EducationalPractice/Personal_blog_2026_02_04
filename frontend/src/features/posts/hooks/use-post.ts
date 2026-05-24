import { useReducer, useEffect, useCallback, useRef } from 'react'
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
  refetch: () => Promise<void>
}

interface State {
  post: PostWithAuthor | null
  isLoading: boolean
  error: string | null
  notFound: boolean
}

type Action =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: PostWithAuthor }
  | { type: 'NOT_FOUND' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }

const initialState: State = {
  post: null,
  isLoading: true,
  error: null,
  notFound: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null, notFound: false }
    case 'SUCCESS':
      return { post: action.payload, isLoading: false, error: null, notFound: false }
    case 'NOT_FOUND':
      return { post: null, isLoading: false, error: null, notFound: true }
    case 'ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'RESET':
      return { post: null, isLoading: false, error: null, notFound: true }
    default:
      return state
  }
}

export function usePost(id: string): UsePostReturn {
  const [state, dispatch] = useReducer(reducer, initialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmedId = id.trim()

    if (!trimmedId) {
      dispatch({ type: 'RESET' })
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    dispatch({ type: 'LOADING' })

    const fetchPost = async () => {
      try {
        const fetched = await getPostById(trimmedId)
        if (!abortController.signal.aborted) {
          dispatch({ type: 'SUCCESS', payload: fetched })
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          if (isNotFoundRowError(e)) {
            dispatch({ type: 'NOT_FOUND' })
          } else {
            dispatch({ type: 'ERROR', payload: getErrorMessage(e) })
          }
        }
      }
    }

    void fetchPost()

    return () => {
      abortController.abort()
    }
  }, [id])

  const refetch = useCallback(async () => {
    const trimmedId = id.trim()
    if (!trimmedId) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    dispatch({ type: 'LOADING' })

    try {
      const fetched = await getPostById(trimmedId)
      if (!abortController.signal.aborted) {
        dispatch({ type: 'SUCCESS', payload: fetched })
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        if (isNotFoundRowError(e)) {
          dispatch({ type: 'NOT_FOUND' })
        } else {
          dispatch({ type: 'ERROR', payload: getErrorMessage(e) })
        }
      }
    }
  }, [id])

  return {
    post: state.post,
    isLoading: state.isLoading,
    error: state.error,
    notFound: state.notFound,
    refetch,
  }
}
