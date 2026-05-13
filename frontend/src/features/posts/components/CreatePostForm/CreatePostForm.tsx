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

import styles from './CreatePostForm.module.css'

const schema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  body: z.string().trim().min(10, 'Минимум 10 символов'),
  image_url: z.string().trim().url('Некорректный URL'),
  tag: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type CreatePostFormProps = {
  onSuccess: () => void
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuth()
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
      image_url: '',
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
        image_url: data.image_url,
        tag: tagTrimmed && tagTrimmed.length > 0 ? tagTrimmed : null,
        user_id: user.id,
      })
      reset()
      onSuccess()
    } catch (e) {
      setServerError(getErrorMessage(e))
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input label="Заголовок" {...register('title')} error={errors.title?.message} />

      <Textarea label="Текст" rows={6} {...register('body')} error={errors.body?.message} />

      <Input
        label="URL изображения"
        type="url"
        {...register('image_url')}
        error={errors.image_url?.message}
      />

      <Input label="Тег (необязательно)" {...register('tag')} error={errors.tag?.message} />

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          Опубликовать
        </Button>
      </div>

      {serverError ? (
        <div className={styles.serverError}>
          <ErrorMessage>{serverError}</ErrorMessage>
        </div>
      ) : null}
    </form>
  )
}
