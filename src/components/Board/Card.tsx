// src/components/Board/Card.tsx
import { memo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faStar as filledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import "../../styles/Card.css";
import { PastedItem } from "../../types/PastedItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
  onToggleFavorite: (id: string) => void;
  id: string;
  isDraggable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Card = ({
  item,
  copyToClipboard,
  onToggleFavorite,
  id,
  isDraggable = false,
  className = "",
  style = {},
}: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable });

  const [shaking, setShaking] = useState(false);
  const shakeTimeoutRef = useRef<number | null>(null);

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
    copyToClipboard(item.text, item.displayName);
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleFavorite(item.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCopy(event);
    }
  };

  const startShaking = () => {
    setShaking(true);
    shakeTimeoutRef.current = window.setTimeout(() => setShaking(false), 2000);
  };
  const stopShaking = () => {
    setShaking(false);
    if (shakeTimeoutRef.current !== null) {
      window.clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = null;
    }
  };

  const shouldShake = isDragging || shaking;

  return (
    <div
      className={`paste-card-vertical${isDragging ? " dragging" : ""}${
        shouldShake ? " shake" : ""
      } ${className}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 10 : "auto",
        background: isDragging ? "#23262d" : undefined,
        boxShadow: isDragging ? "0 4px 16px 0 rgba(30,50,110,0.12)" : undefined,
        ...style,
      }}
      tabIndex={0}
      aria-label={`Copy '${item.displayName}' to clipboard`}
      role="button"
      onKeyDown={handleKeyDown}
      data-testid="card"
    >
      <div className="card-header-grid">
        {/* Drag handle, spans 2 rows */}
        <div
          className={`braille-drag-handle${!isDraggable ? " disabled" : ""}`}
          {...(isDraggable ? attributes : {})}
          {...(isDraggable ? listeners : {})}
          tabIndex={-1}
          aria-label={
            isDraggable ? "Drag to reorder" : "Reordering disabled in this view"
          }
          title={isDraggable ? "Drag to reorder" : "Custom order disabled"}
          onMouseDown={startShaking}
          onTouchStart={startShaking}
          onMouseUp={stopShaking}
          onMouseLeave={stopShaking}
          onTouchEnd={stopShaking}
          onTouchCancel={stopShaking}
        >
          <span className="braille-dots">
            {[0, 1, 2].map((row) => (
              <span key={row} className="braille-row">
                {[0, 1].map((col) => (
                  <span key={col} className="dot"></span>
                ))}
              </span>
            ))}
          </span>
        </div>
        {/* Title */}
        <span className="card-title">{item.displayName}</span>
        {/* Star, spans 2 rows */}
        <button
          className={`star-icon${item.isFavorite ? " mario-star active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={
            item.isFavorite
              ? `Remove '${item.displayName}' from favorites`
              : `Mark '${item.displayName}' as favorite`
          }
          title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          type="button"
          tabIndex={0}
          style={{
            minWidth: 44,
            minHeight: 44,
            // Give extra hit area for touch!
            padding: "10px",
            margin: "-10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={item.isFavorite ? filledStar : emptyStar} />
          <span className="sr-only">
            {item.isFavorite
              ? `Remove ${item.displayName} from favorites`
              : `Add ${item.displayName} to favorites`}
          </span>
        </button>
        {/* Timestamp */}
        <div className="timestamp">{item.timestamp}</div>
      </div>
      {/* Copy button */}
      <button
        className="big-copy-button"
        onClick={handleCopy}
        aria-label={`Copy '${item.displayName}'`}
        title="Copy to clipboard"
        type="button"
      >
        <FontAwesomeIcon icon={faCopy} className="copy-icon" />
        <span>Copy</span>
      </button>
    </div>
  );
};

export default memo(Card);
