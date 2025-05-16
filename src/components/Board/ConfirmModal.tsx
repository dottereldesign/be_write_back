// src/components/Board/ConfirmModal.tsx
import { useEffect, useRef, memo } from "react";
import "../../styles/ConfirmModal.css";
import { useModalKeyboardShortcuts } from "../../hooks/useModalKeyboardShortcuts";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalKeyboardShortcuts({ isOpen, onConfirm, onCancel });

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="confirm-modal" ref={modalRef}>
        <p id="confirm-title">
          Are you sure you want to delete all saved pastes?
        </p>
        <div className="modal-buttons">
          <button
            className="confirm-btn"
            onClick={onConfirm}
            aria-label="Confirm delete all pastes"
            type="button"
          >
            Yes, Clear All
          </button>
          <button
            className="cancel-btn"
            onClick={onCancel}
            aria-label="Cancel delete"
            type="button"
          >
            No, Keep Them
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmModal);
