import { useEffect, useRef, useState } from 'react'
import { getWorks } from '@/features/works/api'
import type { Work } from '@/features/works/types'
import { WorkCard } from '@/features/works/components/WorkCard/WorkCard'
// import { useBlogOwner } from '@/features/profile'
import { getErrorMessage } from '@/lib/get-error-message'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import styles from './Works.module.css'

export function Works() {
  const [works, setWorks] = useState<Work[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(false)

  // const { profile: owner } = useBlogOwner()

  useEffect(() => {
    isMountedRef.current = true

    const load = async () => {
      try {
        const data = await getWorks()
        if (!isMountedRef.current) return
        setWorks(data)
      } catch (err) {
        if (!isMountedRef.current) return
        setError(getErrorMessage(err))
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.pageTitle}>
        {owner ? `Мои работы — ${owner.name}` : 'Мои работы'}
      </h1> */}

      {isLoading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {error && (
        <div className={styles.center}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {!isLoading && !error && works.length === 0 && (
        <div className={styles.center}>Пока нет работ</div>
      )}

      {!isLoading && !error && works.length > 0 && (
        <div className={styles.grid}>
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  )
}
