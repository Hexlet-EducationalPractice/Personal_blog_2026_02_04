import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { usePosts } from '@/features/posts/hooks/use-posts'
import { PostCard } from '@/features/posts/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { MIN_SEARCH_LENGTH, POSTS_PER_PAGE } from '@/lib/constants'

import styles from './SearchResult.module.css'

export function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q')?.trim() ?? ''
  const rawPage = Number(searchParams.get('page'))
  const uiPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const isQueryValid = q.length >= MIN_SEARCH_LENGTH

  const { posts, total, isLoading, error } = usePosts({
    page: uiPage,
    perPage: POSTS_PER_PAGE,
    q: isQueryValid ? q : undefined,
  })

  useEffect(() => {
    if (uiPage !== 1) {
      const params = new URLSearchParams(searchParams)
      params.delete('page')
      setSearchParams(params, { replace: true })
    }
  }, [q, uiPage, searchParams, setSearchParams])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    setSearchParams(params)
  }

  if (!q) {
    return (
      <div className={styles.container}>
        <p className={styles.hint}>
          Введите минимум {MIN_SEARCH_LENGTH} символа в поле поиска
        </p>
      </div>
    )
  }

  if (!isQueryValid) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          Результаты поиска <span className={styles.query}>«{q}»</span>
        </h1>
        <p className={styles.hint}>
          Введите минимум {MIN_SEARCH_LENGTH} символа в поле поиска
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Результаты поиска <span className={styles.query}>«{q}»</span>
      </h1>

      {isLoading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {error && (
        <div className={styles.center}>
          <ErrorMessage>Ошибка загрузки результатов</ErrorMessage>
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p className={styles.empty}>
          Ничего не найдено по запросу «{q}»
        </p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <>
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={uiPage}
            totalCount={total ?? 0}
            perPage={POSTS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}