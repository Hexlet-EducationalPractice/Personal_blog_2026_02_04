import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { CommentList } from '@/features/comments/components/CommentList/CommentList'
import { getPosts } from '@/features/posts/api'
import { usePost } from '@/features/posts/hooks/use-post'
import type { PostWithAuthor } from '@/features/posts/types'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Spinner } from '@/components/ui/Spinner'
import { RELATED_POSTS_COUNT, ROUTES } from '@/lib/constants'
import { formatDate } from '@/lib/format-date'
import { PostMedia } from '@/features/posts/components/PostMedia'

import styles from './TextPage.module.css'
import { ShareModal } from '@/components/ShareModal/ShareModal'
import { useIsBlogOwner } from '@/features/posts/hooks/use-is-blog-owner'
import { DeletePostModal } from '@/components/DeleteModal/DeletePostModal'
import { EditPostModal } from '@/components/EditModal/EditPostModal'
import { getErrorMessage } from '@/lib/get-error-message'

function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        className={styles.shareTrigger}
        onClick={() => setIsOpen(true)}
        aria-label="Поделиться"
      >
        <span className={styles.shareLabel}>поделиться</span>
        <ShareIcon className={styles.shareIcon} />
      </button>

      <ShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={18} height={18} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
      />
    </svg>
  )
}

export function TextPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = (id ?? '').trim()
  const { post, isLoading, error, notFound, refetch } = usePost(postId)
  const isBlogOwner = useIsBlogOwner()
  const [serverError, setServerError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostWithAuthor[]>([])
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  async function fetchLatestPosts(excludePostId: string): Promise<PostWithAuthor[]> {
    const seen = new Set<string>([excludePostId])
    const collected: PostWithAuthor[] = []

    setIsPostsLoading(true)
    const { posts } = await getPosts({ page: 1, perPage: RELATED_POSTS_COUNT + 1 })
    for (const p of posts) {
      if (seen.has(p.id)) continue
      seen.add(p.id)
      collected.push(p)
      if (collected.length >= RELATED_POSTS_COUNT) break
    }

    return collected
  }

  useEffect(() => {
    if (post === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- сброс «Интересно почитать» при отсутствии поста
      setRelatedPosts([])
      setServerError(null)
      return
    }

    setRelatedPosts([])
    setServerError(null)
    let cancelled = false

    void fetchLatestPosts(post.id)
      .then((collected) => {
        if (!cancelled) setRelatedPosts(collected)
      })
      .catch((err) => {
        setServerError(getErrorMessage(err))
      })
      .finally(() => setIsPostsLoading(false))

    return () => {
      cancelled = true
    }
  }, [post])

  if (!postId || notFound) {
    return <Navigate to="/404" replace />
  }

  if (isLoading) {
    return (
      <div className={styles.centered}>
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const formattedDate = post.created_at ? formatDate(post.created_at) : ''

  return (
    <div>
      <EditPostModal
        post={post}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => void refetch()}
      />

      <DeletePostModal
        post={post}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={() => {
          navigate('/')
          void refetch()
        }}
      />
      <article className={styles.page}>
        <div className={styles.toolbar}>
          <button type="button" className={styles.shareTrigger} onClick={() => navigate(-1)}>
            Вернуться назад
          </button>
        </div>

        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{post.title}</h1>
            <ShareButton />
          </div>

          {(formattedDate || post.tag) && (
            <div className={styles.metaRow}>
              <div className={styles.dateTag}>
                {formattedDate ? (
                  <time className={styles.date} dateTime={post.created_at ?? undefined}>
                    {formattedDate}
                  </time>
                ) : null}
                {formattedDate && post.tag ? (
                  <span className={styles.metaSep} aria-hidden>
                    ·
                  </span>
                ) : null}
                {post.tag ? <span className={styles.tagPlain}>{post.tag}</span> : null}
              </div>
              <div className={styles.titleActions}>
                {isBlogOwner && (
                  <>
                    <button
                      type="button"
                      className={styles.adminBtn}
                      onClick={() => setIsEditOpen(true)}
                    >
                      Редактировать
                    </button>

                    <button
                      type="button"
                      className={styles.adminBtn}
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        {post.image_url ? <PostMedia url={post.image_url} title={post.title} type="full" /> : null}

        <div className={styles.body}>{post.body}</div>

        <div className={styles.postFooter}>
          <div className={styles.blockDivider} aria-hidden />
          <section className={styles.section} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.sectionTitle}>
              Интересно почитать
            </h2>
            {(isPostsLoading || serverError) && (
              <div className={styles.serverState}>
                {isPostsLoading && <Spinner />}
                {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
              </div>
            )}
            <div className={styles.relatedGrid}>
              {relatedPosts.map((p) => {
                const relatedDate = p.created_at ? formatDate(p.created_at) : ''
                return (
                  <Link key={p.id} to={ROUTES.post(p.id)} className={styles.relatedLink}>
                    <span className={styles.relatedTitle}>{p.title}</span>
                    {relatedDate ? (
                      <time className={styles.relatedDate} dateTime={p.created_at ?? undefined}>
                        {relatedDate}
                      </time>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          </section>

          <div className={styles.blockDivider} aria-hidden />

          <section className={styles.section} aria-labelledby="discussion-heading">
            <h2 id="discussion-heading" className={styles.sectionTitle}>
              Обсуждение
            </h2>
            <CommentList postId={post.id} />
          </section>
        </div>
      </article>
    </div>
  )
}
