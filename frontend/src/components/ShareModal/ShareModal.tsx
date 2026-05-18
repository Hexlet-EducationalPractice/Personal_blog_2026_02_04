import { Modal } from '@/components/ui/Modal'
import facebook from '@/assets/icons/facebook.svg'
import twitter from '@/assets/icons/twitter.svg'
import vk from '@/assets/icons/vk.svg'
import copy from '@/assets/icons/copy.svg'
import styles from './ShareModal.module.css'
import { useState } from 'react'

const icons: ShareModalItem[] = [
  {
    link: '#',
    icon: facebook,
    alt: 'Facebook',
  },
  {
    link: '#',
    icon: twitter,
    alt: 'Twitter',
  },
  {
    link: '#',
    icon: vk,
    alt: 'VK',
  },
]

function CopyButton({ icon }: { icon: string; alt: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const isClipboardAvailable =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText)

  const handleCopy = async () => {
    if (!isClipboardAvailable) return

    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <>
      <button
        className={styles.copyButton}
        onClick={handleCopy}
        disabled={!isClipboardAvailable}
        aria-label="Скопировать ссылку"
      >
        <img src={icon} alt="" />
        <span className={`${styles.tooltip} ${isCopied ? styles.tooltipVisible : ''}`}>
          Скопировано
        </span>
      </button>
    </>
  )
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ShareModalItem {
  link: string
  icon: string
  alt: string
}

interface IconsProps {
  iconArray: ShareModalItem[]
}

function ShareIcons({ iconArray }: IconsProps) {
  return (
    <ul className={styles.shareIcons}>
      {iconArray.map((item) => (
        <li key={item.link}>
          <a
            onClick={(e) => e.preventDefault()}
            href={item.link}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.alt}
          >
            <img src={item.icon} alt="" />
          </a>
        </li>
      ))}
      <CopyButton icon={copy} alt="Скопировать ссылку" />
    </ul>
  )
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ShareIcons iconArray={icons} />
    </Modal>
  )
}
