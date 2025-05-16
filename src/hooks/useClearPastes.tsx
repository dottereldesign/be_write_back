// src/hooks/useClearPastes.ts
import { PastedItem } from "../types/PastedItem";
import { LOCAL_STORAGE_KEY } from "../constants/storage";

export const useClearPastes = (
  setPastedTexts: React.Dispatch<React.SetStateAction<PastedItem[]>>,
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleClearAll = () => {
    setPastedTexts([]);
    setShowFavoritesOnly(false); // Reset favorite filter too
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (import.meta.env.MODE !== "production") {
      console.log("✅ Cleared all saved pastes.");
    }
  };

  return { handleClearAll };
};
