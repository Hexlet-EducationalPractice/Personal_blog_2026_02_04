import { useEffect, type RefObject } from 'react'

/**
 * Хук для обработки клика вне элемента.
 * @param ref Реф элемента, клик вне которого нужно отловить.
 * @param handler Функция-обработчик.
 */
export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current

      // Если элемент не найден или клик был внутри него — ничего не делаем
      if (!el || el.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
