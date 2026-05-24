import { Link } from 'react-router-dom'

import { PostMedia } from '../PostMedia'
import { formatDate } from '@/lib/format-date'
import { truncate } from '@/lib/truncate'
import type { PostWithAuthor } from '@/features/posts/types'

import styles from './PostCard.module.css'
import { useIsBlogOwner } from '../../hooks/use-is-blog-owner'
import { useState } from 'react'
import { EditPostModal } from '@/components/EditModal/EditPostModal'
import { DeletePostModal } from '@/components/DeleteModal/DeletePostModal'

type PostCardProps = {
  post: PostWithAuthor
  onChange?: () => void
}

export function PostCard({ post, onChange }: PostCardProps) {
  const isBlogOwner = useIsBlogOwner()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const postUrl = `/post/${post.id}`
  const formattedDate = post.created_at ? formatDate(post.created_at) : 'Дата неизвестна'
  const preview = truncate(post.body, 200)

  return (
    <div>
      <EditPostModal
        post={post}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={onChange}
      />

      <DeletePostModal
        post={post}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeleted={onChange}
      />
      <article className={styles.card}>
        {post.image_url && (
          <Link to={postUrl}>
            <PostMedia url={post.image_url} title={post.title} type="preview" />
          </Link>
        )}

        <div className={styles.content}>
          <h2 className={styles.title}>{post.title}</h2>

          <p className={styles.preview}>{preview}</p>

          <div className={styles.meta}>
            <div className={styles.metaData}>
              <time className={styles.date} dateTime={post.created_at ?? undefined}>
                {formattedDate}
              </time>
              {post.tag ? (
                <Link
                  to={`/?tag=${encodeURIComponent(post.tag ?? '')}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {<span className={styles.tag}>{post.tag}</span>}
                </Link>
              ) : null}
            </div>

            <div className={styles.bottomActions}>
              {isBlogOwner && (
                <div className={styles.ownerActions}>
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
                </div>
              )}

              <Link className={styles.link} to={postUrl}>
                Читать
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
