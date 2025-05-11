// src/hooks/useClipboardPaste.tsx
import { useCallback } from "react";

export const useClipboardPaste = (
  setNewPaste: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  triggerToast: (message: string) => void
) => {
  const handleClipboardEventPaste = useCallback(
    (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (pastedText?.trim()) {
        setNewPaste(pastedText);
        setShowModal(true);
      }
    },
    [setNewPaste, setShowModal]
  );

  const triggerClipboardPaste = useCallback(() => {
    if (!navigator.clipboard) {
      triggerToast("Clipboard API requires secure HTTPS context.");
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
        triggerToast("Clipboard access denied or insecure context.");
      });
  }, [setNewPaste, setShowModal, triggerToast]);

  return { triggerClipboardPaste, handleClipboardEventPaste };
};
