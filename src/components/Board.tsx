// src/components/Board.tsx
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import NameModal from "./NameModal";
import SortButtons from "./SortButtons";
import Toast from "./Toast";
import SortablePasteCard from "./Card";
import ClearButton from "./ClearButton"; // ✅ Import Clear Button
import { useToast } from "../hooks/useToast";
import { useDraggableList } from "../hooks/useDraggableList";
import "../styles/Board.css";
import { useCallback } from "react"; // ✅ Import useCallback

interface PastedItem {
  id: string;
  text: string;
  timestamp: string;
  displayName: string;
}

const PasteContainer = () => {
  const [newPaste, setNewPaste] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sortType, setSortType] = useState<"name" | "date">("date");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const {
    items: pastedTexts,
    setItems: setPastedTexts,
    handleDragEnd,
  } = useDraggableList([]);
  const { showToast, toastMessage, triggerToast } = useToast();

  useEffect(() => {
    console.log("📌 Pasted Texts Updated:", pastedTexts);
  }, [pastedTexts]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (pastedText) {
        const sanitizedText = pastedText.replace(/<\/?[^>]+(>|$)/g, "").trim();
        console.log("📋 Pasted Text (Sanitized):", sanitizedText);
        setNewPaste(sanitizedText);
        setShowModal(true);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleSaveName = (name: string) => {
    if (!newPaste) return;

    const nzDate = new Intl.DateTimeFormat("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    const newEntry: PastedItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newPaste,
      displayName: name,
      timestamp: nzDate,
    };

    console.log("🟢 Adding new entry:", newEntry);

    setPastedTexts((prev) => [...prev, newEntry]);
    setNewPaste(null);
    setShowModal(false);
  };

  const copyToClipboard = useCallback(
    (text: string, displayName: string) => {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast(`Copied contents of "${displayName}" to clipboard!`);
      });
    },
    [triggerToast]
  ); // ✅ Dependencies to prevent unnecessary recreation

  const handleClearAll = () => {
    setPastedTexts([]); // Clear state
    localStorage.removeItem("pastedTexts"); // Clear localStorage
    console.log("🗑 Cleared all pasted texts.");
  };

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div>
      {showModal && (
        <NameModal
          key={newPaste ? `modal-${newPaste}` : "modal"}
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}

      <SortButtons
        setSortType={setSortType}
        setIsAscending={setIsAscending}
        isAscending={isAscending}
        sortType={sortType}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pastedTexts.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="paste-container">
            {pastedTexts.length > 0 ? (
              pastedTexts.map((item) => (
                <SortablePasteCard
                  key={`card-${item.id}`} // ✅ Unique key fix
                  item={item}
                  copyToClipboard={copyToClipboard}
                />
              ))
            ) : (
              <p className="empty-state">
                📋 No pasted items yet. Try pasting something!
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <ClearButton onClear={handleClearAll} />

      {showToast && toastMessage && (
        <Toast message={toastMessage} onClose={() => {}} />
      )}
    </div>
  );
};

export default PasteContainer;
