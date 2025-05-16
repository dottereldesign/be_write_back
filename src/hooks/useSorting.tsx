// src/hooks/useSorting.ts
import { useMemo, useState } from "react";
import { PastedItem } from "../types/PastedItem";

export function useSorting(items: PastedItem[]) {
  const [sortType, setSortType] = useState<"displayName" | "timestamp">(
    "displayName"
  );
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortedItems = useMemo(() => {
    const compare = (a: PastedItem, b: PastedItem) => {
      if (sortType === "timestamp") {
        return isAscending
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return isAscending
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName);
    };

    // Always coerce isFavorite to boolean for sorting
    return [...items].sort((a, b) => {
      const favOrder = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
      if (favOrder !== 0) return favOrder;
      return compare(a, b);
    });
  }, [items, sortType, isAscending]);

  const handleSortChange = (type: "displayName" | "timestamp") => {
    if (sortType === type) {
      setIsAscending((asc) => !asc);
    } else {
      setSortType(type);
      setIsAscending(true);
    }
  };

  return { sortedItems, handleSortChange, sortType, isAscending };
}
