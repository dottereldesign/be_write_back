// src/components/Board/ClearButton.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/ClearButton.css";

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  return (
    <button className="clear-button" onClick={onClear}>
      <FontAwesomeIcon icon={faTrash} /> Clear All
    </button>
  );
};

export default ClearButton;
