import { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../api';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export interface Post {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  created_at: string;
}

interface UsePostsParams {
  page: number;
  perPage: number;
  q?: string;
}

interface UsePostsReturn {
  posts: Post[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePosts = ({ page, perPage, q }: UsePostsParams): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPosts({ page, perPage, q });
      
      if (!signal?.aborted) {
        setPosts(response.posts as Post[]);
        setTotal(response.total);
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        return;
      }
      setError(getErrorMessage(e));
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [page, perPage, q]);

  useEffect(() => {
    const controller = new AbortController();
    
    (async () => {
      await fetchPosts(controller.signal);
    })();

    return () => {
      controller.abort();
    };
  }, [fetchPosts]);

  const refetch = () => {
    fetchPosts();
  };

  return {
    posts,
    total,
    isLoading,
    error,
    refetch,
  };
};
