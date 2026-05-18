import { useEffect, useRef, useState } from 'react'
import type { Story } from '@/features/stories/types'
import styles from './StoryViewer.module.css'
import { Modal } from '@/components/ui/Modal'

interface Props {
  story: Story | null
  onClose: () => void
  isOpen: boolean
}

export function StoryViewer({ story, onClose, isOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    if (!story?.media_url || !videoRef.current) return

    const video = videoRef.current

    setProgress(0)
    setIsPlaying(false)

    video.currentTime = 0

    video
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {})
  }, [story?.media_url])

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
      setProgress(0)
    }
  }, [isOpen])

  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const { currentTime, duration } = videoRef.current
    if (!duration || isNaN(duration)) return
    const value = (currentTime / duration) * 100
    setProgress(value)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const rawPercent = clickX / rect.width
    const percent = Math.min(1, Math.max(rawPercent, 0), 1)
    const newTime = videoRef.current.duration * percent
    videoRef.current.currentTime = newTime
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} type="video">
      <div className={`${styles.viewer} ${isOpen ? styles.viewerOpen : ''}`}>
        {story?.media_url && (
          <video
            ref={videoRef}
            src={story?.media_url}
            muted
            className={styles.image}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
          />
        )}
        <div className={styles.controls}>
          <button className={styles.play} onClick={togglePlay}>
            {isPlaying ? '❚❚' : '▶'}
          </button>

          <div ref={progressRef} className={styles.progress} onClick={handleSeek}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
