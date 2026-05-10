import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/features/auth/AuthContext'
import { getErrorMessage } from '@/lib/get-error-message'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

import styles from './ForgotPasswordForm.module.css'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
      await resetPassword(data.email)
      setSuccess(true)
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  if (success) {
    return <p className={styles.success}>На email отправлена ссылка</p>
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Input
        type="email"
        placeholder="Email"
        autoComplete="off"
        className={styles.input}
        error={errors.email?.message}
        {...register('email')}
      />

      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}

      <Button
        type="submit"
        loading={isSubmitting}
        className={styles.submit}
      >
        Отправить письмо
      </Button>
    </form>
  )
}