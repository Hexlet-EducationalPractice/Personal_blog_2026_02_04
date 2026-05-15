import { useEffect, useRef, useState } from 'react'
import { getStories } from '@/features/stories/api'
import { StoryCard } from '../StoryCard'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Story } from '@/features/stories/types'
import styles from './StoriesList.module.css'

<<<<<<< HEAD
interface StoriesListProps {
  onStoryClick?: (story: Story) => void
}

export function StoriesList({ onStoryClick }: StoriesListProps) {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await getStories()
        setStories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setIsLoading(false)
=======
export function StoriesList() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const loadStories = async () => {
      try {
        const data = await getStories()
        if (!isMountedRef.current) return
        setStories(data)
      } catch (err) {
        if (!isMountedRef.current) return
        const message = err instanceof Error ? err.message : 'Ошибка загрузки сторис'
        setError(message)
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
>>>>>>> origin/dev
      }
    }

    loadStories()
<<<<<<< HEAD
  }, [])

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -160, behavior: 'smooth' })
  }

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 160, behavior: 'smooth' })
  }

=======

    return () => {
      isMountedRef.current = false
    }
  }, [])

>>>>>>> origin/dev
  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage>{error}</ErrorMessage>
  if (stories.length === 0) return null

  return (
<<<<<<< HEAD
    <div className={styles.wrapper}>
      <button className={styles.arrowLeft} onClick={scrollLeft}>
        ‹
      </button>

      <div ref={containerRef} className={styles.container}>
        {stories.map((story) => (
          <div
            key={story.id}
            className={styles.storyButton}
            onClick={() => onStoryClick?.(story)}
          >
            <StoryCard story={story} />
          </div>
        ))}
      </div>

      <button className={styles.arrowRight} onClick={scrollRight}>
        ›
      </button>
    </div>
  )
}
=======
    <div className={styles.container}>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  )
}
>>>>>>> origin/dev
