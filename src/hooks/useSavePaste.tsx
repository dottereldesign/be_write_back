// src/hooks/useSavePaste.ts
import { useState } from "react";
import { PastedItem } from "../types/PastedItem";
import { generateId } from "../utils/generateId";
import { formatTimestamp } from "../utils/formatTimestamp";

export const useSavePaste = (
  setPastedTexts: React.Dispatch<React.SetStateAction<PastedItem[]>>
) => {
  const [newPaste, setNewPaste] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSaveName = (name: string) => {
    if (!newPaste) return;

    const timestamp = formatTimestamp();

    const newEntry: PastedItem = {
      id: generateId(),
      text: newPaste,
      displayName: name,
      timestamp,
      manualOrder: Date.now(),
    };

    console.log("🟢 Adding new entry:", newEntry);

    setPastedTexts((prev) => [...prev, newEntry]);
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
