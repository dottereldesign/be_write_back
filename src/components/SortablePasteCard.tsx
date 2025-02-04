// src/components/SortablePasteCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faCopy } from "@fortawesome/free-solid-svg-icons";
import "../styles/SortablePasteCard.css"; // ✅ Import CSS

interface PastedItem {
  id: string;
  text: string;
  timestamp: string;
  displayName: string;
}

const SortablePasteCard = ({
  item,
  copyToClipboard,
}: {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
}) => {
  console.log("🟢 Rendering PasteCard:", item);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid PasteCard data", item);
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="paste-card">
      <span {...listeners} className="drag-handle">
        <FontAwesomeIcon icon={faGripVertical} />
      </span>
      <div className="timestamp">{item.timestamp}</div>
      <div
        className="copy-icon"
        onClick={() => copyToClipboard(item.text, item.displayName)}
      >
        <FontAwesomeIcon icon={faCopy} />
      </div>
      <div className="pasted-text">{item.displayName}</div>
    </div>
  );
};

export default SortablePasteCard;
