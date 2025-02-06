// src/hooks/useToast.ts
import { useState, useRef } from "react";

export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ Use browser-compatible type

  const triggerToast = (message: string) => {
    console.log(`🔔 Triggering Toast: "${message}"`);

    // Clear any existing timeouts
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);

    // Set a timeout to clear the toast message
    toastTimeoutRef.current = setTimeout(() => {
      console.log("🔴 Clearing toast message");
      setToastMessage(null);
    }, 2500);
  };

  return { toastMessage, triggerToast };
}
