import type { Story } from '@/features/stories'
import { formatDate } from '@/lib/format-date'
import styles from './StoryCard.module.css'

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  const videoSrc = `${story.media_url}#t=0.5`

  return (
    <div className={styles.card}>
      <video
        src={videoSrc}
        className={styles.video}
        preload="metadata"
        muted
        playsInline
        aria-label="Превью истории"
      />

      {story.created_at && (
        <div className={styles.overlayBottom}>
          <span className={styles.date}>
            {formatDate(story.created_at)}
          </span>
        </div>
      )}
    </div>
  )
}