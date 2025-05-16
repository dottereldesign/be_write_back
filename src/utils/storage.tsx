// src/utils/storage.ts
import { PastedItem } from "../types/PastedItem";
import { LOCAL_STORAGE_KEY } from "../constants/storage";

// Define a loose shape for unknown parsed objects (no any)
type UnknownPastedItem = {
  id?: unknown;
  text?: unknown;
  displayName?: unknown;
  timestamp?: unknown;
  createdAt?: unknown;
  isFavorite?: unknown;
};

function isPastedItem(item: unknown): item is PastedItem {
  if (typeof item !== "object" || item === null) return false;
  const o = item as UnknownPastedItem;
  return (
    typeof o.id === "string" &&
    typeof o.text === "string" &&
    typeof o.displayName === "string" &&
    typeof o.timestamp === "string" &&
    typeof o.createdAt === "string"
  );
}

export const loadPastes = (): PastedItem[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (isPastedItem(item)) {
          return {
            ...item,
            isFavorite:
              typeof item.isFavorite === "boolean" ? item.isFavorite : false,
          };
        }
        return null;
      })
      .filter((item): item is PastedItem => !!item);
  } catch (error) {
    console.error("❌ Failed to parse stored pastes:", error);
    return [];
  }
};

export const savePastes = (pastes: PastedItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastes));
  } catch (error) {
    alert("Storage is full or unavailable. Unable to save pastes.");
    console.error("❌ Failed to save pastes:", error);
  }
};

export const clearPastes = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
