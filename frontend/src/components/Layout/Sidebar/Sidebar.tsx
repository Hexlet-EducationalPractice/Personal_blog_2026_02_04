import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'
import { Spinner } from '@/components/ui/Spinner'
import { useBlogOwner } from '@/features/profile'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { profile, isLoading } = useBlogOwner()
  const [isContactOpen, setIsContactOpen] = useState(false)

  if (isLoading) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.cover}>
          <div className={styles.coverPlaceholder} />
        </div>
        <div className={styles.avatarWrap}>
          <Avatar name="?" size="xl" />
        </div>
        <h2 className={styles.name}></h2>
        <div className={styles.role}>
          <Spinner size="sm" />
        </div>
        <div className={styles.socials}>
          <span className={styles.social}></span>
          <span className={styles.social}></span>
          <span className={styles.social}></span>
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
      <div className={styles.cover}>
        <div className={styles.coverBackground} />
      </div>
      <div className={styles.avatarWrap}>
        <Avatar
          src={profile?.avatar_url || undefined}
          name={profile?.name || 'Пользователь'}
          size="xl"
        />
      </div>

      <h2 className={styles.name}>{profile?.name || 'Пользователь'}</h2>
      <p className={styles.role}>Разработчик</p>

      <div className={styles.socials}>
        <a href="#" className={`${styles.social} ${styles.instagram}`}>
          IG
        </a>
        <a href="#" className={`${styles.social} ${styles.vk}`}>
          VK
        </a>
        <a href="#" className={`${styles.social} ${styles.pinterest}`}>
          P
        </a>
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
