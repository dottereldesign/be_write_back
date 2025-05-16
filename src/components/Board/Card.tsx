// src/components/Board/Card.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faStar as filledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { memo } from "react";
import "../../styles/Card.css";
import { PastedItem } from "../../types/PastedItem";

interface CardProps {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
  onToggleFavorite: (id: string) => void;
}

const Card = ({ item, copyToClipboard, onToggleFavorite }: CardProps) => {
  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid Card data", item);
    return null;
  }

  const handleCopy = (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    event.stopPropagation();
    copyToClipboard(item.text, item.displayName);
  };

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleFavorite(item.id);
  };

  return (
    <div
      className="paste-card"
      onClick={handleCopy}
      tabIndex={0}
      aria-label={`Copy '${item.displayName}' to clipboard`}
      role="button"
    >
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
