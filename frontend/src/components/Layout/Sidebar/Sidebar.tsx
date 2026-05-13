import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'

import styles from './Sidebar.module.css'

import InstagramIcon from '@/assets/icons/instagram.svg?react'
import VkIcon from '@/assets/icons/vk.svg?react'
import PinterestIcon from '@/assets/icons/pinterest.svg?react'

interface SidebarProps {
  variant?: 'static' | 'drawer'
}

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
          name={profile?.name || 'Дмитрий Валак'}
          size="xl"
        />
      </div>
      <h2 className={styles.name}>{profile?.name || 'Дмитрий Валак'}</h2>
      <p className={styles.role}>блог front-end разработчика</p>
      
      <div className={styles.socials}>
        <a 
          href="#" 
          className={styles.social}
          onClick={(e) => {
            e.preventDefault()
            handleSocialClick('Instagram')
          }}
          aria-label="Instagram"
        >
          <InstagramIcon className={styles.socialIcon} />
        </a>
        <a 
          href="#" 
          className={styles.social}
          onClick={(e) => {
            e.preventDefault()
            handleSocialClick('VK')
          }}
          aria-label="VK"
        >
          <VkIcon className={styles.socialIcon} />
        </a>
        <a 
          href="#" 
          className={styles.social}
          onClick={(e) => {
            e.preventDefault()
            handleSocialClick('Pinterest')
          }}
          aria-label="Pinterest"
        >
          <PinterestIcon className={styles.socialIcon} />
        </a>
      </div>
      
      <div className={styles.divider}></div>
      <p className={styles.bio}>
        Front-end разработчик. Практик верстки сайтов. Созданием сайтов занимаюсь с 2012 года. 
        Работал в нескольких ИТ компаниях и наработал более 10 000 часов в создании сайтов различной сложности.
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