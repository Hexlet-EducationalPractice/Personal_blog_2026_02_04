import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { profile } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover}>
        <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-dark)' }} />
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
        <a href="#" className={`${styles.social} ${styles.instagram}`}>
          IG
        </a>
        <a href="#" className={`${styles.social} ${styles.vk}`}>
          VK
        </a>
        <a href="#" className={`${styles.social} ${styles.pinterest}`}>
          P
        </a>
      </div>
      <div className={styles.divider}></div>
      <p className={styles.bio}>
        Занимаюсь разработкой веб-приложений и созданием пользовательских интерфейсов.
      </p>
      <div className={styles.actions}>
        <Link to="/works">
          <Button variant="primary" size="md" shape="pill">
            Мои работы
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="secondary" size="md" shape="pill">
            Написать мне
          </Button>
        </Link>
      </div>
    </aside>
  );
}
