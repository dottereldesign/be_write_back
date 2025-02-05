// src/hooks/useSorting.ts
import { useState, useMemo } from "react";

export function useSorting<T extends Record<string, string | number | Date>>(
  items: T[],
  sortBy: keyof T,
  isDebugMode: boolean = false
) {
  const [isAscending, setIsAscending] = useState<boolean>(true);

  if (isDebugMode) {
    console.log(
      `🔢 Sorting by ${String(sortBy)} in ${
        isAscending ? "Ascending" : "Descending"
      } order`
    );
    console.log("📋 Items before sorting:", items);
  }

  const sortedItems = useMemo(() => {
    return items.slice().sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null || bValue == null) return 0; // Handle undefined/null values gracefully

      // Handle date sorting
      if (aValue instanceof Date && bValue instanceof Date) {
        return isAscending
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Handle numeric sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return isAscending ? aValue - bValue : bValue - aValue;
      }

      // Default to string comparison
      return isAscending
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [items, sortBy, isAscending]);

  if (isDebugMode) {
    console.log("✅ Items after sorting:", sortedItems);
  }

  return { sortedItems, isAscending, setIsAscending };
}
