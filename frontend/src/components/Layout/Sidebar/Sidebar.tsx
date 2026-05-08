import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover}><img src="/images/cover.jpg" alt="" /></div>
      <div className={styles.avatarWrap}>
        <img src="/images/default-avatar.jpg" alt="" className={styles.avatar} />
      </div>
      <div className={styles.name}>Дмитрий Валак</div>
      <div className={styles.role}>блог front-end разработчика</div>
      
      <div className={styles.socials}>
        <a href="#" className={`${styles.social} ${styles.instagram}`}>In</a>
        <a href="#" className={`${styles.social} ${styles.vk}`}>Vk</a>
        <a href="#" className={`${styles.social} ${styles.pinterest}`}>Pi</a>
      </div>

      <div className={styles.divider} />
      <p className={styles.bio}>
        Front-end разработчик. Практик верстки сайтов. Созданием сайтов занимаюсь с 2012 года.
      </p>
      <div className={styles.divider} />

      <div className={styles.actions}>
        <button className={styles.btnRed}>Мои работы</button>
        <button className={styles.btnBlue}>Написать мне</button>
      </div>
    </aside>
  );
}
