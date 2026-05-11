import React, { useEffect, useState } from 'react';
import { getWorks } from '@/features/works/api';
import type { Work } from '@/features/works/types';
import WorkCard from '@/features/works/components/WorkCard/WorkCard';
import styles from './Works.module.css';

export const Works: React.FC = () => {
  const [works, setWorks] = useState<Work[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWorks()
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.spinner}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  if (works && works.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Мои работы</h1>
        <div className={styles.empty}>Пока нет работ</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Заголовок вынесен за пределы сетки карточек */}
      <h1 className={styles.pageTitle}>Мои работы</h1>

      <div className={styles.grid}>
        {works && works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </div>
  );
};