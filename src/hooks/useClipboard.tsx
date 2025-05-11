// src/hooks/useClipboard.ts
import { useToast } from "./useToast";

export function useClipboard() {
  const { triggerToast } = useToast();

  const copyToClipboard = (text: string, displayName: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        triggerToast(`Copied "${displayName}" to clipboard!`);
      })
      .catch((error) => {
        console.error("❌ Failed to copy:", error);
        triggerToast("Failed to copy to clipboard.");
      });
  };

  return { copyToClipboard };
}
