import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "./ConfirmModal";
import "../../styles/ClearButton.css";

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="clear-button" onClick={() => setIsModalOpen(true)}>
        {/* ✅ Ensure the icon has the "trash-icon" class */}
        <FontAwesomeIcon icon={faTrash} className="trash-icon" />
      </button>

      {/* ✅ Render the confirmation modal */}
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
