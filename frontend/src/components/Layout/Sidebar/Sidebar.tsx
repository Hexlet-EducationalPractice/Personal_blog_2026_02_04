import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'
import { Spinner } from '@/components/ui/Spinner'
import { useBlogOwner } from '@/features/profile'
import styles from './Sidebar.module.css'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function Sidebar() {
  const { profile, isLoading, error } = useBlogOwner()
  const [isContactOpen, setIsContactOpen] = useState(false)

  if (isLoading) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.cover}></div>
        <div className={styles.avatarWrap}>
          <Avatar name="?" size="xl" />
        </div>
        <div className={styles.role}>
          <Spinner size="sm" />
        </div>
        <div className={styles.divider}></div>
        <p className={styles.bio}></p>
        <div className={styles.actions}>
          <Button variant="secondary" size="md" shape="pill" disabled>
            Мои работы
          </Button>
          <Button variant="primary" size="md" shape="pill" disabled>
            Написать мне
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover} />
      <div className={styles.avatarWrap}>
        <Avatar
          src={profile?.avatar_url || undefined}
          name={profile?.name || 'Пользователь'}
          size="xl"
        />
      </div>

      {error ? (
        <div className={styles.name}>
          <ErrorMessage>Failed to fetch</ErrorMessage>
        </div>
      ) : (
        <h2 className={styles.name}>{profile?.name || 'Пользователь'}</h2>
      )}

      <p className={styles.role}>Разработчик</p>

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
        Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов.
      </p>

      <div className={styles.actions}>
        <Link to="/works">
          <Button variant="secondary" size="md" shape="pill">
            Мои работы
          </Button>
        </Link>
        <Button variant="primary" size="md" shape="pill" onClick={() => setIsContactOpen(true)}>
          Написать мне
        </Button>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    </aside>
  )
}
