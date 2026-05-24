import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '@/features/posts/hooks/use-posts'
import { PostCard } from '@/features/posts/components/PostCard'
import { CreatePostForm } from '@/features/posts/components/CreatePostForm'
import { Pagination } from '@/components/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Modal } from '@/components/ui/Modal'
import { StoriesList } from '@/features/stories'
import { StoryViewer } from '@/features/stories'
import type { Story } from '@/features/stories/types'
import { POSTS_PER_PAGE } from '@/lib/constants'
import styles from './Home.module.css'
import { useIsBlogOwner } from '@/features/posts/hooks/use-is-blog-owner'

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [activeStory, setActiveStory] = useState<Story | null>(null)
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false)

  const isBlogOwner = useIsBlogOwner()
  const rawPage = Number(searchParams.get('page'))
  const uiPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
  const tag = searchParams.get('tag') ?? undefined

  const prevTagRef = useRef(tag)

  useEffect(() => {
    if (prevTagRef.current !== tag) {
      prevTagRef.current = tag
      setSearchParams(
        (prev) => {
          prev.delete('page')
          return prev
        },
        { replace: true },
      )
    }
  }, [tag, setSearchParams])

  const { posts, total, isLoading, error, refetch } = usePosts({
    page: uiPage,
    perPage: POSTS_PER_PAGE,
    tag: tag ?? undefined,
  })

  const handleCreatePostSuccess = () => {
    void refetch()
    setIsCreatePostOpen(false)
  }

  const handleOpenStory = (story: Story) => {
    setActiveStory(story)
    setIsStoryViewerOpen(true)
  }

  const handleClearTag = () => {
    setSearchParams((prev) => {
      prev.delete('tag')
      prev.delete('page')
      return prev
    })
  }

  const ownerToolbar = isBlogOwner ? (
    <>
      <div className={styles.ownerToolbar}>
        <button
          type="button"
          className={styles.createPostField}
          onClick={() => setIsCreatePostOpen(true)}
        >
          Напишите что-нибудь
        </button>
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
    setSearchParams((prev) => {
      prev.set('page', String(page))
      return prev
    })
  }

  const handleStoryClose = () => {
    setIsStoryViewerOpen(false)
    setTimeout(() => {
      setActiveStory(null)
    }, 200)
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

  const tagBlock = tag ? (
    <div className={styles.tagContainer}>
      <p>Фильтр по тегу: {tag}</p>
      <button onClick={handleClearTag}>✖</button>
    </div>
  ) : null

  const emptyState = tag ? (
    <div className={styles.tagContainer}>
      <p>Нет постов с тегом «{tag}»</p>
    </div>
  ) : (
    <p>Пока нет ни одного поста.</p>
  )

  return (
    <div className={styles.container}>
      <StoriesList onStoryClick={handleOpenStory} />

      {ownerToolbar}
      {tagBlock}

      {posts.length === 0 ? (
        emptyState
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onChange={refetch} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <Pagination
          currentPage={uiPage}
          totalCount={total ?? 0}
          perPage={POSTS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      <StoryViewer story={activeStory} onClose={handleStoryClose} isOpen={isStoryViewerOpen} />
    </div>
  )
}
