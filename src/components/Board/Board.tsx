// src/components/Board/Board.tsx
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

// DnD-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface ClipboardBoardProps {
  triggerToast: (message: string) => void;
}

const ClipboardBoard = ({ triggerToast }: ClipboardBoardProps) => {
  const [pastedTexts, setPastedTexts] = useState<PastedItem[]>(() => {
    if (import.meta.env.MODE !== "production") {
      console.log("🔄 Loading pastes from localStorage...");
    }
    return loadPastes();
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // useSorting returns the sorted *view*, not the real order in pastedTexts
  const { sortedItems, handleSortChange, sortType, isAscending } =
    useSorting(pastedTexts);

  const { handleClearAll } = useClearPastes(
    setPastedTexts,
    setShowFavoritesOnly
  );
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setPastedTexts);

  const { copyToClipboard } = useClipboard(triggerToast);
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  const toggleFavorite = useCallback((id: string) => {
    setPastedTexts((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      savePastes(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  useEffect(() => {
    savePastes(pastedTexts);
  }, [pastedTexts]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  // This filter/sort is only for displaying results.
  const filteredItems = sortedItems.filter(
    (item) =>
      item.displayName.toLowerCase().includes(normalizedQuery) &&
      (!showFavoritesOnly || item.isFavorite)
  );

  // --- DnD-kit setup ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Only allow DnD when NO search/filter and custom order
  const canDragAndDrop =
    normalizedQuery === "" && !showFavoritesOnly && sortType === "custom";

  function handleDragEnd(event: DragEndEvent) {
    if (!canDragAndDrop) return; // block dnd in non-custom
    const { active, over } = event;
    console.log("DragEnd event", { active, over });
    if (!over || active.id === over.id) return;

    // These indexes are relative to pastedTexts, not the filtered/sorted view!
    const oldIndex = pastedTexts.findIndex((item) => item.id === active.id);
    const newIndex = pastedTexts.findIndex((item) => item.id === over.id);

    console.log("Old index in pastedTexts:", oldIndex, "New index:", newIndex);
    if (oldIndex === -1 || newIndex === -1) return;

    const newArr = arrayMove(pastedTexts, oldIndex, newIndex);
    console.log(
      "New order after move:",
      newArr.map((i) => i.displayName)
    );
    setPastedTexts(newArr);
    // savePastes called by useEffect
  }

  console.log("RENDER: pastedTexts", pastedTexts);
  console.log("RENDER: sortedItems", sortedItems);
  console.log("RENDER: filteredItems", filteredItems);

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

      {!canDragAndDrop && (
        <div
          className="dnd-disabled-msg"
          style={{
            margin: "0.5em 0",
            color: "#EBCB8B",
            fontSize: "0.96em",
            fontWeight: "bold",
            textAlign: "center",
            background: "#2D2D2D",
            padding: "0.5em 1em",
            borderRadius: "6px",
          }}
          aria-live="polite"
        >
          Drag-and-drop rearrange is <b>only</b> available in{" "}
          <u>Custom Order</u> mode (no filters/search/favorites).
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="paste-container glassmorphism">
            {filteredItems.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                {searchQuery
                  ? "No matching results found."
                  : "No saved pastes yet. Try pasting something!"}
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  copyToClipboard={copyToClipboard}
                  onToggleFavorite={toggleFavorite}
                  id={item.id}
                  isDraggable={canDragAndDrop}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ClipboardBoard;
