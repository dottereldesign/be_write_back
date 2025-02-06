// src/hooks/useSavePaste.ts
// src/hooks/useSavePaste.ts
import { useState } from "react";
import { PastedItem } from "../types/PastedItem"; // ✅ Ensure correct import

export const useSavePaste = (
  setPastedTexts: React.Dispatch<React.SetStateAction<PastedItem[]>>
) => {
  const [newPaste, setNewPaste] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

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
      manualOrder: Date.now(), // ✅ Ensuring a default order
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
