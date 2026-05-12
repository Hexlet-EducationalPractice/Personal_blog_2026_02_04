import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/get-error-message'
import { supabase } from '@/lib/supabase'

import styles from './ProfileEditForm.module.css'

const schema = z
  .object({
    name: z.string().trim().min(2, 'Имя должно быть минимум 2 символа'),
    avatar_url: z.string().trim().url('Введите корректный URL аватара'),
    new_password: z.string(),
    confirm_password: z.string(),
  })
  .refine(
    (data) => {
      const hasNewPassword = data.new_password.length > 0
      const hasConfirmPassword = data.confirm_password.length > 0

      if (!hasNewPassword && !hasConfirmPassword) return true
      if (data.new_password.length < 6) return false

      return data.new_password === data.confirm_password
    },
    {
      message: 'Пароли должны совпадать и быть минимум 6 символов',
      path: ['confirm_password'],
    },
  )

type FormValues = z.infer<typeof schema>

export function ProfileEditForm() {
  const { user, profile, refetchProfile, signOut } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      avatar_url: profile?.avatar_url ?? '',
      new_password: '',
      confirm_password: '',
    },
  })

  useEffect(() => {
    if (!profile || isDirty) return

    reset({
      name: profile.name ?? '',
      avatar_url: profile.avatar_url ?? '',
      new_password: '',
      confirm_password: '',
    })
  }, [profile, reset, isDirty])

  const onSubmit = async (data: FormValues) => {
    if (!user) return

    setServerError(null)
    setSuccess(false)

    try {
      const profileChanged =
        data.name !== (profile?.name ?? '') || data.avatar_url !== (profile?.avatar_url ?? '')

      if (profileChanged) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            avatar_url: data.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (error) throw error
      }

      if (data.new_password) {
        const { error } = await supabase.auth.updateUser({
          password: data.new_password,
        })

        if (error) throw error
      }

      await refetchProfile()

      reset({
        name: data.name,
        avatar_url: data.avatar_url,
        new_password: '',
        confirm_password: '',
      })

      setSuccess(true)
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  const handleSignOut = async () => {
    setServerError(null)
    setSuccess(false)

    try {
      await signOut()
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <ErrorMessage>Пользователь не найден</ErrorMessage>
      </div>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <Avatar
          src={profile?.avatar_url || undefined}
          name={profile?.name || 'Пользователь'}
          size="xl"
        />
        <div>
          <h1 className={styles.title}>Профиль</h1>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Email" value={user.email ?? ''} readOnly className={styles.readOnlyInput} />

        <Input label="Имя" autoComplete="name" error={errors.name?.message} {...register('name')} />

        <Input
          label="URL аватара"
          type="url"
          autoComplete="url"
          error={errors.avatar_url?.message}
          {...register('avatar_url')}
        />

        <Input
          label="Новый пароль"
          type="password"
          autoComplete="new-password"
          error={errors.new_password?.message}
          {...register('new_password')}
        />

        <Input
          label="Подтвердите пароль"
          type="password"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
        {success && <p className={styles.success}>Профиль сохранён</p>}

        <div className={styles.actions}>
          <Button type="submit" loading={isSubmitting}>
            Сохранить
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSignOut}
            className={styles.signOut}
          >
            Выйти
          </Button>
        </div>
      </form>
    </section>
  )
}
