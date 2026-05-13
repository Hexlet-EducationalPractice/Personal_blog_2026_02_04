import { Link } from 'react-router-dom'

import { formatDate } from '@/lib/format-date'
import { truncate } from '@/lib/truncate'
import type { PostWithAuthor } from '@/features/posts/types'

import styles from './PostCard.module.css'

type PostCardProps = {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const postUrl = `/post/${post.id}`
  const formattedDate = post.created_at ? formatDate(post.created_at) : 'Дата неизвестна'
  const preview = truncate(post.body, 200)

  return (
    <article className={styles.card}>
      {post.image_url && (
        <Link to={postUrl}>
          <div className={styles.imageContainer}>
            <img className={styles.image} src={post.image_url} alt={post.title} />
          </div>
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

            {post.tag && <span className={styles.tag}>{post.tag}</span>}
          </div>

          <Link className={styles.link} to={postUrl}>
            читать
          </Link>
        </div>
      </div>
    </article>
  )
}
