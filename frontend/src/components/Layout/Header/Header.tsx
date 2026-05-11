import { NavLink } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import styles from './Header.module.css'

export function Header() {
  const { user, profile, isLoading } = useAuth()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.navLink}>
          Главная
        </NavLink>
        <NavLink to="/articles" className={styles.navLink}>
          Статьи
        </NavLink>
        <NavLink to="/about" className={styles.navLink}>
          Обо мне
        </NavLink>
      </nav>
      <div className={styles.rightSide}>
        {!isLoading && (
          <>
            {user && profile ? (
              <NavLink to="/profile" className={styles.profileLink}>
                <Avatar
                  src={profile.avatar_url || undefined}
                  name={profile.name || 'User'}
                  size="sm"
                />
              </NavLink>
            ) : (
              <NavLink to="/auth" className={styles.navLink}>
                Войти
              </NavLink>
            )}
          </>
        )}
        <div className={styles.searchWrap}>
          <Input type="text" placeholder="Поиск по блогу" className={styles.search} />
        </div>
      </div>
    </header>
  )
}
