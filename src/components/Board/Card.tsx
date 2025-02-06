// src/components/Board/Card.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Card.css";
import { PastedItem } from "../../types/PastedItem"; // ✅ Import the type

const Card = ({
  item,
  copyToClipboard,
}: {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
}) => {
  console.log("🟢 Rendering Card:", item);

  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid Card data", item);
    return null;
  }

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation(); // ✅ Prevent unnecessary bubbling
    copyToClipboard(item.text, item.displayName);
  };

  return (
    <div className="paste-card" onClick={handleCopy}>
      <div className="timestamp">{item.timestamp}</div>
      <div className="copy-icon">
        <FontAwesomeIcon icon={faCopy} />
      </div>
      <div className="pasted-text">{item.displayName}</div>
    </div>
  );
};

export default Card;
