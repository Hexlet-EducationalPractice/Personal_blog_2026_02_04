import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'
import { Spinner } from '@/components/ui/Spinner'
import { useBlogOwner } from '@/features/profile'
import styles from './Sidebar.module.css'
import { getErrorMessage } from '@/lib/get-error-message'

export function Sidebar() {
  const { profile, isLoading, error } = useBlogOwner()
  const [isContactOpen, setIsContactOpen] = useState(false)

  // ошибка
  if (error) {
    return (
      <aside className={`${styles.sidebar} ${styles.sidebarError}`}>
        <p className={styles.errorMessage}>{getErrorMessage(error)}</p>
      </aside>
    )
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover} />
      <div className={styles.avatarWrap}>
        <Avatar
          src={isLoading ? undefined : profile?.avatar_url || undefined}
          name={isLoading ? '?' : profile?.name || 'Пользователь'}
          size="xl"
        />
      </div>

      <h2 className={styles.name}>{isLoading ? 'Загрузка...' : profile?.name || 'Пользователь'}</h2>

      <div className={styles.role}>{isLoading ? <Spinner size="sm" /> : 'Разработчик'}</div>

      <div className={styles.socials}>
        {isLoading ? (
          <>
            <span className={styles.socialPlaceholder}>.</span>
            <span className={styles.socialPlaceholder}>.</span>
            <span className={styles.socialPlaceholder}>.</span>
          </>
        ) : (
          <>
            <a href="#" className={`${styles.social} ${styles.instagram}`}>
              IG
            </a>
            <a href="#" className={`${styles.social} ${styles.vk}`}>
              VK
            </a>
            <a href="#" className={`${styles.social} ${styles.pinterest}`}>
              P
            </a>
          </>
        )}
      </div>

      <div className={styles.divider}></div>

      <p className={styles.bio}>
        {isLoading
          ? '...'
          : 'Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов.'}
      </p>

      <div className={styles.actions}>
        <Link to={isLoading ? '#' : '/works'} className={isLoading ? styles.disabledLink : ''}>
          <Button variant="secondary" size="md" shape="pill" disabled={isLoading}>
            Мои работы
          </Button>
        </Link>

        <Button
          variant="primary"
          size="md"
          shape="pill"
          disabled={isLoading}
          onClick={() => setIsContactOpen(true)}
        >
          Написать мне
        </Button>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    </aside>
  )
}
