import { Modal } from '@/components/ui/Modal'
import type { PostWithAuthor } from '@/features/posts'
import { CreatePostForm } from '@/features/posts/components/CreatePostForm'

type Props = {
  post: PostWithAuthor
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function EditPostModal({ post, isOpen, onClose, onSuccess }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать пост">
      <CreatePostForm
        mode="edit"
        initialPost={post}
        onSuccess={() => {
          onClose()
          onSuccess?.()
        }}
      />
    </Modal>
  )
}
