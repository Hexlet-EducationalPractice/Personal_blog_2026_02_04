import { useEffect, useRef, useState } from 'react'
import type { Story } from '@/features/stories/types'
import styles from './StoryViewer.module.css'

interface Props {
  story: Story | null
  onClose: () => void
}

export function StoryViewer({ story, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    if (!story) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [story, onClose])

  useEffect(() => {
    if (!story || !videoRef.current) return

    const video = videoRef.current

    setProgress(0)
    setIsPlaying(false)

    video.currentTime = 0

    video
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
      })
  }, [story?.id])

  if (!story) return null

  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const { currentTime, duration } = videoRef.current
    const value = (currentTime / duration) * 100
    setProgress(isNaN(value) ? 0 : value)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    const newTime = videoRef.current.duration * percent

    videoRef.current.currentTime = newTime
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <video
          ref={videoRef}
          src={story.media_url}
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

        <div className={styles.controls}>
          <button className={styles.play} onClick={togglePlay}>
            {isPlaying ? '❚❚' : '▶'}
          </button>

          <div
            ref={progressRef}
            className={styles.progress}
            onClick={handleSeek}
          >
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}