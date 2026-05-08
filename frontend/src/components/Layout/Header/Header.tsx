import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.navLink}>Главная</NavLink>
        <NavLink to="/articles" className={styles.navLink}>Статьи</NavLink>
        <NavLink to="/about" className={styles.navLink}>Обо мне</NavLink>
      </nav>
      <div className={styles.rightSide}>
        <NavLink to="/profile" className={styles.navLink}>Профиль</NavLink>
        <div className={styles.searchWrap}>
          <input type="text" className={styles.search} placeholder="Поиск по блогу" />
        </div>
      </div>
    </header>
  );
}
