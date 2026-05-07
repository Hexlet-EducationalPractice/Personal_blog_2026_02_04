import { Link } from 'react-router-dom'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover}>
        <img src="/images/cover.jpg" alt="" />
      </div>
      <div className={styles.avatarWrap}>
        <img src="/images/default-avatar.jpg" alt="Дмитрий Валак" className={styles.avatar} />
      </div>
      <div className={styles.name}>Дмитрий Валак</div>
      <div className={styles.role}>блог front-end разработчика</div>
      
      <div className={styles.socials}>
        <a href="#" className={`${styles.social} ${styles.instagram}`}>Inst</a>
        <a href="#" className={`${styles.social} ${styles.vk}`}>VK</a>
        <a href="#" className={`${styles.social} ${styles.pinterest}`}>Pin</a>
      </div>

      <div className={styles.divider} />
      <p className={styles.bio}>
        Front-end разработчик. Практик верстки сайтов. Созданием сайтов занимаюсь с 2012 года.
      </p>
      <div className={styles.divider2} />
      <div className={styles.actions}>
        <Link to="/works" className={styles.btnRed}>Мои работы</Link>
        <button className={styles.btnBlue}>Написать мне</button>
      </div>
    </aside>
  )
}
