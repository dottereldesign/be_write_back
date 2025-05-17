// src/hooks/useModalKeyboardShortcuts.tsx
import { useEffect } from "react";

interface ModalShortcutsOptions {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}

export function useModalKeyboardShortcuts({
  isOpen,
  onConfirm,
  onCancel,
}: ModalShortcutsOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
      if (event.key === "Enter" && onConfirm) {
        event.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);
}
