import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/features/auth/AuthContext'
import { createPost, updatePost } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { truncate } from '@/lib/truncate'

import { GET_MAX_FILE_SIZE, POST_FILE_TYPES } from '@/lib/constants'
import paperclip from '@/assets/icons/paperclip.svg'
import styles from './CreatePostForm.module.css'
import type { PostWithAuthor } from '../../types'

const schema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  body: z.string().trim().min(10, 'Минимум 10 символов'),
  media: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        [...files].every((file) => POST_FILE_TYPES.includes(file.type)),
      'Вложение должно быть медиа',
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        [...files].every((file) => file.size <= GET_MAX_FILE_SIZE(50)),
      'Максимальный размер 50Мб',
    ),
  tag: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type CreatePostFormProps = {
  onSuccess: () => void
  mode?: 'edit' | 'create'
  initialPost?: PostWithAuthor
}

export function CreatePostForm({ onSuccess, mode = 'create', initialPost }: CreatePostFormProps) {
  const { user } = useAuth()
  const [fileName, setFileName] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const isEdit = mode === 'edit'

  const getFormDefaults = (post?: PostWithAuthor) => ({
    title: isEdit && post ? post.title : '',
    body: isEdit && post ? post.body : '',
    tag: isEdit && post ? (post.tag ?? '') : '',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getFormDefaults(initialPost),
  })

  useEffect(() => {
    if (isEdit && initialPost) {
      reset(getFormDefaults(initialPost))
    }
  }, [initialPost, isEdit, reset])

  const onSubmit = async (data: FormValues) => {
    if (!user) return

    setServerError(null)

    const tagTrimmed = data.tag?.trim()
    const mediaFile = data.media?.[0] ?? null
    const finalTag = tagTrimmed && tagTrimmed.length > 0 ? tagTrimmed : null

    try {
      if (isEdit) {
        if (!initialPost) throw new Error('Пост не найден')
        await updatePost(initialPost.id, {
          title: data.title,
          body: data.body,
          tag: finalTag,
          ...(mediaFile ? { media: mediaFile } : {}),
        })
      } else {
        if (!user) throw new Error('Пользователь не авторизован')
        await createPost({
          title: data.title,
          body: data.body,
          media: mediaFile,
          tag: finalTag,
          user_id: user.id,
        })
        reset()
      }

      onSuccess()
    } catch (e) {
      setServerError(getErrorMessage(e))
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : null)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Заголовок"
        className={styles.input}
        {...register('title')}
        aria-invalid={Boolean(errors.title)}
        error={errors.title?.message}
      />

      <Textarea
        placeholder="Текст"
        rows={7}
        className={styles.textarea}
        {...register('body')}
        aria-invalid={Boolean(errors.body)}
        error={errors.body?.message}
      />

      <Input
        placeholder="Тег (необязательно)"
        className={styles.input}
        {...register('tag')}
        aria-invalid={Boolean(errors.tag)}
        error={errors.tag?.message}
      />

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Сохранить' : 'Опубликовать'}
        </Button>

        <label className={styles.filePlace}>
          <img src={paperclip} alt="Приложить файл" className={styles.paperclip} />
          <input
            className={styles.inputFile}
            type="file"
            accept={POST_FILE_TYPES.join()}
            aria-hidden="true"
            {...register('media', { onChange: handleFileChange })}
          />
          <div className={styles.fileInfo}>
            {fileName && <span>{truncate(fileName, 20)}</span>}
            {!fileName && isEdit && initialPost?.image_url && (
              <span className={styles.fileInfo}>Файл прикреплен</span>
            )}
            {errors.media && <span className={styles.error}>{errors.media?.message}</span>}
          </div>
        </label>
      </div>

      {serverError ? (
        <div className={styles.serverError}>
          <ErrorMessage>{serverError}</ErrorMessage>
        </div>
      ) : null}
    </form>
  )
}
