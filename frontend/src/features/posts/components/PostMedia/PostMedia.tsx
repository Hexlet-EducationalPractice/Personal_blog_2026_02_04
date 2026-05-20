import { isVideoUrl } from '@/lib/is-video-url'

import playBtn from '@/assets/icons/play.svg'
import styles from './PostMedia.module.css'

type PostMediaProps = {
  url: string
  title: string
  type: 'preview' | 'full'
}

export function PostMedia({ url, title, type }: PostMediaProps) {
  const isPreview = type === 'preview'
  const isVideo = isVideoUrl(url)
  return (
    <div className={isPreview ? styles.preview : ''}>
      {isVideo ? (
        <div className={styles.videoBox}>
          {isPreview && <img src={playBtn} alt="Воспроизвести видео" className={styles.playBtn} />}
          <video
            preload={isPreview ? 'metadata' : 'auto'}
            playsInline
            autoPlay={false}
            controls={!isPreview}
            className={styles.video}
            src={url}
            controlsList="nodownload"
          />
        </div>
      ) : (
        <img className={styles.image} src={url} alt={title} />
      )}
    </div>
  )
}
