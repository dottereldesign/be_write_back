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
import { PastedItem } from "../../types/PastedItem";
import "../../styles/Board.css";

const LOCAL_STORAGE_KEY = "bewriteback_pastedTexts";

interface ClipboardBoardProps {
  triggerToast: (message: string) => void;
}

// 🔥 Safe localStorage parser
const safeParse = (value: string | null): PastedItem[] => {
  if (!value) return [];
  try {
    return JSON.parse(value) as PastedItem[];
  } catch {
    if (import.meta.env.MODE !== "production") {
      console.log("❌ Failed to parse stored pastes.");
    }
    return [];
  }
};

const ClipboardBoard = ({ triggerToast }: ClipboardBoardProps) => {
  const [pastedTexts, setItems] = useState<PastedItem[]>(() => {
    if (import.meta.env.MODE !== "production") {
      console.log("🔄 Loading pastes from localStorage...");
    }
    return safeParse(localStorage.getItem(LOCAL_STORAGE_KEY));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { sortedItems, handleSortChange, sortType, isAscending } =
    useSorting(pastedTexts);
  const { handleClearAll } = useClearPastes(setItems, setShowFavoritesOnly);
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setItems);
  const { copyToClipboard } = useClipboard();
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  const toggleFavorite = useCallback((id: string | number) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (import.meta.env.MODE !== "production") {
      console.log("📋 Adding clipboard paste event listener");
    }
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      if (import.meta.env.MODE !== "production") {
        console.log("❌ Removing clipboard paste event listener");
      }
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastedTexts));
  }, [pastedTexts]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = sortedItems
    .filter((item) => item.displayName.toLowerCase().includes(normalizedQuery))
    .filter((item) => (showFavoritesOnly ? item.isFavorite : true))
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

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
          <div className="empty-state">
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
