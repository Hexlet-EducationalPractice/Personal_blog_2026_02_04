import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildCommentTree } from '@/lib/build-comment-tree'
import { useComments } from '@/features/comments/hooks/use-comments'
import { CommentItem } from '@/features/comments/components/CommentItem/CommentItem'
import { CommentForm } from '@/features/comments/components/CommentForm/CommentForm'
import { useAuth } from '@/features/auth/AuthContext'
import type { CommentWithAuthor } from '@/features/comments/types'
import styles from './CommentList.module.css'

export type CommentNode = CommentWithAuthor & {
  replies: CommentNode[]
}

export function CommentList({ postId }: { postId: string }) {
  const { comments, isLoading, error, refetch } = useComments(postId)
  const { user } = useAuth()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка</div>

  const tree = buildCommentTree(comments) as unknown as CommentNode[]

  return (
    <section className={styles.container}>
      {user ? (
        <CommentForm postId={postId} parentId={null} onSuccess={refetch} showTitle={true} />
      ) : (
        <p className={styles.loginPrompt}>
          Войдите чтобы оставить комментарий{' '}
          <Link to="/auth" className={styles.loginLink}>
            Войти
          </Link>
        </p>
      )}

      {tree.length === 0 && <div className={styles.emptyState}>Комментариев пока нет</div>}

      {tree.map((node) => (
        <CommentItem
          key={node.id}
          comment={node}
          postId={postId}
          currentUserId={user?.id}
          onUpdated={refetch}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          depth={0}
        />
      ))}
    </section>
  )
}
