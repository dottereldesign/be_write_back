// src/utils/storage.ts
import { PastedItem } from "../types/PastedItem";
import { LOCAL_STORAGE_KEY } from "../constants/storage";

export const loadPastes = (): PastedItem[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item) =>
          typeof item.id === "string" &&
          typeof item.text === "string" &&
          typeof item.displayName === "string" &&
          typeof item.timestamp === "string"
      )
    ) {
      return parsed as PastedItem[];
    }
    return [];
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
