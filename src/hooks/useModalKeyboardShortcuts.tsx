// src/hooks/useModalKeyboardShortcuts.tsx
import { useEffect } from "react";

interface ModalShortcutsOptions {
  onConfirm?: () => void;
  onCancel: () => void;
}

export function useModalKeyboardShortcuts({
  onConfirm,
  onCancel,
}: ModalShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
      if (event.key === "Enter" && onConfirm) {
        onConfirm();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel]);
}
