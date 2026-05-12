import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

import styles from './ContactModal.module.css'

const contactSchema = z.object({
  name: z.string().min(1, 'Введите имя'),
  email: z.string().email('Введите корректный email'),
  message: z.string().min(10, 'Минимум 10 символов'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError('')
      setIsSubmitting(true)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log({ data })

      alert('Спасибо, ваше сообщение отправлено!')

      reset()
      onClose()
    } catch {
      setSubmitError('Не удалось отправить сообщение')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h2 className={styles.title}>Написать мне</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <Input placeholder="Ваше имя" {...register('name')} />

            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className={styles.field}>
            <Input placeholder="Email" {...register('email')} />

            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </div>

          <div className={styles.field}>
            <Textarea placeholder="Сообщение" rows={5} {...register('message')} />

            {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
          </div>

          {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
