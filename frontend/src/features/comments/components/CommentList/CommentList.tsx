import { Link } from 'react-router-dom'
import { useComments } from '@/features/comments/hooks/use-comments'
import { CommentForm } from '@/features/comments/components/CommentForm/CommentForm'
import { CommentThread } from '@/features/comments/components/CommentThread'
import { useAuth } from '@/features/auth/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import styles from './CommentList.module.css'

export function CommentList({ postId }: { postId: string }) {
  const { comments, isLoading, error, refetch } = useComments(postId)
  const { user } = useAuth()

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage>{error}</ErrorMessage>

  return (
    <section className={styles.container}>
      {user ? (
        <CommentForm postId={postId} parentId={null} onSuccess={refetch} showTitle={false} />
      ) : (
        <p className={styles.loginPrompt}>
          Войдите чтобы оставить комментарий{' '}
          <Link to="/auth" className={styles.loginLink}>
            Войти
          </Link>
        </p>
      )}

      <CommentThread
        comments={comments}
        postId={postId}
        currentUserId={user?.id}
        onUpdated={refetch}
      />
    </section>
  )
}
