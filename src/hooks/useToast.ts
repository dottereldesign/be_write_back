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
      console.log("⏳ Toast will disappear in 2.5s");
      setShowToast(false);
    }, 2500);
  };

  return { showToast, toastMessage, triggerToast };
}
