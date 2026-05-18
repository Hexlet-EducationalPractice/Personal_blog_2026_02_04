import { useCallback, useEffect, useState } from 'react'
import z, { ZodError } from 'zod'

import { getErrorMessage } from '@/lib/get-error-message'
import { uploadAvatar } from '@/features/profile'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

import styles from './AvatarUpload.module.css'
import { AVATAR_FILE_TYPES, GET_MAX_FILE_SIZE } from '@/lib/constants'

interface AvatarUploadProps {
  userId: string
  currentUrl: string | null
  onChange: (url: string) => void
}

const schema = z
  .file()
  .mime(AVATAR_FILE_TYPES, {
    message: 'Тип файла должен быть: jpeg/png/webp/gif',
  })
  .refine((file) => file.size <= GET_MAX_FILE_SIZE(2), {
    message: `Размер файла не должен превышать 2Мб`,
  })

export function AvatarUpload({ userId, currentUrl, onChange }: AvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState(currentUrl)

  const fetchAvatar = useCallback(async () => {
    if (!file) return
    setIsLoading(true)
    try {
      const publicUrl = await uploadAvatar(file, userId)
      onChange(publicUrl)
    } catch (err) {
      setUrl(currentUrl)
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [file])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAvatar()
  }, [file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (file) {
      try {
        schema.parse(file)
        setFile(file)
        const loaded_url = URL.createObjectURL(file)
        setUrl(loaded_url)
      } catch (err) {
        if (err instanceof ZodError) setError(getErrorMessage(err.issues[0]))
      }
    }
  }

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {url ? (
        <>
          {isLoading ? <Spinner /> : <img className={styles.avatarImage} src={url} alt="Аватар" />}
        </>
      ) : (
        <div className={styles.avatarPlaceholder}>Аватар</div>
      )}

      <label>
        <span className={styles.buttonText} aria-hidden="true">
          выбрать аватар
        </span>
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          id="upload"
          className={styles.input}
        />
      </label>
    </>
  )
}
