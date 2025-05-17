// src/hooks/useClipboardPaste.tsx
import { useCallback } from "react";

export const useClipboardPaste = (
  setNewPaste: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  triggerToast: (message: string) => void
) => {
  // Stable handler (safe for event listener)
  const handleClipboardEventPaste = useCallback(
    (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text") || "";
      if (pastedText.trim()) {
        setNewPaste(pastedText);
        setShowModal(true);
      }
    },
    [setNewPaste, setShowModal]
  );

  const triggerClipboardPaste = useCallback(() => {
    if (
      !navigator.clipboard ||
      typeof navigator.clipboard.readText !== "function"
    ) {
      triggerToast("Clipboard API requires HTTPS and a supported browser.");
      return;
    }
    navigator.clipboard
      .readText()
      .then((text) => {
        if (text.trim()) {
          setNewPaste(text);
          setShowModal(true);
        } else {
          triggerToast("Clipboard is empty.");
        }
      })
      .catch((error) => {
        console.error("❌ Clipboard read error:", error);
        triggerToast("Clipboard access denied or unsupported browser/context.");
      });
  }, [setNewPaste, setShowModal, triggerToast]);

  return { triggerClipboardPaste, handleClipboardEventPaste };
};
