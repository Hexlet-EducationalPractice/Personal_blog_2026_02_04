import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔍</div>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Страница не найдена</p>
        <p className={styles.description}>
          Возможно, страница была удалена или перемещена.
        </p>
        <p className={styles.description}>
          Проверьте адрес или вернитесь на главную.
        </p>
        <Link to="/" className={styles.linkWrapper}>
          <Button variant="primary" className={styles.customButton}>
            ← Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
};