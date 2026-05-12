import { useSearchParams } from 'react-router-dom'
import { usePosts } from '@/features/posts/hooks/use-posts'
import { PostCard } from '@/features/posts/components/PostCard'
import { CreatePostForm } from '@/features/posts/components/CreatePostForm'
import { Pagination } from '@/components/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useAuth } from '@/features/auth/AuthContext'
import { env } from '@/lib/env'
import { POSTS_PER_PAGE } from '@/lib/constants'
import styles from './Home.module.css'

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawPage = Number(searchParams.get('page'))
  const uiPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const { user } = useAuth()
  const { posts, total, isLoading, error, refetch } = usePosts({
    page: uiPage,
    perPage: POSTS_PER_PAGE,
  })
  const isBlogOwner = user?.id === env.blogOwnerId
  const ownerForm = isBlogOwner ? <CreatePostForm onSuccess={refetch} /> : null

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) })
  }

  if (isLoading) {
    return (
      <>
        {ownerForm}
        <div className={styles.center}>
          <Spinner />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        {ownerForm}
        <div className={styles.center}>
          <ErrorMessage>Ошибка загрузки постов</ErrorMessage>
        </div>
      </>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <>
        {ownerForm}
        <div className={styles.center}>Постов пока нет</div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      {ownerForm}
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
    </div>
  )
}
