// src/components/Board/Card.tsx
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faGripLines,
  faStar as filledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import "../../styles/Card.css";
import { PastedItem } from "../../types/PastedItem";

// DnD-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
  onToggleFavorite: (id: string) => void;
  id: string;
  isDraggable?: boolean;
}

const Card = ({
  item,
  copyToClipboard,
  onToggleFavorite,
  id,
  isDraggable = false,
}: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid Card data", item);
    return null;
  }

  const handleCopy = (
    event?:
      | React.MouseEvent<HTMLDivElement | HTMLButtonElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event) event.stopPropagation();
    console.log("[Card] Copy", item.displayName, item.text);
    copyToClipboard(item.text, item.displayName);
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("[Card] Toggle favorite", item.displayName, item.id);
    onToggleFavorite(item.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCopy(event);
    }
  };

  console.log("[Card] Render", item.displayName, id);

  return (
    <div
      className={`paste-card${isDragging ? " dragging" : ""}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 10 : "auto",
        background: isDragging ? "#f8fafd" : undefined,
        boxShadow: isDragging ? "0 4px 16px 0 rgba(30,50,110,0.12)" : undefined,
      }}
      onClick={handleCopy}
      tabIndex={0}
      aria-label={`Copy '${item.displayName}' to clipboard`}
      role="button"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`card-drag-handle${!isDraggable ? " disabled" : ""}`}
        {...(isDraggable ? attributes : {})}
        {...(isDraggable ? listeners : {})}
        tabIndex={-1}
        aria-label={
          isDraggable ? "Drag to reorder" : "Reordering disabled in this view"
        }
        title={isDraggable ? "Drag to reorder" : "Custom order disabled"}
        style={{
          opacity: isDraggable ? 1 : 0.4,
          cursor: isDraggable ? "grab" : "not-allowed",
        }}
      >
        <FontAwesomeIcon icon={faGripLines} />
      </div>
      <div className="timestamp" aria-label={`Pasted at ${item.timestamp}`}>
        {item.timestamp}
      </div>
      <div className="card-top-icons">
        <button
          className="copy-icon"
          onClick={handleCopy}
          aria-label={`Copy '${item.displayName}'`}
          title="Copy to clipboard"
          type="button"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <button
          className="star-icon"
          onClick={handleFavoriteClick}
          aria-label={
            item.isFavorite
              ? `Remove '${item.displayName}' from favorites`
              : `Mark '${item.displayName}' as favorite`
          }
          title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          type="button"
        >
          <FontAwesomeIcon icon={item.isFavorite ? filledStar : emptyStar} />
        </button>
      </div>
      <div
        className="pasted-text"
        aria-label={`Saved text: ${item.displayName}`}
      >
        {item.displayName}
      </div>
    </div>
  );
};

export default memo(Card);
