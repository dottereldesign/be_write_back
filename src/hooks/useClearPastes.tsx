// src/hooks/useClearPastes.ts
import { BoardItem } from "../types/PastedItem";

export const useClearPastes = (
  setBoardItems: React.Dispatch<React.SetStateAction<BoardItem[]>>,
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all pastes and folders? This cannot be undone."
      )
    ) {
      setBoardItems([]);
      setShowFavoritesOnly(false);
    }
  };

  return { handleClearAll };
};
