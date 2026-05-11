import type { Work } from '@/features/works/types'
import { Button } from '@/components/ui/Button'
import styles from './WorkCard.module.css'

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={work.image_url} alt={work.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.description}>{work.description}</p>

        <div className={styles.tags}>
          {work.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.buttonContainer}
        >
          <Button variant="primary" size="sm" shape="rounded">
            Перейти на сайт
          </Button>
        </a>
      </div>
    </div>
  )
}