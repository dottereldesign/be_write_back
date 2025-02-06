// src/hooks/useSorting.ts
import { useMemo, useState } from "react";
import { PastedItem } from "../types/PastedItem"; // ✅ Ensure correct import

export function useSorting(items: PastedItem[]) {
  const [sortType, setSortType] = useState<"displayName" | "timestamp">(
    "displayName"
  );

  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortType === "timestamp") {
        return isAscending
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }

      return isAscending
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName);
    });
  }, [items, sortType, isAscending]);

  const handleSortChange = (type: "displayName" | "timestamp") => {
    if (sortType === type) {
      setIsAscending(!isAscending);
    } else {
      setSortType(type);
      setIsAscending(true);
    }
  };

  return { sortedItems, handleSortChange, sortType, isAscending };
}
