// src/hooks/useClipboard.ts
import { useToast } from "./useToast";

export function useClipboard() {
  const { triggerToast } = useToast(); // ✅ Ensure triggerToast is used

  const copyToClipboard = (text: string, displayName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(`Copied "${displayName}" to clipboard!`); // ✅ Show toast
    });
  };

  return { copyToClipboard };
}
