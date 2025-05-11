// src/types/PastedItem.ts

export interface PastedItem {
  id: string | number;
  text: string;
  displayName: string;
  timestamp: string;
  manualOrder?: number;
  isFavorite?: boolean; // ⭐ NEW: optional favorite status
}
