import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import styles from './Layout.module.css'
import {Modal} from "@/components/ui/Modal";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.wrapper}>
        <Sidebar />
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
      <Modal
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        overlayClassName={styles.overlay}
        contentClassName={styles.content}
      >
        <Sidebar variant="drawer" />
      </Modal>
    </div>
  )
}
