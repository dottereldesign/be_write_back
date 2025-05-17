// src/components/Board/BoardMain.tsx
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
import FolderGrid from "./FolderGrid";
import BoardControls from "./BoardControls";
import Card from "./Card";
import { BoardItem, PastedItem, Folder, isCard } from "../../types/PastedItem";
import { useMemo } from "react";

interface BoardMainProps {
  boardItems: BoardItem[];
  setBoardItems: React.Dispatch<React.SetStateAction<BoardItem[]>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  showFolderModal: boolean;
  setShowFolderModal: (b: boolean) => void;
  setActiveFolderId: (id: string) => void;
  activeDragItem: PastedItem | null;
  setActiveDragItem: (item: PastedItem | null) => void;
  triggerClipboardPaste: () => void;
  copyToClipboard: (text: string, displayName: string) => void;
  toggleFavorite: (id: string) => void;
  handleClearAll: () => void;
}

const BoardMain = ({
  boardItems,
  setBoardItems,
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  setShowFolderModal,
  setActiveFolderId,
  activeDragItem,
  setActiveDragItem,
  triggerClipboardPaste,
  copyToClipboard,
  toggleFavorite,
  handleClearAll,
}: BoardMainProps) => {
  const cards = useMemo(
    () => boardItems.filter(isCard) as PastedItem[],
    [boardItems]
  );
  const folders = useMemo(
    () => boardItems.filter((item): item is Folder => !isCard(item)),
    [boardItems]
  );

  // -- Sorting
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = useMemo(
    () =>
      cards.filter(
        (item) =>
          item.displayName.toLowerCase().includes(normalizedQuery) &&
          (!showFavoritesOnly || item.isFavorite)
      ),
    [cards, normalizedQuery, showFavoritesOnly]
  );

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const canDragAndDrop = normalizedQuery === "" && !showFavoritesOnly;

  function handleDragEnd(event: DragEndEvent) {
    if (!canDragAndDrop) {
      setActiveDragItem(null);
      return;
    }
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over || active.id === over.id) return;

    // Folder drop
    const targetFolder = folders.find((f) => f.id === over.id);
    if (targetFolder) {
      setBoardItems((prev) => {
        const cardIdx = prev.findIndex((i) => isCard(i) && i.id === active.id);
        if (cardIdx === -1) return prev;
        const card = prev[cardIdx] as PastedItem;
        const newItems = prev.filter((i) => !(isCard(i) && i.id === active.id));
        return newItems.map((item) =>
          !isCard(item) && item.id === targetFolder.id
            ? { ...item, items: [card, ...item.items] }
            : item
        );
      });
      return;
    }

    // Reorder
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
    // Always use cards (not filteredItems, for stability)
    const found = cards.find((item) => item.id === id);
    setActiveDragItem(found || null);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveDragItem(null)}
      >
        {/* Folder Grid */}
        <FolderGrid folders={folders} onOpen={setActiveFolderId} />

        {/* Controls */}
        <BoardControls
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          setShowFolderModal={setShowFolderModal}
          triggerClipboardPaste={triggerClipboardPaste}
          setSearchQuery={setSearchQuery}
          handleClearAll={handleClearAll}
        />

        {/* Drag and drop state message */}
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

        {/* Cards */}
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
    </>
  );
};

export default BoardMain;
