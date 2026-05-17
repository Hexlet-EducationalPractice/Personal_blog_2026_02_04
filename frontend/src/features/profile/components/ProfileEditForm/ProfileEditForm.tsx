import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/get-error-message'
import { supabase } from '@/lib/supabase'
import { AvatarUpload } from '../AvatarUpload/AvatarUpload'

import styles from './ProfileEditForm.module.css'
import { deleteAvatar } from '@/features/profile'

const schema = z
  .object({
    name: z.string().trim().min(2, 'Имя должно быть минимум 2 символа'),
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
  const [avatarUrl, setAvatarUrl] = useState('')
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
      new_password: '',
      confirm_password: '',
    },
  })

  useEffect(() => {
    if (!profile || isDirty) return

    reset({
      name: profile.name ?? '',
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
        data.name !== (profile?.name ?? '') || avatarUrl !== (profile?.avatar_url ?? '')

      if (profileChanged) {
        if (profile?.avatar_url)
          deleteAvatar(profile.avatar_url).catch((err) => {
            setServerError(getErrorMessage(err))
          })
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            avatar_url: avatarUrl || null,
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
        <h1 className={styles.title}>Профиль</h1>
      </div>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            placeholder="Имя"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            error={errors.name?.message}
            className={styles.input}
            {...register('name')}
          />

          <Input
            value={user.email ?? ''}
            readOnly
            className={`${styles.input} ${styles.readOnlyInput}`}
          />

          <Input
            placeholder="Новый пароль"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.new_password)}
            error={errors.new_password?.message}
            className={styles.input}
            {...register('new_password')}
          />

          <Input
            placeholder="Подтвердите пароль"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm_password)}
            error={errors.confirm_password?.message}
            className={styles.input}
            {...register('confirm_password')}
          />

          {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
          {success && <p className={styles.success}>Профиль сохранён</p>}

          <div className={styles.actions}>
            <Button
              type="submit"
              loading={isSubmitting}
              size="sm"
              shape="rounded"
              className={styles.profileButton}
            >
              Сохранить
            </Button>
          </div>
        </form>

        <div className={styles.avatarBlock}>
          {profile && (
            <AvatarUpload
              userId={profile.id}
              onChange={(url) => {
                setAvatarUrl(url)
              }}
              currentUrl={profile.avatar_url}
            />
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            shape="rounded"
            onClick={handleSignOut}
            className={styles.profileButton}
          >
            Выйти
          </Button>
        </div>
      </div>
    </section>
  )
}
