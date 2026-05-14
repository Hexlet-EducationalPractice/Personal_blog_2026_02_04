import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'

import styles from './Sidebar.module.css'

import instagramIcon from '@/assets/icons/instagramsmall.svg'
import vkIcon from '@/assets/icons/vksmall.svg'
import pinterestIcon from '@/assets/icons/pinterestsmall.svg'

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
  {
    link: '#',
    icon: instagramIcon,
    alt: 'Instagram',
    name: 'Instagram',
  },
  {
    link: '#',
    icon: vkIcon,
    alt: 'VK',
    name: 'VK',
  },
  {
    link: '#',
    icon: pinterestIcon,
    alt: 'Pinterest',
    name: 'Pinterest',
  },
]

export function Sidebar({ variant = 'static' }: SidebarProps) {
  const { profile } = useAuth()
  const [isContactOpen, setIsContactOpen] = useState(false)

  const handleSocialClick = (social: string) => {
    console.log(`Открыть ${social} - заглушка`)
  }

  const sidebarClasses = [
    styles.sidebar,
    variant === 'drawer' ? styles.drawerSidebar : ''
  ].filter(Boolean).join(' ')

  return (
    <aside className={sidebarClasses}>
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
      <h2 className={styles.name}>{profile?.name || 'Пользователь'}</h2>
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
        Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов
      </p>
      <div className={styles.actions}>
        <Link to="/works">
          <Button variant="primary" size="md" shape="pill">
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