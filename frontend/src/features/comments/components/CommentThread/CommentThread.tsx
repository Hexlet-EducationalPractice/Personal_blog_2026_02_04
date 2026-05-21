import { useState } from 'react'
import { buildCommentTree } from '@/lib/build-comment-tree'
import { CommentItem } from '@/features/comments/components/CommentItem/CommentItem'
import type { CommentWithAuthor } from '@/features/comments/types'
import styles from './CommentThread.module.css'

type CommentThreadProps = {
  comments: CommentWithAuthor[]
  postId: string
  currentUserId?: string
  onUpdated: () => void
}

export function CommentThread({
  comments,
  postId,
  currentUserId,
  onUpdated,
}: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const tree = buildCommentTree(comments)

  if (tree.length === 0) {
    return <div className={styles.emptyState}>Комментариев пока нет</div>
  }

  return (
    <>
      {tree.map((node) => (
        <CommentItem
          key={node.id}
          comment={node}
          postId={postId}
          currentUserId={currentUserId}
          onUpdated={onUpdated}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          depth={0}
        />
      ))}
    </>
  )
}
