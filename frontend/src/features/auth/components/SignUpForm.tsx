import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage/ErrorMessage'
import { Input } from '@/components/ui/Input/Input'
import { useAuth } from '@/features/auth/AuthContext'
import { getErrorMessage } from '@/lib/get-error-message'

const schema = z
  .object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function SignUpForm() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await signUp(data.email, data.password)
      navigate('/')
    } catch (e) {
      setServerError(getErrorMessage(e))
    }
  }

  return (
    <>
      {serverError ? <ErrorMessage>{serverError}</ErrorMessage> : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <Input label='Email' type='email' autoComplete='email' {...register('email')} error={errors.email?.message} />

        <Input
          label='Пароль'
          type='password'
          autoComplete='new-password'
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label='Подтверждение пароля'
          type='password'
          autoComplete='new-password'
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type='submit' loading={isSubmitting}>
          Зарегистрироваться
        </Button>
      </form>
    </>
  )
}
