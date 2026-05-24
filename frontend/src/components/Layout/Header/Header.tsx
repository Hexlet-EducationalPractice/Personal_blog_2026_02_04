import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/use-debounce'
import { DEBOUNCE_MS, MIN_SEARCH_LENGTH, ROUTES } from '@/lib/constants'

import styles from './Header.module.css'

interface HeaderProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

export function Header({ isMenuOpen, onMenuToggle, onMenuClose }: HeaderProps) {
  const { user, profile, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isOnSearchPage = location.pathname === ROUTES.search
  const urlQuery = isOnSearchPage ? (searchParams.get('q') ?? '') : ''

  const [searchValue, setSearchValue] = useState(urlQuery)
  const debouncedValue = useDebounce(searchValue, DEBOUNCE_MS)

  const userInteractedRef = useRef(false)
  const lastPathRef = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname
      userInteractedRef.current = false
      setSearchValue(isOnSearchPage ? (searchParams.get('q') ?? '') : '')
      onMenuClose()
    }
  }, [location.pathname, isOnSearchPage, onMenuClose, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userInteractedRef.current = true
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    if (!userInteractedRef.current) return

    const trimmed = debouncedValue.trim()

    if (trimmed.length === 0) {
      if (isOnSearchPage) {
        navigate(ROUTES.home, { replace: true })
      }
      return
    }

    if (trimmed.length < MIN_SEARCH_LENGTH) return

    const currentQ = searchParams.get('q') ?? ''
    if (isOnSearchPage && currentQ === trimmed) return

    navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`, {
      replace: isOnSearchPage,
    })
  }, [debouncedValue, isOnSearchPage, navigate, searchParams])

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.burger}
        onClick={onMenuToggle}
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isMenuOpen}
      >
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </button>
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
          <Input
            type="text"
            placeholder="Поиск по блогу"
            className={styles.search}
            value={searchValue}
            onChange={handleChange}
          />
        </div>
      </div>
    </header>
  )
}
