// src/types/PastedItem.ts
export interface PastedItem {
  id: string;
  text: string;
  displayName: string;
  timestamp: string; // Human display string
  createdAt: string; // ISO string for sorting!
  isFavorite: boolean; // now required
}
