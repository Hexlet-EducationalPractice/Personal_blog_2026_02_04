import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/AuthContext'
import { getErrorMessage } from '@/lib/get-error-message'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

import styles from './SignUpForm.module.css'

const schema = z
  .object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function SignUpForm() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await signUp(data.email, data.password)
      navigate(location.state?.from?.pathname ?? '/', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        type="email"
        placeholder="Email"
        autoComplete="email"
        className={styles.input}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        type="password"
        placeholder="Пароль"
        autoComplete="new-password"
        className={styles.input}
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        type="password"
        placeholder="Подтвердите пароль"
        autoComplete="new-password"
        className={styles.input}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <Button
        type="submit"
        loading={isSubmitting}
        className={styles.submit}
      >
        Зарегистрироваться
      </Button>
    </form>
  )
}