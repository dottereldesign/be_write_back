// src/components/Board/ClearButton.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";
import "../../styles/ClearButton.css";

// Added aria-label, and visually hidden text for screen readers.
const ClearButton = ({ onClear }: { onClear: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="clear-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Clear all pastes"
        type="button"
      >
        <FontAwesomeIcon icon={faTrash} className="trash-icon" />
        {/* Visually hidden for screen readers */}
        <span className="sr-only">Clear all pastes</span>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => {
          setIsModalOpen(false);
          onClear();
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ClearButton;
