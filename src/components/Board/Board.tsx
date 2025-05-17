// src/components/Board/Board.tsx
import { useEffect, useState, useCallback } from "react";
import NameModal from "./NameModal";
import SortButtons from "./SortButtons";
import PasteButton from "./PasteButton";
import SearchBar from "./SearchBar";
import Card from "./Card";
import ClearButton from "./ClearButton";
import FolderComponent from "./Folder";
import FolderBoard from "./FolderBoard";
import { useSorting } from "../../hooks/useSorting";
import { useClearPastes } from "../../hooks/useClearPastes";
import { useSavePaste } from "../../hooks/useSavePaste";
import { useClipboard } from "../../hooks/useClipboard";
import { useClipboardPaste } from "../../hooks/useClipboardPaste";
import { loadBoardItems, saveBoardItems } from "../../utils/storage";
import { BoardItem, PastedItem, Folder, isCard } from "../../types/PastedItem";
import "../../styles/Board.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// DnD-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
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
  const [boardItems, setBoardItems] = useState<BoardItem[]>(() => {
    if (import.meta.env.MODE !== "production") {
      console.log("🔄 Loading board items from localStorage...");
    }
    return loadBoardItems();
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // For DragOverlay ghost
  const [activeDragItem, setActiveDragItem] = useState<PastedItem | null>(null);

  const cards = boardItems.filter(isCard) as PastedItem[];
  const folders = boardItems.filter((item): item is Folder => !isCard(item));

  const { sortedItems, handleSortChange, sortType, isAscending } =
    useSorting(cards);

  const { handleClearAll } = useClearPastes(
    setBoardItems,
    setShowFavoritesOnly
  );
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setBoardItems);

  const { copyToClipboard } = useClipboard(triggerToast);
  const { triggerClipboardPaste, handleClipboardEventPaste } =
    useClipboardPaste(setNewPaste, setShowModal, triggerToast);

  const toggleFavorite = useCallback((id: string) => {
    setBoardItems((prev) =>
      prev.map((item) =>
        isCard(item) && item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  }, []);

  useEffect(() => {
    document.addEventListener("paste", handleClipboardEventPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardEventPaste);
    };
  }, [handleClipboardEventPaste]);

  useEffect(() => {
    saveBoardItems(boardItems);
  }, [boardItems]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
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
    if (!canDragAndDrop) {
      setActiveDragItem(null);
      return;
    }
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over || active.id === over.id) return;

    // Is it a folder drop?
    const targetFolder = folders.find((f) => f.id === over.id);

    if (targetFolder) {
      // Move card into folder
      setBoardItems((prev) => {
        // Remove card from board
        const cardIdx = prev.findIndex((i) => isCard(i) && i.id === active.id);
        if (cardIdx === -1) return prev; // Not found
        const card = prev[cardIdx] as PastedItem;
        // Remove from top-level items
        const newItems = prev.filter((i) => !(isCard(i) && i.id === active.id));
        // Add card to the target folder's items
        return newItems.map((item) =>
          !isCard(item) && item.id === targetFolder.id
            ? { ...item, items: [card, ...item.items] }
            : item
        );
      });
      return;
    }

    // Otherwise, normal reorder as before
    const activeIdx = cards.findIndex((item) => item.id === active.id);
    const overIdx = cards.findIndex((item) => item.id === over.id);
    if (activeIdx === -1 || overIdx === -1) return;

    const reorderedCards = arrayMove(cards, activeIdx, overIdx);
    const next: BoardItem[] = [];
    let cardI = 0;
    for (const item of boardItems) {
      if (isCard(item)) next.push(reorderedCards[cardI++]);
      else next.push(item);
    }
    setBoardItems(next);
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id;
    // Try both: filteredItems (for current view) or cards (all)
    const found =
      filteredItems.find((item) => item.id === id) ||
      cards.find((item) => item.id === id);
    setActiveDragItem(found || null);
  }

  // Helper: Get the active folder object (if one is open)
  const activeFolder =
    activeFolderId && folders.length
      ? folders.find((f) => f.id === activeFolderId) || null
      : null;

  // Handler: Move card out of a folder back to board
  function handleMoveCardOut(card: PastedItem) {
    if (!activeFolder) return;
    setBoardItems((prev) => {
      // Remove card from folder
      const newItems = prev.map((item) => {
        if (
          "type" in item &&
          item.type === "folder" &&
          item.id === activeFolder.id
        ) {
          return { ...item, items: item.items.filter((i) => i.id !== card.id) };
        }
        return item;
      });
      // Insert card back at the top level (at the start)
      return [{ ...card }, ...newItems];
    });
  }

  // Handler: Move/reorder cards within a folder
  function handleMoveCardWithin(newItems: PastedItem[]) {
    if (!activeFolder) return;
    setBoardItems((prev) =>
      prev.map((item) =>
        "type" in item && item.type === "folder" && item.id === activeFolder.id
          ? { ...item, items: newItems }
          : item
      )
    );
  }

  function handleToggleFavoriteInFolder(id: string) {
    if (!activeFolder) return;
    setBoardItems((prev) =>
      prev.map((item) => {
        if (
          "type" in item &&
          item.type === "folder" &&
          item.id === activeFolder.id
        ) {
          return {
            ...item,
            items: item.items.map((c) =>
              c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
            ),
          };
        }
        return item;
      })
    );
  }

  function handleCopyInFolder(text: string, displayName: string) {
    copyToClipboard(text, displayName);
  }

  // === RENDER ===
  if (activeFolder) {
    return (
      <FolderBoard
        folder={activeFolder}
        onBack={() => setActiveFolderId(null)}
        onMoveCardOut={handleMoveCardOut}
        onMoveCardWithin={handleMoveCardWithin}
        onToggleFavorite={handleToggleFavoriteInFolder}
        copyToClipboard={handleCopyInFolder}
      />
    );
  }

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

      {showFolderModal && (
        <NameModal
          isOpen={showFolderModal}
          onSave={(name) => {
            if (!name.trim()) return;
            setBoardItems((prev) => [
              {
                id:
                  typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now().toString(),
                type: "folder",
                displayName: name.trim(),
                items: [],
              },
              ...prev,
            ]);
            setShowFolderModal(false);
          }}
          onClose={() => setShowFolderModal(false)}
          label="Name your folder"
        />
      )}

      {/* Folder grid at the very top */}
      {folders.length > 0 && (
        <div className="desktop-folder-grid">
          {folders.map((folder) => (
            <FolderComponent
              key={folder.id}
              folder={folder}
              onOpen={(folderId) => setActiveFolderId(folderId)}
              isActive={false}
              compact
            />
          ))}
        </div>
      )}

      <div className="buttons-container">
        <div className="buttons-row">
          <button
            type="button"
            className="create-folder-btn"
            onClick={() => setShowFolderModal(true)}
            aria-label="Create a new folder"
          >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1em" }} />
            Create a Folder
          </button>

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
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveDragItem(null)}
      >
        <SortableContext
          items={[
            ...folders.map((f) => f.id), // still needed for DnD drop targets
            ...filteredItems.map((item) => item.id),
          ]}
          strategy={verticalListSortingStrategy}
        >
          <div className="paste-container glassmorphism">
            {/* No folder tiles here! Only cards */}
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
        {/* DRAG GHOST OVERLAY */}
        <DragOverlay dropAnimation={null}>
          {activeDragItem ? (
            <Card
              item={activeDragItem}
              copyToClipboard={() => {}}
              onToggleFavorite={() => {}}
              id={activeDragItem.id}
              isDraggable={false}
              className="ghost"
              style={{
                opacity: 0.5,
                boxShadow: "0 0 24px 8px #ffe080b0",
                background: "#f7f2e6",
                pointerEvents: "none",
              }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ClipboardBoard;
