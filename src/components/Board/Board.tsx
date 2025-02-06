// src/components/Board/Board.tsx
import { useEffect, useState } from "react";
import NameModal from "./NameModal";
import SortButtons from "./SortButtons";
import Toast from "./Toast";
import Card from "./Card";
import ClearButton from "./ClearButton";
import { useToast } from "../../hooks/useToast";
import { useSorting } from "../../hooks/useSorting";
import { useClearPastes } from "../../hooks/useClearPastes";
import { useClipboardPaste } from "../../hooks/useClipboardPaste";
import { useSavePaste } from "../../hooks/useSavePaste";
import { useClipboard } from "../../hooks/useClipboard";
import "../../styles/Board.css";
import { PastedItem } from "../../types/PastedItem";

const LOCAL_STORAGE_KEY = "pastedTexts"; // ✅ Define a key for localStorage

const PasteContainer = () => {
  console.log("📌 Rendering PasteContainer");

  // ✅ Load saved pastes from localStorage when the app starts
  const [pastedTexts, setItems] = useState<PastedItem[]>(() => {
    console.log("🔄 Loading pastes from localStorage...");
    const savedPastes = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedPastes ? JSON.parse(savedPastes) : [];
  });

  const { sortedItems, handleSortChange, sortType, isAscending } =
    useSorting(pastedTexts);

  const { handleClearAll } = useClearPastes(setItems);
  const { newPaste, setNewPaste, showModal, setShowModal, handleSaveName } =
    useSavePaste(setItems);
  const { copyToClipboard } = useClipboard();
  const { toastMessage } = useToast(); // ✅ Listen for toast events
  const { handlePaste } = useClipboardPaste(setNewPaste, setShowModal);

  useEffect(() => {
    console.log("📋 Adding clipboard paste event listener");
    document.addEventListener("paste", handlePaste);
    return () => {
      console.log("❌ Removing clipboard paste event listener");
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  // ✅ Save pasted texts to localStorage whenever `pastedTexts` changes
  useEffect(() => {
    console.log("💾 Saving pastes to localStorage:", pastedTexts);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastedTexts));
  }, [pastedTexts]);

  console.log("🎭 Toast Message State:", toastMessage);

  return (
    <div>
      {showModal && (
        <NameModal
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}
      <SortButtons
        onSortChange={handleSortChange}
        sortType={sortType}
        isAscending={isAscending}
      />

      <div className="paste-container">
        {sortedItems.map((item) => (
          <Card key={item.id} item={item} copyToClipboard={copyToClipboard} />
        ))}
      </div>

      <ClearButton onClear={handleClearAll} />

      {/* ✅ Ensure Toast is always in the DOM */}
      <Toast
        message={toastMessage}
        onClose={() => console.log("🚀 Toast closed")}
      />
    </div>
  );
};

export default PasteContainer;
