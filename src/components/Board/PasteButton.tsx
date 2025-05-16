// src/components/Board/PasteButton.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaste } from "@fortawesome/free-solid-svg-icons";
import "../../styles/PasteButton.css";

interface PasteButtonProps {
  onPaste: () => void;
  disabled?: boolean;
}
const PasteButton = ({ onPaste, disabled = false }: PasteButtonProps) => {
  return (
    <button
      className="paste-button"
      onClick={onPaste}
      disabled={disabled}
      aria-label="Paste clipboard contents"
      title="Paste clipboard"
      type="button"
    >
      <FontAwesomeIcon icon={faPaste} className="paste-icon" />
      Paste
    </button>
  );
};

export default PasteButton;
