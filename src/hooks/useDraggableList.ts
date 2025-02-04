// src/hooks/useDraggableList.ts
import { useState, useEffect, useRef } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface PastedItem {
  id: string;
  text: string;
  timestamp: string;
  displayName: string;
}

export const useDraggableList = (initialItems: PastedItem[]) => {
  console.log("🔄 Initializing useDraggableList...");

  const initialized = useRef(false); // ✅ Prevent double init

  const [items, setItems] = useState<PastedItem[]>(() => {
    try {
      if (initialized.current) return initialItems;
      initialized.current = true;
      const storedPastes = localStorage.getItem("pastedTexts");
      const parsedData = storedPastes ? JSON.parse(storedPastes) : initialItems;
      console.log("📂 Loaded from Local Storage:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("❌ Error loading from localStorage:", error);
      return initialItems;
    }
  });

  useEffect(() => {
    console.log("💾 Saving to Local Storage:", items);
    if (items.length > 0) {
      localStorage.setItem("pastedTexts", JSON.stringify(items));
    }
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    console.log(`🔄 Moving item ${active.id} to ${over.id}`);

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      const updatedList = arrayMove(prev, oldIndex, newIndex);
      console.log("📦 Updated List After Drag:", updatedList);
      return updatedList;
    });
  };

  return { items, setItems, handleDragEnd };
};
