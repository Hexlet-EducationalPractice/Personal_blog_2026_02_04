import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CommentForm } from '@/features/comments/components/CommentForm/CommentForm'
import { deleteComment } from '@/features/comments/api'
import { formatRelative } from '@/lib/format-date'
import type { CommentNode } from '@/features/comments/types'
import { getErrorMessage } from '@/lib/get-error-message'
import styles from './CommentItem.module.css'

type CommentItemProps = {
  comment: CommentNode
  postId: string
  currentUserId?: string
  onUpdated: () => void
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
  depth: number
}

const MAX_DEPTH = 3 // переместить в Consts?

export function CommentItem({
  comment,
  postId,
  currentUserId,
  onUpdated,
  replyingTo,
  setReplyingTo,
  depth,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isOwner = currentUserId === comment.user_id
  const isReplying = replyingTo === comment.id

  const avatarSrc = comment.author?.avatar_url ?? undefined
  const authorName = comment.author?.name ?? 'Unknown user'

  async function handleDelete() {
    try {
      await deleteComment(comment.id)
      setShowDeleteModal(false)
      onUpdated()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  return (
    <article className={styles.comment}>
      <div className={styles.avatar}>
        <Avatar src={avatarSrc} name={authorName} size="sm" />
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.author}>{authorName}</span>
          {comment.created_at && (
            <time className={styles.time} dateTime={comment.created_at ?? ''}>
              {formatRelative(comment.created_at)}
            </time>
          )}
        </header>

        {isEditing ? (
          <CommentForm
            mode="edit"
            postId={postId}
            parentId={comment.parent_id}
            commentId={comment.id}
            initialValue={comment.body}
            showTitle={false}
            onSuccess={() => {
              setIsEditing(false)
              onUpdated()
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className={styles.body}>{comment.body}</p>
        )}

        <footer className={styles.footer}>
          {depth < MAX_DEPTH && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.replyBtn}`}
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
            >
              ответить
            </button>
          )}

          {isOwner && !isEditing && (
            <>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.editBtn}`}
                onClick={() => setIsEditing(true)}
              >
                редактировать
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => setShowDeleteModal(true)}
              >
                удалить
              </button>
            </>
          )}
        </footer>
        {isReplying && (
          <div className={styles.replyFormWrapper}>
            <CommentForm
              postId={postId}
              parentId={comment.id}
              showTitle={false}
              onSuccess={() => {
                setReplyingTo(null)
                onUpdated()
              }}
              onCancel={() => setReplyingTo(null)}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                onUpdated={onUpdated}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить комментарий?"
      >
        <p className={styles.modalText}>Это действие нельзя отменить.</p>
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button type="button" variant="secondary" onClick={handleDelete}>
            Удалить
          </Button>
        </div>
      </Modal>
    </article>
  )
}
