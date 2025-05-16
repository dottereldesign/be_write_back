// src/types/PastedItem.ts
export interface PastedItem {
  id: string;
  type: "card";
  text: string;
  displayName: string;
  timestamp: string; // Human display string
  createdAt: string; // ISO string for sorting!
  isFavorite: boolean;
}

export interface Folder {
  id: string;
  type: "folder";
  displayName: string;
  items: PastedItem[];
}

export type BoardItem = PastedItem | Folder;

// Type guards without `any`
export function isCard(item: unknown): item is PastedItem {
  return (
    !!item &&
    typeof item === "object" &&
    "type" in item &&
    (item as { type?: string }).type === "card"
  );
}
export function isFolder(item: unknown): item is Folder {
  return (
    !!item &&
    typeof item === "object" &&
    "type" in item &&
    (item as { type?: string }).type === "folder"
  );
}
