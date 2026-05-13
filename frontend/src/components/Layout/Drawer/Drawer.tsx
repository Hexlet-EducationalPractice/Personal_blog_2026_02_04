import { Sidebar } from '../Sidebar'
import { Modal } from '@/components/ui/Modal'

import styles from './Drawer.module.css'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlay}
      contentClassName={styles.content}
    >
      <Sidebar variant="drawer" />
    </Modal>
  )
}
