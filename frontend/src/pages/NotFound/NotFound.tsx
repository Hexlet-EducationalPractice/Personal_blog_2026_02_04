import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import styles from './NotFound.module.css';

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.emoji}>🔍</div>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Возможно, страница была удалена или перемещена.
          <br />
          Проверьте адрес или вернитесь на главную.
        </p>
        <Link to="/" className={styles.buttonWrapper}>
          <Button variant="primary">
            ← Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
};
