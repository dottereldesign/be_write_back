// src/hooks/useClearPastes.ts
import { PastedItem } from "../types/PastedItem";

const LOCAL_STORAGE_KEY = "pastedTexts"; // ✅ Same key as in Board.tsx

export const useClearPastes = (
  setPastedTexts: React.Dispatch<React.SetStateAction<PastedItem[]>>
) => {
  const handleClearAll = () => {
    setPastedTexts([]); // ✅ Clear UI state
    localStorage.removeItem(LOCAL_STORAGE_KEY); // ✅ Also clear localStorage
    console.log("🗑 Cleared all pasted texts.");
  };

  return { handleClearAll };
};
