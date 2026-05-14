import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import styles from './Modal.module.css'
import cancel from '@/assets/icons/cancel.svg'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const modalRoot = document.getElementById('modal-root')

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!modalRoot) throw new Error('Modal root not found')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  return createPortal(
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleCloseButtonClick}
          aria-label="Закрыть"
        >
          <img src={cancel} alt="Закрыть" />
        </button>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </div>,
    modalRoot,
  )
}
