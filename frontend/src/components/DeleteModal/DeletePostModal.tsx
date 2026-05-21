import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { PostWithAuthor } from '@/features/posts/types'
import { deletePost } from '@/features/posts/api'

type Props = {
  post: PostWithAuthor
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}

export function DeletePostModal({ post, isOpen, onClose, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      if (!post) return
      if (!post.image_url) return
      await deletePost(post.id, post.image_url ?? undefined)
      onClose()
      onDeleted?.()
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Удалить пост?">
      <p>Это действие нельзя отменить.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>

        <Button variant="secondary" loading={isDeleting} onClick={handleDelete}>
          Удалить
        </Button>
      </div>
    </Modal>
  )
}
