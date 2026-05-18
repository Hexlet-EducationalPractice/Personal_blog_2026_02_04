import { type MouseEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useAuth } from '@/features/auth/AuthContext'

import styles from './ContactModal.module.css'

const CONTACT_EMAIL = 'grazhdantsev@yandex.ru'
const CONTACT_PHONE = '+8-800-555-35-35'
const CONTACT_PHONE_HREF = '88005553535'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Введите имя'),
  email: z.string().trim().email('Введите корректный email'),
  message: z.string().trim().min(10, 'Минимум 10 символов'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const { user, profile } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const [copiedContact, setCopiedContact] = useState<'email' | 'phone' | null>(null)

  const isClipboardAvailable =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  useEffect(() => {
    if (!isOpen) return

    reset({
      name: profile?.name ?? '',
      email: user?.email ?? '',
      message: '',
    })
  }, [isOpen, profile?.name, reset, user?.email])

  const onSubmit = async () => {
    try {
      setSubmitError('')

      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('Спасибо, ваше сообщение отправлено!')

      reset({
        name: profile?.name ?? '',
        email: user?.email ?? '',
        message: '',
      })
      handleClose()
    } catch {
      setSubmitError('Не удалось отправить сообщение')
    }
  }

  const handleClose = () => {
    setSubmitError('')
    setCopiedContact(null)
    onClose()
  }

  const handleCopyContact = async (
    event: MouseEvent<HTMLAnchorElement>,
    value: string,
    contact: 'email' | 'phone',
  ) => {
    if (!isClipboardAvailable) return

    event.preventDefault()

    try {
      await navigator.clipboard.writeText(value)
      setCopiedContact(contact)
      setTimeout(() => setCopiedContact(null), 2000)
    } catch {
      setCopiedContact(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            placeholder="Ваше имя"
            aria-invalid={Boolean(errors.name)}
            error={errors.name?.message}
            className={styles.input}
            {...register('name')}
          />

          <Input
            placeholder="Ваш e-mail"
            type="email"
            aria-invalid={Boolean(errors.email)}
            error={errors.email?.message}
            className={styles.input}
            {...register('email')}
          />

          <Textarea
            placeholder="Текст сообщения"
            rows={1}
            aria-invalid={Boolean(errors.message)}
            error={errors.message?.message}
            className={styles.textarea}
            {...register('message')}
          />

          {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
          <Button
            type="submit"
            loading={isSubmitting}
            size="sm"
            shape="rounded"
            className={styles.submitButton}
          >
            Отправить
          </Button>
        </form>

        <div className={styles.contacts}>
          <span className={styles.contactItem}>
            e-mail:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={(event) => handleCopyContact(event, CONTACT_EMAIL, 'email')}
            >
              {CONTACT_EMAIL}
            </a>
            <span
              className={`${styles.tooltip} ${
                copiedContact === 'email' ? styles.tooltipVisible : ''
              }`}
            >
              Скопировано
            </span>
          </span>

          <span className={styles.contactItem}>
            тел:{' '}
            <a
              href={`tel:${CONTACT_PHONE_HREF}`}
              onClick={(event) => handleCopyContact(event, CONTACT_PHONE, 'phone')}
            >
              {CONTACT_PHONE}
            </a>
            <span
              className={`${styles.tooltip} ${
                copiedContact === 'phone' ? styles.tooltipVisible : ''
              }`}
            >
              Скопировано
            </span>
          </span>
        </div>
      </div>
    </Modal>
  )
}