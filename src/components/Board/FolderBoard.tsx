// src/components/Board/FolderBoard.tsx
import Card from "./Card";
import SortButtons from "./SortButtons";
import SearchBar from "./SearchBar";
import "../../styles/Board.css";
import { useSorting } from "../../hooks/useSorting";
import { PastedItem, Folder } from "../../types/PastedItem";

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

interface FolderBoardProps {
  folder: Folder;
  onBack: () => void;
  onMoveCardOut: (card: PastedItem) => void;
  onMoveCardWithin: (items: PastedItem[]) => void;
  onToggleFavorite: (id: string) => void;
  copyToClipboard: (text: string, displayName: string) => void;
}

const FolderBoard = ({
  folder,
  onBack,
  onMoveCardOut,
  onMoveCardWithin,
  onToggleFavorite,
  copyToClipboard,
}: FolderBoardProps) => {
  // Local sort/filter/search state for this folder
  const { sortedItems, handleSortChange, sortType, isAscending } = useSorting(
    folder.items
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // If dropping out of folder, trigger callback
    if (over.id === "board-drop-zone") {
      const card = folder.items.find((item) => item.id === active.id);
      if (card) onMoveCardOut(card);
      return;
    }
    // Reorder within folder
    const oldIndex = folder.items.findIndex((item) => item.id === active.id);
    const newIndex = folder.items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newArr = arrayMove(folder.items, oldIndex, newIndex);
    onMoveCardWithin(newArr);
  }

  return (
    <div className="folder-board">
      <button
        onClick={onBack}
        className="back-btn"
        style={{
          margin: "0 0 12px 0",
          padding: "0.6em 1.2em",
          borderRadius: 6,
          fontSize: "1em",
          border: "none",
          background: "#232323",
          color: "#ececec",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ← Back to Board
      </button>
      <div className="buttons-container">
        <SortButtons
          onSortChange={handleSortChange}
          sortType={sortType}
          isAscending={isAscending}
        />
        <SearchBar onSearch={() => {}} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="paste-container glassmorphism">
            {sortedItems.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                Folder is empty. Drag cards in from the board!
              </div>
            ) : (
              sortedItems.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  copyToClipboard={copyToClipboard}
                  onToggleFavorite={onToggleFavorite}
                  id={item.id}
                  isDraggable={true}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default FolderBoard;
