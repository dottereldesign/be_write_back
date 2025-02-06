import { useCallback } from "react";

export const useClipboardPaste = (
  setNewPaste: React.Dispatch<React.SetStateAction<string | null>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (pastedText) {
        const sanitizedText = pastedText.replace(/<\/?[^>]+(>|$)/g, "").trim();
        console.log("📋 Pasted Text (Sanitized):", sanitizedText);
        setNewPaste(sanitizedText);
        setShowModal(true);
      }
    },
    [setNewPaste, setShowModal]
  );

  return { handlePaste };
};
