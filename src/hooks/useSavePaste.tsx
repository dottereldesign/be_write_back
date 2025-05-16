// src/hooks/useSavePaste.ts
import { useState } from "react";
import { PastedItem, BoardItem } from "../types/PastedItem";
import { generateId } from "../utils/generateId";
import { formatTimestamp } from "../utils/formatTimestamp";

// Accepts the BoardItem[] setter, not PastedItem[]
export const useSavePaste = (
  setBoardItems: React.Dispatch<React.SetStateAction<BoardItem[]>>
) => {
  const [newPaste, setNewPaste] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSaveName = (name: string) => {
    if (!newPaste) return;
    const now = new Date();
    const newEntry: PastedItem = {
      id: generateId(),
      type: "card", // required for new structure
      text: newPaste,
      displayName: name,
      timestamp: formatTimestamp(now),
      createdAt: now.toISOString(),
      isFavorite: false,
    };
    setBoardItems((prev) => [...prev, newEntry]);
    setNewPaste(null);
    setShowModal(false);
  };

  return {
    newPaste,
    setNewPaste,
    showModal,
    setShowModal,
    handleSaveName,
  };
};
