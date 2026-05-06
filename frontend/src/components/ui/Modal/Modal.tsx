import { createPortal } from "react-dom";
import type { ModalProps } from ".";
import { useEffect } from "react";
import styles from "./Modal.module.css";

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

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} onClick={handleOverlayClick}>
        <div className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`} onClick={(e) => e.stopPropagation()}>
            {title ? title : null}
            {children}
        </div>
    </div>,
    modalRoot,
  )
}

