import { Link } from 'react-router-dom'

import { formatDate } from '@/lib/format-date'
import { truncate } from '@/lib/truncate'

import type { PostWithAuthor } from '@/features/posts/types'

type PostCardProps = {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const postUrl = `/post/${post.id}`
  const formattedDate = post.created_at ? formatDate(post.created_at) : 'Дата неизвестна'
  const preview = truncate(post.body, 200)
  const authorName = post.author?.name ?? 'Автор'

  return (
    <Link to={postUrl}>
      <article>
        <div>
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} />
          ) : (
            <div>Нет изображения</div>
          )}
        </div>

        <div>
          {post.tag && <span>{post.tag}</span>}

          <h2>{post.title}</h2>

          <time dateTime={post.created_at ?? undefined}>{formattedDate}</time>

          <span>{authorName}</span>

          <p>{preview}</p>
        </div>
      </article>
    </Link>
  )
}
