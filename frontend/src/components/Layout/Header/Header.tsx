import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthContext'
import styles from './Header.module.css'

export function Header() {
  const [desktopSearch, setDesktopSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const handleDesktopSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && desktopSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(desktopSearch.trim())}`)
      setDesktopSearch('')
    }
  }

  const isActive = (path: string) => location.pathname === path ? styles.navLinkActive : ''

  return (
    <header className={styles.header}>
      <button className={styles.burger}>
        <div className={styles.burgerInner}><span /><span /><span /></div>
      </button>

      <nav className={styles.nav}>
        <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>Главная</Link>
        <Link to="/articles" className={`${styles.navLink} ${isActive('/articles')}`}>Статьи</Link>
        <Link to="/about" className={`${styles.navLink} ${isActive('/about')}`}>Обо мне</Link>
        <div style={{ flex: 1 }} />
        {user ? (
          <Link to="/profile" className={`${styles.navLinkProfile} ${isActive('/profile')}`}>Профиль</Link>
        ) : (
          <Link to="/auth" className={`${styles.navLinkProfile} ${isActive('/auth')}`}>Профиль</Link>
        )}
      </nav>

      <div className={styles.searchWrap}>
        <input 
          type="text" 
          className={styles.search} 
          placeholder="Поиск по блогу" 
          value={desktopSearch}
          onChange={e => setDesktopSearch(e.target.value)}
          onKeyDown={handleDesktopSearch}
        />
      </div>
    </header>
  )
}
