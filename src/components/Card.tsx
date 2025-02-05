// src/components/Card.tsx
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faCopy } from "@fortawesome/free-solid-svg-icons";
import "../styles/Card.css"; // ✅ Import CSS

interface PastedItem {
  id: string;
  text: string;
  timestamp: string;
  displayName: string;
}

const Card = ({
  item,
  copyToClipboard,
}: {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
}) => {
  console.log("🟢 Rendering Card:", item);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // ✅ Detects if the card is being dragged
  } = useSortable({
    id: item.id,
    animateLayoutChanges: defaultAnimateLayoutChanges, // ✅ Ensures smooth transition
  });

  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid Card data", item);
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // ✅ Fade effect while dragging
    zIndex: isDragging ? 1000 : "auto", // ✅ Bring the dragged item to front
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`paste-card ${isDragging ? "dragging" : ""}`} // ✅ Apply dragging class
    >
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

export default Card;
