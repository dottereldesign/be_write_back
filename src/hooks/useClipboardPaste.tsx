// src/hooks/useClipboardPaste.tsx
import { useCallback } from "react";

export const useClipboardPaste = (
  setNewPaste: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (pastedText) {
        console.log("📋 Pasted Text (Raw):", pastedText);
        setNewPaste(pastedText); // ✅ Keeps the original text unaltered
        setShowModal(true);
      }
    },
    [setNewPaste, setShowModal]
  );

  return { handlePaste };
};
