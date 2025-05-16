// src/components/Board/Board.tsx
import { useEffect, useState, useCallback } from "react";
import NameModal from "./NameModal";
import SortButtons from "./SortButtons";
import PasteButton from "./PasteButton";
import SearchBar from "./SearchBar";
import Card from "./Card";
import ClearButton from "./ClearButton";
import { useSorting } from "../../hooks/useSorting";
import { useClearPastes } from "../../hooks/useClearPastes";
import { useSavePaste } from "../../hooks/useSavePaste";
import { useClipboard } from "../../hooks/useClipboard";
import { useClipboardPaste } from "../../hooks/useClipboardPaste";
import { loadPastes, savePastes } from "../../utils/storage";
import { PastedItem } from "../../types/PastedItem";
import "../../styles/Board.css";

interface ClipboardBoardProps {
  triggerToast: (message: string) => void;
}

const ClipboardBoard = ({ triggerToast }: ClipboardBoardProps) => {
  const [pastedTexts, setItems] = useState<PastedItem[]>(() => {
    if (import.meta.env.MODE !== "production") {
      console.log("🔄 Loading pastes from localStorage...");
    }
    return loadPastes();
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const { sortedItems, handleSortChange, sortType, isAscending } =
    useSorting(pastedTexts);
  const { handleClearAll } = useClearPastes(setItems, setShowFavoritesOnly);
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setItems);
  const { copyToClipboard } = useClipboard();
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  // Only call if id is string (guaranteed by type)
  const toggleFavorite = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      savePastes(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    // Only one event listener, cleaned up properly.
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  useEffect(() => {
    savePastes(pastedTexts);
  }, [pastedTexts]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = sortedItems.filter(
    (item) =>
      item.displayName.toLowerCase().includes(normalizedQuery) &&
      (!showFavoritesOnly || item.isFavorite)
  );

  return (
    <div className="paste-container-wrapper">
      {showModal && (
        <NameModal
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="buttons-container">
        <div className="buttons-row">
          <PasteButton onPaste={triggerClipboardPaste} disabled={showModal} />
          <SortButtons
            onSortChange={handleSortChange}
            sortType={sortType}
            isAscending={isAscending}
          />
          <button
            className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly((prev) => !prev)}
            aria-pressed={showFavoritesOnly}
            aria-label={
              showFavoritesOnly
                ? "Show all pastes, including non-favorites"
                : "Show only favorites"
            }
            title={
              showFavoritesOnly
                ? "Show all pastes, including non-favorites"
                : "Show only starred favorites"
            }
            type="button"
          >
            {showFavoritesOnly ? "Show All" : "Show ⭐ Favorites"}
          </button>
          <ClearButton onClear={handleClearAll} />
        </div>
        <div className="search-row">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      <div className="paste-container glassmorphism">
        {filteredItems.length === 0 ? (
          <div className="empty-state" role="status" aria-live="polite">
            {searchQuery
              ? "No matching results found."
              : "No saved pastes yet. Try pasting something!"}
          </div>
        ) : (
          filteredItems.map((item) => {
            const truncatedName =
              item.displayName.length > 10
                ? `${item.displayName.substring(0, 10)}...`
                : item.displayName;

            return (
              <Card
                key={item.id}
                item={item}
                copyToClipboard={(text) => {
                  copyToClipboard(text, item.displayName);
                  triggerToast(`Copied ${truncatedName} to clipboard!`);
                }}
                onToggleFavorite={toggleFavorite}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClipboardBoard;
