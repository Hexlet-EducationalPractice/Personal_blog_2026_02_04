import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/AuthContext'

import { createComment, updateComment } from '@/features/comments/api'
import { Button } from '@/components/ui/Button'
import { getErrorMessage } from '@/lib/get-error-message'

import styles from './CommentForm.module.css'

const schema = z.object({
  body: z.string().min(2, 'Минимум 2 символа'),
})

type FormData = z.infer<typeof schema>

type Props = {
  postId: string
  parentId: string | null
  onSuccess: () => void
  onCancel?: () => void
  showTitle?: boolean
  initialValue?: string
  commentId?: string
  mode?: 'create' | 'edit'
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  showTitle = true,
  initialValue = '',
  commentId,
  mode = 'create',
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { body: initialValue },
  })

  const { user } = useAuth()

  async function onSubmit(data: FormData) {
    if (!user) return

    try {
      if (mode === 'edit' && commentId) {
        await updateComment(commentId, data.body)
      } else {
        await createComment({
          post_id: postId,
          parent_id: parentId ?? undefined,
          body: data.body,
          user_id: user.id,
        })
      }

      reset()
      onSuccess()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {showTitle && <h3 className={styles.title}>Обсуждение</h3>}

      <textarea {...register('body')} placeholder="Текст комментария" className={styles.textarea} />

      {errors.body && <p className={styles.error}>{errors.body.message}</p>}

      <div className={styles.actions}>
        <Button type="submit" disabled={isSubmitting}>
          {mode === 'edit' ? 'Сохранить' : 'Отправить'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  )
}
