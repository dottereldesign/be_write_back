// src/hooks/useSorting.ts
import { useState } from "react";

export function useSorting<T>(items: T[], sortBy: keyof T) {
  const [isAscending, setIsAscending] = useState<boolean>(true);

  console.log(
    `🔢 Sorting by ${String(sortBy)} in ${
      isAscending ? "Ascending" : "Descending"
    } order`
  );
  console.log("📋 Items before sorting:", items);

  const sortedItems = [...items].sort((a, b) => {
    if (isAscending) {
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }
    return String(b[sortBy]).localeCompare(String(a[sortBy]));
  });

  console.log("✅ Items after sorting:", sortedItems);

  return { sortedItems, isAscending, setIsAscending };
}
