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

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type FormValues = z.infer<typeof schema>

export function SignInForm() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await signIn(data.email, data.password)
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
          autoComplete='current-password'
          {...register('password')}
          error={errors.password?.message}
        />

        <Button type='submit' loading={isSubmitting}>
          Войти
        </Button>
      </form>
    </>
  )
}
