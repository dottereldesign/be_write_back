// src/utils/storage.ts
import { PastedItem } from "../types/PastedItem";
import { LOCAL_STORAGE_KEY } from "../constants/storage";

// Safely load pastes from localStorage
export const loadPastes = (): PastedItem[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as PastedItem[];
  } catch (error) {
    console.error("❌ Failed to parse stored pastes:", error);
    return [];
  }
};

// Save pastes array to localStorage
export const savePastes = (pastes: PastedItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastes));
};

// Clear all saved pastes
export const clearPastes = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
