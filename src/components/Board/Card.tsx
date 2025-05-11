// src/components/Board/Card.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faStar as filledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { memo } from "react"; // ⚡️ Only memo now
import "../../styles/Card.css";
import { PastedItem } from "../../types/PastedItem";

interface CardProps {
  item: PastedItem;
  copyToClipboard: (text: string, displayName: string) => void;
  onToggleFavorite: (id: string | number) => void; // 🔥 New
}

const Card = ({ item, copyToClipboard, onToggleFavorite }: CardProps) => {
  if (!item || !item.id || !item.text) {
    console.error("❌ Error: Invalid Card data", item);
    return null;
  }

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    copyToClipboard(item.text, item.displayName);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleFavorite(item.id);
  };

  return (
    <div className="paste-card" onClick={handleCopy}>
      <div className="timestamp">{item.timestamp}</div>

      <div className="card-top-icons">
        <button
          className="copy-icon"
          onClick={handleCopy}
          aria-label="Copy text"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>

        <button
          className="star-icon"
          onClick={handleFavoriteClick}
          aria-label={item.isFavorite ? "Unfavorite" : "Favorite"}
        >
          <FontAwesomeIcon icon={item.isFavorite ? filledStar : emptyStar} />
        </button>
      </div>

      <div className="pasted-text">{item.displayName}</div>
    </div>
  );
};

export default memo(Card);
