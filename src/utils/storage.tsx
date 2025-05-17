// src/utils/storage.ts
import {
  BoardItem,
  isCard,
  isFolder,
  Folder,
  PastedItem,
} from "../types/PastedItem";
import { LOCAL_STORAGE_KEY } from "../constants/storage";

/** Accept a triggerToast for user feedback. */
function reviveBoardItem(obj: unknown): BoardItem | null {
  if (!obj || typeof obj !== "object" || !("type" in obj)) return null;

  if (isCard(obj)) {
    const card = obj as PastedItem;
    return {
      ...card,
      isFavorite:
        typeof card.isFavorite === "boolean" ? card.isFavorite : false,
    };
  }
  if (isFolder(obj)) {
    const folder = obj as Folder;
    return {
      ...folder,
      items: Array.isArray(folder.items)
        ? folder.items.map(reviveBoardItem).filter(isCard)
        : [],
    };
  }
  return null;
}

export const loadBoardItems = (): BoardItem[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(reviveBoardItem)
      .filter((item): item is BoardItem => !!item);
  } catch (error) {
    console.error("❌ Failed to parse board items:", error);
    return [];
  }
};

export const saveBoardItems = (
  items: BoardItem[],
  triggerToast?: (msg: string) => void
) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    if (triggerToast)
      triggerToast("Storage is full or unavailable. Unable to save board.");
    console.error("❌ Failed to save board items:", error);
  }
};

export const clearBoardItems = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
