import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { Header } from './Header/Header'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.layout}>
      <div className={styles.wrapper}>
        <Sidebar />
        <main className={styles.main}>
          <Header />
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
