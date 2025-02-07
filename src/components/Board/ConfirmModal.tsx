// src/components/Board/ConfirmModal.tsx
import "../../styles/ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p>Are you sure you want to delete all saved pastes?</p>
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
