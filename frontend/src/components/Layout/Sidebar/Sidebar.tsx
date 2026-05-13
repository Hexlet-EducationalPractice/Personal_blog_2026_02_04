import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/ContactModal'
import styles from './Sidebar.module.css'
import { useState } from 'react'

import InstagramIcon from '@/assets/icons/instagram.svg?react'
import VkIcon from '@/assets/icons/vk.svg?react'
import PinterestIcon from '@/assets/icons/pinterest.svg?react'

export function Sidebar() {
  const { profile } = useAuth()
  const [isContactOpen, setIsContactOpen] = useState(false)

  const handleSocialClick = (social: string) => {
    console.log(`Открыть ${social} - заглушка`)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover}>
        <img 
          src="/src/assets/images/sidebar-background.webp" 
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