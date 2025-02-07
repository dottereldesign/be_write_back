// src/components/Board/PasteButton.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaste } from "@fortawesome/free-solid-svg-icons";
import "../../styles/PasteButton.css";

const PasteButton = ({ onPaste }: { onPaste: () => void }) => {
  return (
    <button className="paste-button" onClick={onPaste}>
      <FontAwesomeIcon icon={faPaste} className="paste-icon" />
      Paste
    </button>
  );
};

export default PasteButton;
