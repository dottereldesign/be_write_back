// src/hooks/useClipboard.ts
export function useClipboard(triggerToast: (message: string) => void) {
  const copyToClipboard = (text: string, displayName: string) => {
    if (
      !navigator.clipboard ||
      typeof navigator.clipboard.writeText !== "function"
    ) {
      triggerToast("Clipboard API not supported in your browser.");
      return;
    }
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
