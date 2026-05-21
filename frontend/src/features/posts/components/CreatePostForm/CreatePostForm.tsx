import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/features/auth/AuthContext'
import { createPost } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { truncate } from '@/lib/truncate'

import { GET_MAX_FILE_SIZE, POST_FILE_TYPES } from '@/lib/constants'
import paperclip from '@/assets/icons/paperclip.svg'
import styles from './CreatePostForm.module.css'

const schema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  body: z.string().trim().min(10, 'Минимум 10 символов'),
  media: z
    .instanceof(FileList)
    .refine(
      (files) => (files ? [...files].every((file) => POST_FILE_TYPES.includes(file.type)) : true),
      'Вложение должно быть медиа',
    )
    .refine(
      (files) => (files ? [...files].every((file) => file.size <= GET_MAX_FILE_SIZE(50)) : true),
      'Максимальный размер 50Мб',
    ),
  tag: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type CreatePostFormProps = {
  onSuccess: () => void
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuth()
  const [fileName, setFileName] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      body: '',
      tag: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    if (!user) return

    setServerError(null)

    const tagTrimmed = data.tag?.trim()

    try {
      await createPost({
        title: data.title,
        body: data.body,
        media: data.media[0] ?? null,
        tag: tagTrimmed && tagTrimmed.length > 0 ? tagTrimmed : null,
        user_id: user.id,
      })
      reset()
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
          Опубликовать
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
