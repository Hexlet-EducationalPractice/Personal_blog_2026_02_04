import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '@/features/posts/hooks/use-posts'
import { PostCard } from '@/features/posts/components/PostCard'
import { CreatePostForm } from '@/features/posts/components/CreatePostForm'
import { Pagination } from '@/components/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/features/auth/AuthContext'
import { env } from '@/lib/env'
import { POSTS_PER_PAGE } from '@/lib/constants'
import styles from './Home.module.css'

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  const rawPage = Number(searchParams.get('page'))
  const uiPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const { user } = useAuth()
  const { posts, total, isLoading, error, refetch } = usePosts({
    page: uiPage,
    perPage: POSTS_PER_PAGE,
  })

  const isBlogOwner = user != null && user.id === env.blogOwnerId

  const handleCreatePostSuccess = () => {
    void refetch()
    setIsCreatePostOpen(false)
  }

  const ownerToolbar = isBlogOwner ? (
    <>
      <div className={styles.ownerToolbar}>
        <Button type="button" onClick={() => setIsCreatePostOpen(true)}>
          Создать пост
        </Button>
      </div>
      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Новый пост"
      >
        <CreatePostForm onSuccess={handleCreatePostSuccess} />
      </Modal>
    </>
  ) : null

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) })
  }

  if (isLoading) {
    return (
      <div className={styles.pageWithToolbar}>
        {ownerToolbar}
        <div className={styles.center}>
          <Spinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.pageWithToolbar}>
        {ownerToolbar}
        <div className={styles.center}>
          <ErrorMessage>Ошибка загрузки постов</ErrorMessage>
        </div>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.pageWithToolbar}>
        {ownerToolbar}
        <div className={styles.center}>Постов пока нет</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {ownerToolbar}
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
