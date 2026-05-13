import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'

import styles from './Sidebar.module.css'

interface SidebarProps {
  variant?: 'static' | 'drawer'
}

export function Sidebar({ variant = 'static' }: SidebarProps) {
  const { profile } = useAuth()
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <aside
      className={`${styles.sidebar} ${variant === 'drawer' ? styles.drawerSidebar : ''}`}
    >
      <div className={styles.cover}>
        <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-dark)' }} />
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
