import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/Button/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage/ErrorMessage'
import { Input } from '@/components/ui/Input/Input'
import { useAuth } from '@/features/auth/AuthContext'
import { getErrorMessage } from '@/lib/get-error-message'

const schema = z.object({
  email: z.string().email('Некорректный email'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await resetPassword(data.email)
      setIsSubmitted(true)
    } catch (e) {
      setServerError(getErrorMessage(e))
    }
  }

  if (isSubmitted) {
    return (
      <p role='status' style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
        Письмо отправлено. На указанный email отправлена инструкция по восстановлению. Если письма нет — проверьте
        папку Спам.
      </p>
    )
  }

  return (
    <>
      {serverError ? <ErrorMessage>{serverError}</ErrorMessage> : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <Input label='Email' type='email' autoComplete='email' {...register('email')} error={errors.email?.message} />

        <Button type='submit' loading={isSubmitting}>
          Отправить
        </Button>
      </form>
    </>
  )
}
