import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useBlogOwner } from '@/features/profile'

import instagramIcon from '@/assets/icons/instagramsmall.svg'
import vkIcon from '@/assets/icons/vksmall.svg'
import pinterestIcon from '@/assets/icons/pinterestsmall.svg'

import styles from './Sidebar.module.css'

interface SidebarProps {
  variant?: 'static' | 'drawer'
}

interface SocialIcon {
  link: string
  icon: string
  alt: string
  name: string
}

const socialIcons: SocialIcon[] = [
  { link: '#', icon: instagramIcon, alt: 'Instagram', name: 'Instagram' },
  { link: '#', icon: vkIcon, alt: 'VK', name: 'VK' },
  { link: '#', icon: pinterestIcon, alt: 'Pinterest', name: 'Pinterest' },
]

export function Sidebar({ variant = 'static' }: SidebarProps) {
  const { profile, isLoading, error } = useBlogOwner()
  const [isContactOpen, setIsContactOpen] = useState(false)

  const handleSocialClick = (social: string) => {
    console.log(`Открыть ${social} - заглушка`)
  }

  if (variant === 'drawer') {
    return (
      <aside className={`${styles.sidebar} ${styles.drawerSidebar}`}>
        <div className={styles.drawerCover} />

        <div className={styles.drawerProfile}>
          <Avatar
            src={profile?.avatar_url || undefined}
            name={profile?.name || 'Пользователь'}
            size="lg"
          />
          <div className={styles.drawerProfileText}>
            <h2 className={styles.drawerName}>{profile?.name || 'Пользователь'}</h2>
            <p className={styles.drawerSubtitle}>блог front-end разработчика</p>
          </div>
        </div>

        <div className={styles.drawerDivider} />

        <nav className={styles.drawerNav}>
          <Link to="/articles" className={styles.drawerNavLink}>
            Статьи
          </Link>
          <Link to="/about" className={styles.drawerNavLink}>
            Обо мне
          </Link>
          <Link to="/profile" className={styles.drawerNavLink}>
            Профиль
          </Link>
        </nav>

        <div className={styles.drawerActions}>
          <Link to="/works">
            <Button variant="secondary" size="md" shape="pill">
              Мои работы
            </Button>
          </Link>
          <Button variant="primary" size="md" shape="pill" onClick={() => setIsContactOpen(true)}>
            Написать мне
          </Button>
        </div>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.cover}></div>
        <div className={styles.avatarWrap}>
          <Avatar name="?" size="xl" />
        </div>

        <h2 className={`${styles.name} ${styles.placeholderText}`} aria-hidden="true">
          Пользователь
        </h2>

        <div className={`${styles.spinnerWrapper}`}>
          <Spinner size="sm" />
        </div>

        <div className={styles.socials} aria-hidden="true">
          {socialIcons.map((item) => (
            <span key={item.name} className={`${styles.social} ${styles.socialPlaceholder}`} />
          ))}
        </div>

        <div className={styles.divider}></div>

        <p className={`${styles.bio} ${styles.placeholderText}`} aria-hidden="true">
          Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов.
        </p>

        <div className={styles.divider}></div>

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
        <img
          src="/src/assets/images/sidebar-background.jpg"
          alt="sidebar background"
          className={styles.coverImage}
        />
      </div>
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
        {socialIcons.map((item) => (
          <a
            key={item.name}
            href={item.link}
            className={styles.social}
            onClick={(e) => {
              e.preventDefault()
              handleSocialClick(item.name)
            }}
            aria-label={item.alt}
          >
            <img src={item.icon} alt="" className={styles.socialIcon} />
          </a>
        ))}
      </div>

      <div className={styles.divider}></div>

      <p className={styles.bio}>
        Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов.
      </p>

      <div className={styles.divider}></div>

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
