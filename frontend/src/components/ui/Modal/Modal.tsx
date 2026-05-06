import { createPortal } from "react-dom";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) throw new Error("Modal root not found");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

   useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} onClick={handleOverlayClick}>
        <div className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`} onClick={(e) => e.stopPropagation()}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {children}
        </div>
    </div>,
    modalRoot,
  )
}

