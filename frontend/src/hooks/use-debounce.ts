import { useState, useEffect } from 'react'

/**
 * Хук для отложенного обновления значения (debounce).
 * @param value Значение, которое нужно дебаунсить.
 * @param delay Задержка в мс.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounced
}
