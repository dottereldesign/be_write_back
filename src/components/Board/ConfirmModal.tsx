// src/components/Board/ConfirmModal.tsx
import { useEffect } from "react";
import "../../styles/ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") onConfirm();
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <p id="confirm-title">
          Are you sure you want to delete all saved pastes?
        </p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes, Clear All
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            No, Keep Them
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
