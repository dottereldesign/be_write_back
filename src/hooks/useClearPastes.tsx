// src/hooks/useClearPastes.ts
import { PastedItem } from "../types/PastedItem";

const LOCAL_STORAGE_KEY = "bewriteback_pastedTexts";

export const useClearPastes = (
  setPastedTexts: React.Dispatch<React.SetStateAction<PastedItem[]>>,
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleClearAll = () => {
    setPastedTexts([]);
    setShowFavoritesOnly(false); // Reset favorite filter too
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (import.meta.env.MODE !== "production") {
      console.log("❌ Failed to parse stored pastes.");
    }
  };

  return { handleClearAll };
};
