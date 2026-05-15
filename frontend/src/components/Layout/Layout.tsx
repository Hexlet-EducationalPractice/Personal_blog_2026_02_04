import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

import styles from './Layout.module.css'

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [isMenuOpen])

  return (
    <div className={styles.layout}>
      <div className={styles.wrapper}>
        <Sidebar variant="static" />
        <main className={styles.main}>
          <Header
            isMenuOpen={isMenuOpen}
            onMenuToggle={handleMenuToggle}
            onMenuClose={handleMenuClose}
          />
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>

      <div
        className={`${styles.drawerOverlay} ${isMenuOpen ? styles.drawerOverlayOpen : ''}`}
        onClick={handleMenuClose}
        aria-hidden={!isMenuOpen}
      />
      <aside
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <Sidebar variant="drawer" />
      </aside>
    </div>
  )
}
