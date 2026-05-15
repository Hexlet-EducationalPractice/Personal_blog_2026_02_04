import { useEffect, useRef, useState } from 'react'
import { getStories } from '@/features/stories/api'
import { StoryCard } from '../StoryCard'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Story } from '@/features/stories/types'
import styles from './StoriesList.module.css'

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
      }
    }

    loadStories()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage>{error}</ErrorMessage>
  if (stories.length === 0) return null

  return (
    <div className={styles.container}>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  )
}
