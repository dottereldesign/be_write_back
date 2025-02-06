// src/hooks/useToast.ts
import { useState } from "react";

export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  const triggerToast = (message: string) => {
    console.log(`🔔 Triggering Toast: "${message}"`);
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      console.log("🟠 [Toast] Starting fade-out...");
      setShowToast(false);
    }, 2000);

    setTimeout(() => {
      console.log("🔴 [Toast] Removing toast from UI.");
      setToastMessage(null); // ✅ Only clear message after the fade-out
    }, 2500);
  };

  return { showToast, toastMessage, triggerToast };
}
