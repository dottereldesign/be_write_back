// src/types/PastedItem.ts
export interface PastedItem {
  id: string;
  text: string;
  timestamp: string;
  displayName: string;
  manualOrder: number; // ✅ Ensure every item has a manual order
}
