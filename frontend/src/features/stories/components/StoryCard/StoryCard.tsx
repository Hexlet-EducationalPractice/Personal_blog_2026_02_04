import type { Story } from '@/features/stories'
import { formatDate } from '@/lib/format-date'
import { truncate } from '@/lib/truncate'
import styles from './StoryCard.module.css'

interface StoryCardProps {
  story: Story
}

function withPreviewFrame(url: string): string {
  if (url.includes('#')) return url
  return `${url}#t=0.5`
}

export function StoryCard({ story }: StoryCardProps) {
  const videoSrc = withPreviewFrame(story.media_url)

  return (
    <div className={styles.card}>
      <video
        src={videoSrc}
        className={styles.video}
        preload="metadata"
        muted
        playsInline
      />

      {story.title && (
        <div className={styles.overlayTop}>
          <span className={styles.title}>{truncate(story.title, 25)}</span>
        </div>
      )}

      {story.created_at && (
        <div className={styles.overlayBottom}>
          <span className={styles.date}>{formatDate(story.created_at)}</span>
        </div>
      )}
    </div>
  )
}
