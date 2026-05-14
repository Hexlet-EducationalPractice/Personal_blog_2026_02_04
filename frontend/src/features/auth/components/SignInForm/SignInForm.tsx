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

import styles from './SignInForm.module.css'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
})

type FormValues = z.infer<typeof schema>

export function SignInForm() {
  const { signIn } = useAuth()
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
      await signIn(data.email, data.password)
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
        autoComplete="username"
        className={styles.input}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        type="password"
        placeholder="Пароль"
        autoComplete="current-password"
        className={styles.input}
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <Button type="submit" loading={isSubmitting} className={styles.submit}>
        Войти
      </Button>
    </form>
  )
}
