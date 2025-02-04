// src/components/ClearButton.tsx
import "../styles/ClearButton.css";

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  return (
    <button className="clear-button" onClick={onClear}>
      🗑 Clear All
    </button>
  );
};

export default ClearButton;
