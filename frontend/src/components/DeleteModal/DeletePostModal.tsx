import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { PostWithAuthor } from '@/features/posts/types'
import { deletePost } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import { ErrorMessage } from '../ui/ErrorMessage'

type Props = {
  post: PostWithAuthor
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}

export function DeletePostModal({ post, isOpen, onClose, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!post) return
    setIsDeleting(true)
    setError(null)
    try {
      if (post.image_url) {
        await deletePost(post.id, post.image_url ?? undefined)
      } else {
        await deletePost(post.id, '')
      }
      onClose()
      onDeleted?.()
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = async () => {
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Удалить пост?">
      {error ? <ErrorMessage>{error}</ErrorMessage> : <p>Это действие нельзя отменить.</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>

        <Button variant="secondary" loading={isDeleting} onClick={handleDelete}>
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </Button>
      </div>
    </Modal>
  )
}
